import { z } from "zod";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import Fastify, { type FastifyReply } from "fastify";
import {
  ActionRequestSchema,
  AmountCheckSchema,
  Identifier,
  PolicyRecordSchema,
  productStatusFromDecision,
  productStatusFromReceipt,
  type ActionRequest,
  type EngineReceiptStatus,
} from "@swaraj/contracts";
import { LocalKeySigner, hashObject, type Signer } from "@swaraj/crypto";
import {
  AgentMandateSchema,
  normalizeAgentMandate,
  ObjectType,
  MandatePolicySchema,
  UnifiedActionSchema,
  normalizeMandatePolicy,
  type AgentMandate,
  type UnifiedAction,
} from "@swaraj/schemas";
import { crossCheckMandateDecision, diffMandates, evaluateParsedMandate, lintMandate, type MandateDecision } from "@swaraj/rules";
import { createAmountSolver, createPolicyGateway } from "@swaraj/smt";
import type { ActionSettler, Settlement } from "@swaraj/capability";
import { createNearSettler } from "@swaraj/near";
import { bundleDigest } from "@swaraj/verify";
import {
  githubDeploymentMatches,
  githubReceiptId,
  githubSignatureValid,
  stripeEventMatches,
  stripeReceiptId,
  stripeSignatureValid,
} from "@swaraj/evidence";
import { createMemoryReceiptStore, createPostgresReceiptStore, createReceiptEngine, verifyUnifiedActionReceipt, type ReceiptStore } from "@swaraj/receipts";
import {
  createDatabase,
  createProofJobQueue,
  advanceReceipt,
  claimIdempotencyKey,
  enqueueProofJob,
  enqueueProofJobOnce,
  findProofRecord,
  findReceipt,
  findReceiptByIdempotencyKey,
  insertDecision,
  insertReceipt,
  ensureApplication,
  getActivePolicy,
  upsertActivePolicy,
  budgetResetsAt,
  budgetWindowStart,
  createMemoryBudgetSpendStore,
  createPostgresBudgetSpendStore,
  type BudgetSpendStore,
} from "@swaraj/database";
import type { Pool } from "pg";
import { buildTradeProofBundle } from "@swaraj/proofs/proof-bundles";
import { createMemoryDecisionLog, createPostgresDecisionLog, createProofRecorder } from "./proofs.js";
import { proofJobFields } from "./kurier.js";
import {
  assertLiveRuntimeEnv,
  createPipelineStack,
  createMandatePolicyGate,
  agentMandateFromMandatePolicy,
  DEMO_POLICY,
  demoPolicyForEnv,
  MANDATE_POLICY_ID,
  resolvePipelineMode,
  runPipeline,
  agentSignatureValid,
  certificateValid,
  programAllowed,
  ProgramCertificateSchema,
  type ProgramCertificate,
  unifiedActionHash,
  unifiedActionToActionRequest,
  type AuditEntry,
  type PipelineDeps,
  type PipelineMode,
  type ProveContext,
} from "./pipeline/index.js";
import { resolveBaseNetwork } from "@swaraj/evidence";
import { createLiveStateOracle, type LiveStateOracle } from "./pipeline/live-state.js";
import { proofStackStatus } from "./auto-prove.js";
import {
  CreateProjectBodySchema,
  ProjectSlugSchema,
  createProjectScaffold,
  getProject,
  listProjects,
  readProjectMandate,
  resolveExamplesRoot,
  writeProjectMandate,
} from "./projects.js";

export type ActivityItem = {
  id: string;
  at: number;
  applicationId: string;
  action: string;
  idempotencyKey: string;
  decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL";
  approvalId?: string;
  intentHash?: string;
  policyHash?: string;
  violations?: Array<{ ruleId: string; reason: string; budget?: Record<string, string> }>;
  receiptId?: string;
  capabilityId?: string;
  status?: string;
  /** Phase 2 product status: allowed | blocked | proved | cant_prove */
  productStatus?: string;
  decisionReceipt?: Record<string, unknown>;
  proof?: Record<string, unknown>;
};

/** Base Uniswap venue — only these SPOT_TRADEs enter the live Base execution pipeline. */
function isBaseSpotVenue(venue: string): boolean {
  return venue === "UNISWAP_V3_BASE";
}

export type BuildAppOptions = {
  pipelineMode?: PipelineMode;
  receiptStore?: ReceiptStore;
  signer?: Signer;
  databaseUrl?: string;
  /** Phase 8 proof queue lookup; defaults to the Postgres queue when DATABASE_URL is set. */
  proofJobs?: Pick<ReturnType<typeof createProofJobQueue>, "getByReceipt">;
  /** Bearer token for approval decisions; defaults to SWARAJ_APPROVER_TOKEN. */
  approverToken?: string;
  /** Max wait for a human decision before PENDING → EXPIRED (fail-closed BLOCK). */
  approvalSlaMs?: number;
  /** Injected clock (ms) for budget window tests. Defaults to Date.now. */
  nowMs?: () => number;
  /** The integration that executes permitted actions. Defaults to NEAR. */
  settler?: ActionSettler<UnifiedAction>;
};

type StoredPolicy = {
  applicationId: string;
  policyId: string;
  version: number;
  status: "DRAFT" | "ACTIVE" | "RETIRED";
  definition: Record<string, unknown>;
  policyHash: string;
};

type ApprovalRecord = {
  approvalId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "STALE" | "BUDGET_EXCEEDED";
  revision: number;
  action: unknown;
  mandateHash: string;
  matchedRuleIds: string[];
  requestedAt: number;
  /** Fail-closed SLA deadline: min(action.expiry, requestedAt + approvalSlaMs). */
  expiresAt: number;
  decidedBy?: string;
  decidedAt?: number;
};

type BudgetBlockResult = {
  violations: Array<{ ruleId: string; reason: string; budget?: Record<string, string> }>;
  mandateReason: string;
};

/** Default 15m. Override with SWARAJ_APPROVAL_SLA_MS or BuildAppOptions.approvalSlaMs. */
const DEFAULT_APPROVAL_SLA_MS = 15 * 60 * 1000;

const APPROVAL_DECISION_ROUTE = "/v1/applications/:applicationId/approvals/:approvalId/decision";
/** Routes that change what the agent may do. Once an approver token is set
 * they take only that owner token, so the agent's own token cannot rewrite
 * its mandate. Without one the API runs in single-operator dev mode. */
const OWNER_ROUTES = new Set([
  "POST /v1/applications/:applicationId/mandates",
  "POST /v1/applications/:applicationId/policies",
  "POST /v1/applications/:applicationId/program-certificates",
  "POST /v1/projects",
  "PUT /v1/projects/:slug/mandate",
  "POST /v1/projects/:slug/activate",
]);
/** How far an action's timestamp may sit from the gateway clock. */
const MAX_CLOCK_SKEW_MS = 5 * 60_000;
const ApprovalDecisionSchema = z.strictObject({
  decision: z.enum(["APPROVE", "REJECT"]),
  approver: z.string().regex(/^[A-Za-z0-9._:@-]{1,128}$/),
});

const DEV_SIGNER_KEY = "0x" + "11".repeat(32);

export async function buildApp(token: string, options: BuildAppOptions = {}) {
  if (token.length < 32) throw new Error("SWARAJ_DEV_TOKEN must contain at least 32 characters");
  const pipelineMode = resolvePipelineMode(process.env, options.pipelineMode);
  if (pipelineMode === "base") {
    assertLiveRuntimeEnv(process.env);
  }

  const app = Fastify({ bodyLimit: 65536 });
  const amountSolver = await createAmountSolver();
  const expected = Buffer.from(`Bearer ${token}`);
  const approverToken = options.approverToken ?? process.env.SWARAJ_APPROVER_TOKEN ?? "";
  if (approverToken.length > 0 && approverToken.length < 32) {
    throw new Error("SWARAJ_APPROVER_TOKEN must contain at least 32 characters");
  }
  if (approverToken === token) throw new Error("SWARAJ_APPROVER_TOKEN must differ from SWARAJ_DEV_TOKEN");
  const approverExpected = approverToken ? Buffer.from(`Bearer ${approverToken}`) : undefined;
  const approvalSlaMs = (() => {
    if (typeof options.approvalSlaMs === "number" && Number.isFinite(options.approvalSlaMs) && options.approvalSlaMs > 0) {
      return Math.floor(options.approvalSlaMs);
    }
    const fromEnv = Number(process.env.SWARAJ_APPROVAL_SLA_MS);
    if (Number.isFinite(fromEnv) && fromEnv > 0) return Math.floor(fromEnv);
    return DEFAULT_APPROVAL_SLA_MS;
  })();

  let pool: Pool | undefined;
  let proofJobs = options.proofJobs;
  let receiptStore = options.receiptStore;
  const databaseUrl = options.databaseUrl ?? process.env.DATABASE_URL;
  if (!receiptStore) {
    if (pipelineMode === "base") {
      if (!databaseUrl?.trim()) {
        throw new Error("DATABASE_URL is required for live Base pipeline");
      }
      pool = createDatabase(databaseUrl);
      proofJobs ??= createProofJobQueue(pool);
      receiptStore = createPostgresReceiptStore(pool);
    } else if (databaseUrl) {
      pool = createDatabase(databaseUrl);
      proofJobs ??= createProofJobQueue(pool);
      receiptStore = createPostgresReceiptStore(pool);
    } else {
      receiptStore = createMemoryReceiptStore();
    }
  } else if (databaseUrl && pipelineMode === "base") {
    pool = createDatabase(databaseUrl);
    proofJobs ??= createProofJobQueue(pool);
  }
  // Phase 4 decision log: entry hashes anchor Phase 9 Decision Receipts. Postgres when configured.
  const decisionLog = pool ? createPostgresDecisionLog(pool) : createMemoryDecisionLog();
  const policyGateway = await createPolicyGateway({ decisionStore: decisionLog.store });
  const proofs = createProofRecorder({ ...(pool ? { pool } : {}), decisionLog });
  const signerKey = process.env.SWARAJ_SIGNER_PRIVATE_KEY;
  if (pipelineMode === "base" && !options.signer && !signerKey?.trim()) {
    throw new Error("SWARAJ_SIGNER_PRIVATE_KEY is required for live Base pipeline");
  }
  const signer = options.signer ?? new LocalKeySigner(signerKey ?? DEV_SIGNER_KEY);
  // Task 2.2: the permit/forbid mandate engine (default deny) gates every
  // action on top of the SMT policy gateway.
  const mandateGateway = createMandatePolicyGate({ base: policyGateway, signer });
  const receipts = createReceiptEngine(receiptStore);
  const stack = createPipelineStack(pipelineMode, pool);
  const { evidence, capabilities, execution, labels, reservations } = stack;
  const budgetSpends: BudgetSpendStore = pool
    ? createPostgresBudgetSpendStore(pool)
    : createMemoryBudgetSpendStore();
  const nowMs = options.nowMs ?? (() => Date.now());
  const settler = options.settler ?? createNearSettler(capabilities, signer);
  const liveState: LiveStateOracle | undefined =
    pipelineMode === "base"
      ? createLiveStateOracle({
          rpcUrl: process.env.BASE_RPC_URL!,
          privateKey: process.env.SWARAJ_EXECUTION_PRIVATE_KEY as `0x${string}`,
        })
      : undefined;

  const policiesMemory = new Map<string, StoredPolicy>();
  const policyStoreKind = pool ? ("postgres" as const) : ("memory" as const);
  const decisions = new Map<string, Record<string, unknown>>();
  const proveContexts = new Map<string, ProveContext>();
  const auditLog: AuditEntry[] = [];
  const activityLog: ActivityItem[] = [];

  const demoDefinition =
    pipelineMode === "base" ? demoPolicyForEnv() : ({ ...DEMO_POLICY } as Record<string, unknown>);
  const demoHash = hashObject(ObjectType.POLICY_PROFILE, demoDefinition);
  if (pool) {
    await ensureApplication(pool, "app_demo", "Demo");
    await upsertActivePolicy(pool, {
      applicationId: "app_demo",
      policyId: "policy_demo",
      version: 1,
      definition: demoDefinition,
      policyHash: demoHash,
    });
  } else {
    policiesMemory.set("app_demo:policy_demo:1", {
      applicationId: "app_demo",
      policyId: "policy_demo",
      version: 1,
      status: "ACTIVE",
      definition: demoDefinition,
      policyHash: demoHash,
    });
  }

  const loadActivePolicy = async (
    applicationId: string,
    policyId: string,
  ): Promise<Record<string, unknown> | undefined> => {
    if (pool) {
      const row = await getActivePolicy(pool, applicationId, policyId);
      return row?.definition;
    }
    const match = [...policiesMemory.values()].find(
      (p) => p.applicationId === applicationId && p.policyId === policyId && p.status === "ACTIVE",
    );
    return match?.definition;
  };

  const pipelineDeps = (
    extra?: { unifiedAction?: UnifiedAction; mandateDefinition?: unknown },
  ): PipelineDeps => ({
    evidence,
    receipts,
    signer,
    capabilities,
    execution,
    loadActivePolicy,
    reservations,
    ...(liveState
      ? {
          requireLiveState: true as const,
          loadLiveState: () => liveState.snapshot(),
        }
      : {}),
    ...(extra?.unifiedAction ? { unifiedAction: extra.unifiedAction } : {}),
    checkPolicy: (input) =>
      mandateGateway.check(input, extra?.unifiedAction, extra?.mandateDefinition),
    audit: (entry) => {
      auditLog.push(entry);
      if (entry.kind === "DECISION") {
        const id = String(entry.detail.decisionId ?? `${entry.detail.intentHash}:${entry.at}`);
        decisions.set(id, { ...entry.detail, createdAt: entry.at, applicationId: entry.applicationId });
      }
    },
  });

  app.addHook("onClose", async () => {
    amountSolver.close();
    await policyGateway.close();
    if (pool) await pool.end();
  });
  app.addHook("onRequest", async (request, reply) => {
    reply.header("access-control-allow-origin", request.headers.origin ?? "*");
    reply.header("access-control-allow-headers", "authorization, content-type, accept");
    reply.header("access-control-allow-methods", "GET, POST, PUT, OPTIONS");
    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
    if (request.routeOptions.url === "/health") return;
    // Webhooks carry the provider's signature instead of a bearer token.
    if (request.routeOptions.url?.startsWith("/v1/webhooks/")) return;
    const supplied = Buffer.from(request.headers.authorization ?? "");
    if (request.routeOptions.url === APPROVAL_DECISION_ROUTE) {
      // Fails closed: with no approver token set, nothing can be approved.
      if (!approverExpected) return reply.code(403).send({ error: "approvals_not_configured" });
      if (supplied.length !== approverExpected.length || !timingSafeEqual(supplied, approverExpected)) {
        return reply.code(401).send({ error: "unauthorized" });
      }
      return;
    }
    if (approverExpected && OWNER_ROUTES.has(`${request.method} ${request.routeOptions.url}`)) {
      if (supplied.length !== approverExpected.length || !timingSafeEqual(supplied, approverExpected)) {
        return reply.code(401).send({ error: "owner_token_required" });
      }
      return;
    }
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return reply.code(401).send({ error: "unauthorized" });
    }
  });

  app.get("/health", async () => {
    const zk = proofStackStatus();
    const network = resolveBaseNetwork(process.env);
    return {
      status: "ok",
      mode: pipelineMode,
      executionEnabled: pipelineMode === "base" || pipelineMode === "mock",
      live: pipelineMode === "base",
      network: pipelineMode === "base" ? network.id : "mock",
      chainId: pipelineMode === "base" ? network.chainId : undefined,
      account: liveState?.accountAddress,
      phases: {
        capability: true,
        evidence: true,
        receipts: true,
        smt: true,
        lean: "Phase10",
        unifiedActions: "v1",
        mandateRules: "PERMIT_FORBID_DEFAULT_DENY",
        base: labels.base,
        execution: labels.execution,
        capabilityStore: labels.capabilityStore,
        policyStore: policyStoreKind,
        proofs: "TRADE_RECEIPT_V1+BLOCK_DECISION_V1",
        proofQueue: proofJobs ? "postgres" : "disabled",
        proofInputs: proofs.durable ? "postgres" : "memory",
        sp1: zk.sp1,
        zkVerify: zk.zkVerify,
        kurier: zk.kurier,
        proofSubmission: zk.submission,
        proofDestination: zk.destination,
        autoProve: zk.autoProve ? "on" : "off",
        evidenceFinality:
          pipelineMode === "base"
            ? "BASE_CONFIRMATIONS_12"
            : process.env.SWARAJ_EVIDENCE_FINALITY === "FINAL"
              ? "demo_FINAL"
              : "PENDING",
      },
    };
  });

  app.get<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/state",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      if (!liveState) {
        return reply.code(503).send({
          error: "live_state_unavailable",
          message: "Live portfolio state requires Base pipeline mode",
        });
      }
      const snapshot = await liveState.snapshot();
      return {
        applicationId: request.params.applicationId,
        account: liveState.accountAddress,
        source: "base_rpc",
        snapshot,
      };
    },
  );

  app.post("/v1/policy/check", async (request, reply) => {
    const input = AmountCheckSchema.safeParse(request.body);
    if (!input.success) return reply.code(400).send({ error: "invalid_policy_check" });
    return amountSolver.check(input.data);
  });

  app.post<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/policies",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const body = request.body as Record<string, unknown>;
      const policyId = typeof body.policyId === "string" ? body.policyId : "policy_demo";
      if (!Identifier.safeParse(policyId).success) {
        return reply.code(400).send({ error: "invalid_policy" });
      }

      const rawDefinition =
        body.definition !== null && typeof body.definition === "object"
          ? (body.definition as Record<string, unknown>)
          : {};
      const pick = <T>(key: string, fallback: T): T =>
        rawDefinition[key] !== undefined ? (rawDefinition[key] as T) : fallback;
      const defaults = demoPolicyForEnv() as {
        policyVersion: number;
        allowedVenues: string[];
        allowedAssets: string[];
        maxAmountPerAction: string;
        positionCap: string;
        dailyTurnoverCap: string;
        maxSlippageBps: number;
        reserveRequirement: string;
        quoteFreshnessSeconds: number;
        cooldownSeconds: number;
        finalityRule: string;
        policyExpiry: number;
        paused: boolean;
      };
      const normalized = normalizeMandatePolicy({
        policyVersion: pick("policyVersion", defaults.policyVersion),
        allowedVenues: pick("allowedVenues", [...defaults.allowedVenues]),
        allowedAssets: pick("allowedAssets", [...defaults.allowedAssets]),
        maxAmountPerAction: pick("maxAmountPerAction", defaults.maxAmountPerAction),
        positionCap: pick("positionCap", defaults.positionCap),
        dailyTurnoverCap: pick("dailyTurnoverCap", defaults.dailyTurnoverCap),
        maxSlippageBps: pick("maxSlippageBps", defaults.maxSlippageBps),
        reserveRequirement: pick("reserveRequirement", defaults.reserveRequirement),
        quoteFreshnessSeconds: pick("quoteFreshnessSeconds", defaults.quoteFreshnessSeconds),
        cooldownSeconds: pick("cooldownSeconds", defaults.cooldownSeconds),
        finalityRule: pick("finalityRule", defaults.finalityRule),
        policyExpiry: pick("policyExpiry", defaults.policyExpiry),
        paused: pick("paused", defaults.paused),
      });

      const active = await (async (): Promise<StoredPolicy | undefined> => {
        if (pool) {
          const row = await getActivePolicy(pool, request.params.applicationId, policyId);
          if (!row) return undefined;
          return {
            applicationId: row.applicationId,
            policyId: row.policyId,
            version: row.version,
            status: row.status,
            definition: row.definition,
            policyHash: row.policyHash,
          };
        }
        return [...policiesMemory.values()].find(
          (p) =>
            p.applicationId === request.params.applicationId &&
            p.policyId === policyId &&
            p.status === "ACTIVE",
        );
      })();

      const version =
        typeof body.version === "number" && Number.isInteger(body.version) && body.version > 0
          ? body.version
          : (active?.version ?? 0) + 1;

      const definition = {
        ...normalized,
        policyVersion: typeof normalized.policyVersion === "number" ? normalized.policyVersion : version,
      };
      const parsed = MandatePolicySchema.safeParse(definition);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_policy_definition", issues: parsed.error.issues });
      }

      // AtomicAmount transforms to bigint; persist/hash as decimal strings (mandate policy wire form).
      const storedDefinition: Record<string, unknown> = {
        policyVersion: parsed.data.policyVersion,
        allowedVenues: parsed.data.allowedVenues,
        allowedAssets: parsed.data.allowedAssets,
        maxAmountPerAction: parsed.data.maxAmountPerAction.toString(),
        positionCap: parsed.data.positionCap.toString(),
        dailyTurnoverCap: parsed.data.dailyTurnoverCap.toString(),
        maxSlippageBps: parsed.data.maxSlippageBps,
        reserveRequirement: parsed.data.reserveRequirement.toString(),
        quoteFreshnessSeconds: parsed.data.quoteFreshnessSeconds,
        cooldownSeconds: parsed.data.cooldownSeconds,
        finalityRule: parsed.data.finalityRule,
        policyExpiry: parsed.data.policyExpiry,
        paused: parsed.data.paused,
      };
      const policyHash = hashObject(ObjectType.POLICY_PROFILE, storedDefinition);
      const record: StoredPolicy = {
        applicationId: request.params.applicationId,
        policyId,
        version,
        status: "ACTIVE",
        definition: storedDefinition,
        policyHash,
      };
      if (pool) {
        await ensureApplication(pool, record.applicationId, record.applicationId);
        await upsertActivePolicy(pool, record);
      } else {
        for (const [key, existing] of policiesMemory) {
          if (
            existing.applicationId === record.applicationId &&
            existing.policyId === record.policyId &&
            existing.status === "ACTIVE"
          ) {
            policiesMemory.set(key, { ...existing, status: "RETIRED" });
          }
        }
        policiesMemory.set(`${record.applicationId}:${record.policyId}:${record.version}`, record);
      }
      return PolicyRecordSchema.parse(record);
    },
  );

  app.get<{ Params: { applicationId: string; policyId: string } }>(
    "/v1/applications/:applicationId/policies/:policyId",
    async (request, reply) => {
      if (
        !Identifier.safeParse(request.params.applicationId).success ||
        !Identifier.safeParse(request.params.policyId).success
      ) {
        return reply.code(400).send({ error: "invalid_policy_id" });
      }
      let match: StoredPolicy | undefined;
      if (pool) {
        const row = await getActivePolicy(pool, request.params.applicationId, request.params.policyId);
        if (row) {
          match = {
            applicationId: row.applicationId,
            policyId: row.policyId,
            version: row.version,
            status: row.status,
            definition: row.definition,
            policyHash: row.policyHash,
          };
        }
      } else {
        match = [...policiesMemory.values()].find(
          (p) =>
            p.applicationId === request.params.applicationId &&
            p.policyId === request.params.policyId &&
            p.status === "ACTIVE",
        );
      }
      if (!match) return reply.code(404).send({ error: "policy_not_found" });
      return PolicyRecordSchema.parse(match);
    },
  );

  /** Shared action handling: runs both gates and records receipts for the action routes. */
  const runActionRoute = async (
    applicationId: string,
    actionRequest: ActionRequest,
    log: { error: (message: unknown) => void },
    reply: FastifyReply,
    extra?: { unifiedAction?: UnifiedAction; mandateDefinition?: unknown },
  ) => {
    try {
      const result = await runPipeline(applicationId, actionRequest, pipelineDeps(extra));
      const at = Math.floor(Date.now() / 1000);
      if (result.decision === "BLOCK") {
        // Phase 9: a provable BLOCK becomes a PENDING Decision Receipt for the rejection-proof worker.
        const decisionReceipt = await proofs.recordBlockDecision(applicationId, result).catch((error: unknown) => {
          log.error(error);
          return { status: "NON_PROVABLE" as const, reasonCode: "NOT_RECORDED" };
        });
        const activity: ActivityItem = {
          id: `activity_${actionRequest.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
          at,
          applicationId,
          action: actionRequest.action,
          idempotencyKey: actionRequest.idempotencyKey,
          decision: "BLOCK",
          violations: result.violations,
          ...(result.intentHash ? { intentHash: result.intentHash } : {}),
          ...(result.policyHash ? { policyHash: result.policyHash } : {}),
          decisionReceipt: decisionReceipt as Record<string, unknown>,
        };
        activityLog.push(activity);
        return reply.code(200).send({
          decision: "BLOCK",
          violations: result.violations,
          ...(result.intentHash ? { intentHash: result.intentHash } : {}),
          ...(result.policyHash ? { policyHash: result.policyHash } : {}),
          ...(result.decisionId ? { decisionId: result.decisionId } : {}),
          decisionReceipt,
          activityId: activity.id,
        });
      }
      proveContexts.set(`${applicationId}:${result.receiptId}`, result.proveContext);
      // Phase 8: store the receipt-bound guest bundle for the prover when the guest would prove it.
      const proof = await proofs.recordTradeReceipt(applicationId, result.record, result.proveContext).catch((error: unknown) => {
        log.error(error);
        return { status: "NOT_PROVABLE" as const, reason: "proof inputs could not be recorded" };
      });
      const activity: ActivityItem = {
        id: `activity_${actionRequest.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
        at,
        applicationId,
        action: actionRequest.action,
        idempotencyKey: actionRequest.idempotencyKey,
        decision: "ALLOW",
        receiptId: result.receiptId,
        capabilityId: result.capabilityId,
        status: result.status,
        proof: proof as Record<string, unknown>,
        ...(result.intentHash ? { intentHash: result.intentHash } : {}),
        ...(result.policyHash ? { policyHash: result.policyHash } : {}),
      };
      activityLog.push(activity);
      return reply.code(200).send({
        decision: "ALLOW",
        receiptId: result.receiptId,
        status: result.status,
        capabilityId: result.capabilityId,
        intentHash: result.intentHash,
        policyHash: result.policyHash,
        guestBundleAvailable: true,
        proof,
        activityId: activity.id,
        ...(result.decisionId ? { decisionId: result.decisionId } : {}),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      if (message.startsWith("active_policy_not_found:")) {
        return reply.code(404).send({ error: "policy_not_found", message });
      }
      log.error(error);
      return reply.code(500).send({ error: "pipeline_failed", message });
    }
  };

  app.post<{ Params: { applicationId: string } }>("/v1/applications/:applicationId/actions", async (request, reply) => {
    if (!Identifier.safeParse(request.params.applicationId).success || !ActionRequestSchema.safeParse(request.body).success) {
      return reply.code(400).send({ error: "invalid_action" });
    }
    const body = ActionRequestSchema.parse(request.body);
    return runActionRoute(request.params.applicationId, body, request.log, reply);
  });

  const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || undefined;
  const githubSecret = process.env.GITHUB_WEBHOOK_SECRET?.trim() || undefined;
  const pendingJobKey = (receiptId: string) => `pending_job_${receiptId}`;
  /** Which provider's signed record settles this action; undefined when none is configured. */
  const signedRecordProvider = (action: UnifiedAction): "stripe" | "github" | undefined => {
    if (stripeSecret && action.action === "PAYMENT" && action.resource.service === "stripe") return "stripe";
    if (githubSecret && action.action === "DEPLOY") return "github";
    return undefined;
  };

  const matchingBudgets = (mandateDefinition: unknown, action: UnifiedAction) => {
    if (action.action !== "PAYMENT" && action.action !== "REFUND") return [];
    const mandate = AgentMandateSchema.safeParse(mandateDefinition);
    const budgets = mandate.success ? mandate.data.budgets ?? [] : [];
    return budgets.filter(
      (budget) => budget.action === action.action && budget.currency === action.context.currency,
    );
  };

  /** Read-only: would this action cross a budget? Does not insert spend rows. */
  const previewBudgetBlock = async (
    applicationId: string,
    action: UnifiedAction,
    mandateDefinition: unknown,
  ): Promise<BudgetBlockResult | undefined> => {
    if (action.action !== "PAYMENT" && action.action !== "REFUND") return undefined;
    const matching = matchingBudgets(mandateDefinition, action);
    if (matching.length === 0) return undefined;
    const amount = BigInt(action.context.amount.toString());
    const clock = nowMs();
    try {
      for (const budget of matching) {
        const windowStart = budgetWindowStart(budget.window, clock);
        const used = await budgetSpends.sumUsed(applicationId, budget.budgetId, windowStart);
        const limit = budget.limit;
        if (used + amount > limit) {
          const remaining = limit > used ? limit - used : 0n;
          return {
            mandateReason: "BUDGET_EXCEEDED",
            violations: [
              {
                ruleId: "BUDGET",
                reason: `BUDGET_EXCEEDED (${budget.budgetId})`,
                budget: {
                  budgetId: budget.budgetId,
                  limit: limit.toString(),
                  used: used.toString(),
                  requested: amount.toString(),
                  remaining: remaining.toString(),
                  resetsAt: budgetResetsAt(budget.window, clock),
                },
              },
            ],
          };
        }
      }
    } catch {
      return {
        mandateReason: "BUDGET_EXCEEDED",
        violations: [{ ruleId: "BUDGET", reason: "BUDGET_EXCEEDED (unavailable)" }],
      };
    }
    return undefined;
  };

  /** Charge matching mandate budgets fail-closed. Returns a BLOCK result, or undefined on success. */
  const reserveBudgetsForAction = async (
    applicationId: string,
    action: UnifiedAction,
    mandateDefinition: unknown,
    receiptId: string,
  ): Promise<BudgetBlockResult | undefined> => {
    if (action.action !== "PAYMENT" && action.action !== "REFUND") return undefined;
    const matching = matchingBudgets(mandateDefinition, action);
    if (matching.length === 0) return undefined;
    const amount = action.context.amount.toString();
    const clock = nowMs();
    try {
      for (const budget of matching) {
        const windowStart = budgetWindowStart(budget.window, clock);
        const reserved = await budgetSpends.tryReserve({
          receiptId: `${receiptId}:${budget.budgetId}`,
          appId: applicationId,
          budgetId: budget.budgetId,
          amount,
          limit: budget.limit.toString(),
          windowStart,
          createdAtMs: clock,
        });
        if (!reserved.ok) {
          const resetsAt = budgetResetsAt(budget.window, clock);
          return {
            mandateReason: "BUDGET_EXCEEDED",
            violations: [
              {
                ruleId: "BUDGET",
                reason: `BUDGET_EXCEEDED (${budget.budgetId})`,
                budget: {
                  budgetId: budget.budgetId,
                  limit: reserved.limit,
                  used: reserved.used,
                  requested: reserved.requested,
                  remaining: reserved.remaining,
                  resetsAt,
                },
              },
            ],
          };
        }
      }
    } catch {
      return {
        mandateReason: "BUDGET_EXCEEDED",
        violations: [{ ruleId: "BUDGET", reason: "BUDGET_EXCEEDED (unavailable)" }],
      };
    }
    return undefined;
  };

  const releaseBudgetsForReceipt = async (receiptId: string, mandateDefinition: unknown) => {
    const mandate = AgentMandateSchema.safeParse(mandateDefinition);
    const budgets = mandate.success ? mandate.data.budgets ?? [] : [];
    await Promise.all(
      budgets.map((budget) => budgetSpends.release(`${receiptId}:${budget.budgetId}`).catch(() => undefined)),
    );
  };

  /** Persist BUDGET_EXCEEDED like other mandate blocks (decision receipt + durable receipt when DB is on). */
  const replyBudgetBlock = async (ctx: {
    applicationId: string;
    action: UnifiedAction;
    mandateDefinition: unknown;
    budgetBlock: BudgetBlockResult;
    intentHash: string;
    policyHash: string;
    at: number;
    reply: FastifyReply;
    log: { error: (message: unknown) => void };
    wireAction?: unknown;
  }) => {
    const { applicationId, action, mandateDefinition, budgetBlock, intentHash, policyHash, at, reply, log } = ctx;
    const wireAction =
      ctx.wireAction ??
      JSON.parse(JSON.stringify(action, (_k, v) => (typeof v === "bigint" ? v.toString() : v)));
    const block = {
      decision: "BLOCK" as const,
      violations: budgetBlock.violations,
      intentHash,
      policyHash,
      solverStatus: "invalid" as const,
      violatedRuleIds: [],
      proveContext: {
        intent: JSON.parse(JSON.stringify(action, (_k, v) => (typeof v === "bigint" ? v.toString() : v))) as Record<
          string,
          unknown
        >,
        policy: mandateDefinition as Record<string, unknown>,
        state: {},
      },
    };
    const decisionReceipt = await proofs.recordBlockDecision(applicationId, block).catch((error: unknown) => {
      log.error(error);
      return { status: "NON_PROVABLE" as const, reasonCode: "NOT_RECORDED" };
    });
    let blockProofReceipt: { id: string; state: string } | undefined;
    if (pool) {
      const handle = { raw: pool, close: async () => {} };
      try {
        const replay = await findReceiptByIdempotencyKey(handle, applicationId, action.idempotencyKey);
        if (replay) {
          blockProofReceipt = { id: replay.receiptId, state: replay.state };
        } else {
          await handle.raw.query(
            "INSERT INTO applications (app_id, display_name) VALUES ($1, $1) ON CONFLICT (app_id) DO NOTHING",
            [applicationId],
          );
          const mandate = AgentMandateSchema.safeParse(mandateDefinition);
          const logged = await insertDecision(handle, {
            appId: applicationId,
            intentDigest: intentHash,
            policyId: MANDATE_POLICY_ID,
            policyRevision: mandate.success ? mandate.data.version : 1,
            outcome: "BLOCK",
            violatedRules: ["BUDGET"],
            smtScript: "",
          });
          const receiptId = randomUUID();
          await insertReceipt(handle, {
            receiptId,
            appId: applicationId,
            intentDigest: intentHash,
            decisionId: Number(logged.decisionId),
            claim: {
              kind: "MANDATE_DECISION_V1",
              action: wireAction,
              decision: "BLOCK",
              matchedRuleIds: ["BUDGET"],
              intentHash,
              mandateHash: policyHash,
              budget: budgetBlock.violations[0]?.budget,
            },
          });
          await claimIdempotencyKey(handle, {
            appId: applicationId,
            idemKey: action.idempotencyKey,
            intentDigest: intentHash,
            receiptId,
          });
          blockProofReceipt = { id: receiptId, state: "PENDING" };
        }
      } catch (error) {
        log.error(error);
      }
    }
    const productStatus = productStatusFromDecision("BLOCK");
    const activity: ActivityItem = {
      id: `activity_${action.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
      at,
      applicationId,
      action: action.action,
      idempotencyKey: action.idempotencyKey,
      decision: "BLOCK",
      violations: budgetBlock.violations,
      intentHash,
      policyHash,
      productStatus,
      decisionReceipt: decisionReceipt as Record<string, unknown>,
      ...(blockProofReceipt ? { receiptId: blockProofReceipt.id } : {}),
    };
    activityLog.push(activity);
    return reply.code(200).send({
      decision: "BLOCK",
      productStatus,
      mandate: { reason: budgetBlock.mandateReason, matchedRuleIds: [] },
      violations: budgetBlock.violations,
      intentHash,
      policyHash,
      decisionReceipt,
      activityId: activity.id,
      ...(blockProofReceipt ? { receipt: blockProofReceipt, receiptId: blockProofReceipt.id } : {}),
    });
  };

  /** Records, executes and queues proof for an action cleared to run, automatically or by a person. */
  const settleAllowed = async (ctx: {
    applicationId: string;
    action: UnifiedAction;
    wireAction: unknown;
    mandateDefinition: unknown;
    mandateVersion: number;
    decision: "ALLOW" | "NEEDS_APPROVAL";
    matchedRuleIds: string[];
    reason: string;
    approvedBy?: string;
    log: { error: (message: unknown) => void };
    reply: FastifyReply;
  }) => {
    const { applicationId, action, wireAction, mandateDefinition, mandateVersion, decision, matchedRuleIds, reason, approvedBy, log, reply } = ctx;
    const at = Math.floor(Date.now() / 1000);
    const intentHash = unifiedActionHash(action);
    const policyHash = hashObject(ObjectType.POLICY_PROFILE, mandateDefinition);
    // Permitted non-Base actions: durable
    // PENDING receipt + optional mandate proof job (pool mode). Fixture
    // execution adapters live in @swaraj/capability / @swaraj/evidence.
    let proofReceipt: { id: string; state: string } | undefined;
    let settlement: Settlement | undefined;
    if (pool) {
      const handle = { raw: pool, close: async () => {} }; // PoolHandle adapter over the pg pool
      try {
        // A replay returns the original outcome and must never execute again.
        const replay = await findReceiptByIdempotencyKey(handle, applicationId, action.idempotencyKey);
        if (replay) {
          if (replay.intentDigest !== intentHash) {
            return reply.code(409).send({ error: "idempotency_conflict" });
          }
          return reply.code(200).send({
            decision: "ALLOW",
            productStatus: productStatusFromReceipt(replay.state),
            status: replay.state,
            replayed: true,
            intentHash,
            policyHash,
            receipt: { id: replay.receiptId, state: replay.state },
            receiptId: replay.receiptId,
          });
        }
        const receiptId = randomUUID();
        // The receipts table references the applications registry — make
        // sure the application row exists (idempotent).
        await handle.raw.query(
          "INSERT INTO applications (app_id, display_name) VALUES ($1, $1) ON CONFLICT (app_id) DO NOTHING",
          [applicationId],
        );
        const budgetBlock = await reserveBudgetsForAction(applicationId, action, mandateDefinition, receiptId);
        if (budgetBlock) {
          return replyBudgetBlock({
            applicationId,
            action,
            mandateDefinition,
            budgetBlock,
            intentHash,
            policyHash,
            at,
            reply,
            log,
            wireAction,
          });
        }
        // Log the decision (authz_decisions) — the receipt's decision_id
        // references it.
        const logged = await insertDecision(handle, {
          appId: applicationId,
          intentDigest: intentHash,
          policyId: MANDATE_POLICY_ID,
          policyRevision: mandateVersion,
          outcome: "ALLOW",
          violatedRules: matchedRuleIds,
          smtScript: "",
        });
        await insertReceipt(handle, {
          receiptId,
          appId: applicationId,
          intentDigest: intentHash,
          decisionId: Number(logged.decisionId),
          claim: {
            kind: "MANDATE_DECISION_V1",
            action: wireAction,
            decision,
            matchedRuleIds,
            intentHash,
            mandateHash: policyHash,
            ...(approvedBy !== undefined ? { approvedBy } : {}),
          },
        });
        const claimed = await claimIdempotencyKey(handle, {
          appId: applicationId,
          idemKey: action.idempotencyKey,
          intentDigest: intentHash,
          receiptId,
        });
        if (!claimed) {
          await advanceReceipt(handle, receiptId, "INVALIDATED", { note: "lost the idempotency race" });
          await releaseBudgetsForReceipt(receiptId, mandateDefinition);
          return reply.code(409).send({ error: "idempotency_conflict" });
        }
        proofReceipt = { id: receiptId, state: "PENDING" };

        // The receipt exists before anything moves on chain.
        if (settler.handles(action)) {
          settlement = await settler.settle(action, { applicationId, intentHash, policyHash });
        }
        // Funds may already have moved on chain, so this receipt must never stay PENDING with no
        // proof job behind it: retry the queue once, then close the receipt as NON_PROVABLE.
        try {
          if (signedRecordProvider(action) !== undefined) {
            // The provider does the work; its signed webhook settles this receipt.
            await saveActiveDefinition(applicationId, pendingJobKey(receiptId), 1, {
              kind: "MANDATE",
              mandate: mandateDefinition,
              action: wireAction,
              expected: { decision, matchedRuleIds },
              intentHash,
              mandateHash: policyHash,
              ...(approvedBy !== undefined ? { approvedBy } : {}),
            });
          } else if (settlement?.status === "NOT_PROVABLE") {
            await advanceReceipt(handle, receiptId, "NON_PROVABLE", { note: settlement.reason });
            proofReceipt = { id: receiptId, state: "NON_PROVABLE" };
          } else {
            const job = {
              receiptId,
              payload: {
                kind: "MANDATE",
                mandate: mandateDefinition,
                action: wireAction,
                expected: { decision, matchedRuleIds },
                intentHash,
                mandateHash: policyHash,
                ...(approvedBy !== undefined ? { approvedBy } : {}),
                ...(settlement ? { evidenceDigest: settlement.evidenceDigest } : {}),
                ...(settlement?.status === "FINAL" && settlement.chainExecution ? { chainExecution: settlement.chainExecution } : {}),
              },
            };
            try {
              await enqueueProofJob(handle, job);
            } catch {
              await new Promise((resolve) => setTimeout(resolve, 250));
              await enqueueProofJob(handle, job);
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const nearTx = settlement?.chainTx ?? settlement?.txHash;
          log.error({ msg: "receipt bookkeeping failed after settlement", receiptId, nearTx, err: message });
          await advanceReceipt(handle, receiptId, "NON_PROVABLE", { note: `PROOF_QUEUE_FAILED: ${message}`.slice(0, 500) })
            .then(() => { proofReceipt = { id: receiptId, state: "NON_PROVABLE" }; })
            .catch((closeError: unknown) => log.error({ msg: "could not close the receipt", receiptId, err: String(closeError) }));
        }
      } catch (error) {
        log.error(error);
      }
    } else {
      // Demo / no-database: enforce budgets only. Never settle here — main has
      // no idempotency ledger without a DB, so a retry would send money twice.
      const receiptId = `mem_${createHash("sha256").update(`${applicationId}\0${action.idempotencyKey}`).digest("hex").slice(0, 32)}`;
      const budgetBlock = await reserveBudgetsForAction(applicationId, action, mandateDefinition, receiptId);
      if (budgetBlock) {
        return replyBudgetBlock({
          applicationId,
          action,
          mandateDefinition,
          budgetBlock,
          intentHash,
          policyHash,
          at,
          reply,
          log,
        });
      }
    }
    const engineStatus: EngineReceiptStatus = proofReceipt
      ? (proofReceipt.state as EngineReceiptStatus)
      : "NOT_EXECUTABLE";
    const productStatus = productStatusFromDecision("ALLOW", engineStatus);
    const activity: ActivityItem = {
      id: `activity_${action.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
      at,
      applicationId,
      action: action.action,
      idempotencyKey: action.idempotencyKey,
      decision: "ALLOW",
      status: engineStatus,
      productStatus,
      intentHash,
      policyHash,
      ...(proofReceipt ? { receiptId: proofReceipt.id } : {}),
    };
    activityLog.push(activity);
    return reply.code(200).send({
      decision: "ALLOW",
      ...(approvedBy !== undefined ? { approvedBy } : {}),
      productStatus,
      mandate: { reason, matchedPermitRuleIds: matchedRuleIds },
      status: engineStatus,
      intentHash,
      policyHash,
      activityId: activity.id,
      ...(proofReceipt ? { receipt: proofReceipt, receiptId: proofReceipt.id } : {}),
      ...(settlement
        ? {
            execution: {
              live: settler.live,
              ...(settlement.txHash ? { txHash: settlement.txHash } : {}),
              ...(settlement.chainTx ? { chainTx: settlement.chainTx } : {}),
              ...(settlement.status === "NOT_PROVABLE" ? { reason: settlement.reason } : {}),
            },
          }
        : {}),
    });

  };

  const saveActiveDefinition = async (
    applicationId: string,
    policyId: string,
    version: number,
    definition: Record<string, unknown>,
  ): Promise<string> => {
    const policyHash = hashObject(ObjectType.POLICY_PROFILE, definition);
    if (pool) {
      await ensureApplication(pool, applicationId, applicationId);
      await upsertActivePolicy(pool, { applicationId, policyId, version, definition, policyHash });
      return policyHash;
    }
    for (const [key, existing] of policiesMemory) {
      if (existing.applicationId === applicationId && existing.policyId === policyId && existing.status === "ACTIVE") {
        policiesMemory.set(key, { ...existing, status: "RETIRED" });
      }
    }
    policiesMemory.set(`${applicationId}:${policyId}:${version}`, {
      applicationId,
      policyId,
      version,
      status: "ACTIVE",
      definition,
      policyHash,
    });
    return policyHash;
  };

  // ponytail: approvals reuse the versioned policy store, one row per approval;
  // give them a table when they need listing or querying.
  const approvalKey = (approvalId: string) => `approval_${approvalId}`;
  const saveApproval = (applicationId: string, record: ApprovalRecord) =>
    saveActiveDefinition(applicationId, approvalKey(record.approvalId), record.revision, record);
  const loadApproval = async (applicationId: string, approvalId: string) =>
    (await loadActivePolicy(applicationId, approvalKey(approvalId))) as ApprovalRecord | undefined;

  /** Lazy fail-closed expiry: PENDING past expiresAt becomes EXPIRED (no hang forever). */
  const materializeApprovalExpiry = async (
    applicationId: string,
    record: ApprovalRecord,
  ): Promise<ApprovalRecord> => {
    if (record.status !== "PENDING") return record;
    const deadline =
      typeof record.expiresAt === "number" && Number.isFinite(record.expiresAt)
        ? record.expiresAt
        : (() => {
            try {
              const action = UnifiedActionSchema.parse(record.action);
              return Math.min(action.expiry, record.requestedAt + approvalSlaMs);
            } catch {
              return record.requestedAt + approvalSlaMs;
            }
          })();
    if (Date.now() < deadline) {
      return typeof record.expiresAt === "number" ? record : { ...record, expiresAt: deadline };
    }
    const expired: ApprovalRecord = {
      ...record,
      expiresAt: deadline,
      status: "EXPIRED",
      revision: record.revision + 1,
      decidedBy: "system:approval_sla",
      decidedAt: Date.now(),
    };
    await saveApproval(applicationId, expired);
    return expired;
  };

  app.get<{ Params: { applicationId: string; approvalId: string } }>(
    "/v1/applications/:applicationId/approvals/:approvalId",
    async (request, reply) => {
      const { applicationId, approvalId } = request.params;
      if (!Identifier.safeParse(applicationId).success || !Identifier.safeParse(approvalId).success) {
        return reply.code(400).send({ error: "invalid_approval_id" });
      }
      const loaded = await loadApproval(applicationId, approvalId);
      if (!loaded) return reply.code(404).send({ error: "approval_not_found" });
      return materializeApprovalExpiry(applicationId, loaded);
    },
  );

  /** Applies a provider's signed record to the receipt it names. */
  const settleFromRecord = async (
    receiptId: string | undefined,
    rawBody: string,
    matches: (action: UnifiedAction) => boolean,
    reply: FastifyReply,
  ) => {
    if (!pool || receiptId === undefined || !Identifier.safeParse(receiptId).success) {
      return reply.code(200).send({ ignored: true });
    }
    const handle = { raw: pool, close: async () => {} };
    const ledger = await findReceipt(handle, receiptId);
    const job = ledger ? await loadActivePolicy(ledger.appId, pendingJobKey(receiptId)) : undefined;
    if (!ledger || !job) return reply.code(200).send({ ignored: true });
    // Providers redeliver webhooks; only the first one can settle a receipt.
    if (ledger.state !== "PENDING") return reply.code(200).send({ state: ledger.state });
    const action = UnifiedActionSchema.parse(job.action);
    if (!matches(action)) {
      await advanceReceipt(handle, receiptId, "NON_PROVABLE", { note: "SIGNED_RECORD_MISMATCH" });
      return reply.code(200).send({ state: "NON_PROVABLE" });
    }
    const evidenceDigest = `0x${createHash("sha256").update(rawBody).digest("hex")}`;
    await enqueueProofJobOnce(handle, { receiptId, payload: { ...job, evidenceDigest } });
    return reply.code(200).send({ state: "PENDING", evidenceDigest });
  };

  // Webhooks are signed over the exact bytes, so this scope keeps the raw body.
  await app.register(async (scope) => {
    scope.addContentTypeParser("application/json", { parseAs: "string" }, (_request, body, done) => done(null, body));

    scope.post<{ Body: string }>("/v1/webhooks/stripe", async (request, reply) => {
      const header = request.headers["stripe-signature"];
      const now = Math.floor(Date.now() / 1000);
      if (!stripeSecret || typeof header !== "string" || !stripeSignatureValid(request.body, header, stripeSecret, now)) {
        return reply.code(401).send({ error: "invalid_signature" });
      }
      const event = JSON.parse(request.body) as unknown;
      return settleFromRecord(stripeReceiptId(event), request.body, (action) =>
        action.action === "PAYMENT" && stripeEventMatches(event, {
          amount: action.context.amount.toString(),
          currency: action.context.currency,
          recipient: action.context.recipient,
        }), reply);
    });

    scope.post<{ Body: string }>("/v1/webhooks/github", async (request, reply) => {
      const header = request.headers["x-hub-signature-256"];
      if (!githubSecret || typeof header !== "string" || !githubSignatureValid(request.body, header, githubSecret)) {
        return reply.code(401).send({ error: "invalid_signature" });
      }
      const event = JSON.parse(request.body) as unknown;
      // Other deployment states are progress updates, not outcomes.
      if ((event as { deployment_status?: { state?: string } }).deployment_status?.state === "in_progress") {
        return reply.code(200).send({ ignored: true });
      }
      return settleFromRecord(githubReceiptId(event), request.body, (action) =>
        action.action === "DEPLOY" && githubDeploymentMatches(event, {
          repo: action.resource.repo,
          commitHash: action.context.commitHash,
          environment: action.context.environment,
        }), reply);
    });
  });

  const CERTIFICATES_ID = "program_certificates";
  const loadCertificates = async (applicationId: string) => {
    const stored = (await loadActivePolicy(applicationId, CERTIFICATES_ID)) as
      | { revision: number; certificates: ProgramCertificate[] }
      | undefined;
    return stored ?? { revision: 0, certificates: [] };
  };

  /** Dual-engine cross-check (on unless SWARAJ_Z3_CROSSCHECK=0): Z3 must
   * independently confirm the predicate engine's decision. Disagreement or a
   * solver failure counts as not confirmed, so callers fail closed. */
  const z3Confirms = async (mandate: AgentMandate, action: UnifiedAction): Promise<boolean> => {
    if (process.env.SWARAJ_Z3_CROSSCHECK === "0") return true;
    try {
      return (await crossCheckMandateDecision(mandate, action)).agree;
    } catch {
      return false;
    }
  };

  /** Mandate-level checks outside the rule engine. Returns why the action may not proceed. */
  const mandateGateFailure = async (
    applicationId: string,
    mandate: AgentMandate,
    action: UnifiedAction,
  ): Promise<"INVALID_SIGNATURE" | "UNVERIFIED_PROGRAM" | undefined> => {
    if (mandate.agentSigner !== undefined && !(await agentSignatureValid(action, mandate.agentSigner))) {
      return "INVALID_SIGNATURE";
    }
    if (mandate.programCertifier !== undefined) {
      const { certificates } = await loadCertificates(applicationId);
      if (!(await programAllowed(action, mandate.programCertifier, certificates, Date.now()))) {
        return "UNVERIFIED_PROGRAM";
      }
    }
    return undefined;
  };

  /** Adds a certificate. Only one signed by the active mandate's certifier is accepted. */
  app.post<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/program-certificates",
    async (request, reply) => {
      const { applicationId } = request.params;
      const certificate = ProgramCertificateSchema.safeParse(request.body);
      if (!Identifier.safeParse(applicationId).success || !certificate.success) {
        return reply.code(400).send({ error: "invalid_certificate" });
      }
      const mandate = AgentMandateSchema.safeParse(await loadActivePolicy(applicationId, MANDATE_POLICY_ID));
      const certifier = mandate.success ? mandate.data.programCertifier : undefined;
      if (certifier === undefined || !(await certificateValid(certificate.data, certifier, Date.now()))) {
        return reply.code(422).send({ error: "certificate_rejected" });
      }
      const stored = await loadCertificates(applicationId);
      const certificates = [
        ...stored.certificates.filter((c) => c.program !== certificate.data.program),
        certificate.data,
      ];
      const revision = stored.revision + 1;
      await saveActiveDefinition(applicationId, CERTIFICATES_ID, revision, { revision, certificates });
      return reply.code(201).send({ program: certificate.data.program, codeHash: certificate.data.codeHash });
    },
  );

  /** A person's decision. Needs the approver token: the agent's token cannot reach this route. */
  app.post<{ Params: { applicationId: string; approvalId: string } }>(
    APPROVAL_DECISION_ROUTE,
    async (request, reply) => {
      const { applicationId, approvalId } = request.params;
      const body = ApprovalDecisionSchema.safeParse(request.body);
      if (!Identifier.safeParse(applicationId).success || !Identifier.safeParse(approvalId).success || !body.success) {
        return reply.code(400).send({ error: "invalid_approval_decision" });
      }
      const loaded = await loadApproval(applicationId, approvalId);
      if (!loaded) return reply.code(404).send({ error: "approval_not_found" });
      const record = await materializeApprovalExpiry(applicationId, loaded);
      if (record.status !== "PENDING") {
        if (record.status === "EXPIRED") {
          return reply.code(409).send({
            error: "approval_expired",
            reason: "approval_sla_timeout",
            status: "EXPIRED",
            expiresAt: record.expiresAt,
            decision: "BLOCK",
            productStatus: "blocked",
          });
        }
        return reply.code(409).send({ error: "approval_already_decided", status: record.status });
      }
      const close = async (status: ApprovalRecord["status"]) => {
        await saveApproval(applicationId, {
          ...record,
          status,
          revision: record.revision + 1,
          decidedBy: body.data.approver,
          decidedAt: Date.now(),
        });
      };
      if (body.data.decision === "REJECT") {
        await close("REJECTED");
        return reply.code(200).send({ decision: "BLOCK", productStatus: "blocked", approvalId, status: "REJECTED" });
      }

      const action = UnifiedActionSchema.parse(record.action);
      if (Date.now() >= action.expiry || Date.now() >= record.expiresAt) {
        await close("EXPIRED");
        return reply.code(409).send({
          error: "approval_expired",
          reason: Date.now() >= record.expiresAt ? "approval_sla_timeout" : "action_expiry",
          status: "EXPIRED",
          expiresAt: record.expiresAt,
          decision: "BLOCK",
          productStatus: "blocked",
        });
      }
      // The approval covers the mandate it was requested under, never a later one.
      const mandateDefinition = await loadActivePolicy(applicationId, MANDATE_POLICY_ID);
      const mandate = AgentMandateSchema.safeParse(mandateDefinition);
      const current = mandate.success ? evaluateParsedMandate(mandate.data, action) : undefined;
      if (
        !mandate.success ||
        !current ||
        hashObject(ObjectType.POLICY_PROFILE, mandateDefinition) !== record.mandateHash ||
        current.decision !== "NEEDS_APPROVAL" ||
        // The window was checked against the request time; it must still be open now.
        Date.now() >= mandate.data.validUntil
      ) {
        await close("STALE");
        return reply.code(409).send({ error: "mandate_changed" });
      }
      // The human approves the decision, not the engines: Z3 must still confirm it.
      if (!(await z3Confirms(mandate.data, action))) {
        await close("STALE");
        return reply.code(409).send({ error: "gate_failed", reason: "ENGINE_DISAGREEMENT" });
      }
      const gateFailure = await mandateGateFailure(applicationId, mandate.data, action);
      if (gateFailure !== undefined) {
        await close("STALE");
        return reply.code(409).send({ error: "gate_failed", reason: gateFailure });
      }
      // ponytail: the Base pipeline re-gates on ALLOW only, so it cannot run an approved action yet.
      if (action.action === "SPOT_TRADE" && isBaseSpotVenue(action.resource.venue)) {
        return reply.code(409).send({ error: "approval_unsupported_for_venue" });
      }
      // Budget may have been spent while waiting; do not mark APPROVED if the payment cannot run.
      const budgetBlock = await previewBudgetBlock(applicationId, action, mandateDefinition);
      if (budgetBlock) {
        await close("BUDGET_EXCEEDED");
        const intentHash = unifiedActionHash(action);
        const policyHash = hashObject(ObjectType.POLICY_PROFILE, mandateDefinition);
        return replyBudgetBlock({
          applicationId,
          action,
          mandateDefinition,
          budgetBlock,
          intentHash,
          policyHash,
          at: Math.floor(Date.now() / 1000),
          reply,
          log: request.log,
          wireAction: record.action,
        });
      }
      await close("APPROVED");
      return settleAllowed({
        applicationId,
        action,
        wireAction: record.action,
        mandateDefinition,
        mandateVersion: mandate.data.version,
        decision: "NEEDS_APPROVAL",
        matchedRuleIds: current.matchedRuleIds,
        reason: current.reason,
        approvedBy: body.data.approver,
        log: request.log,
        reply,
      });
    },
  );

  /** Dry run: what is wrong with a candidate mandate, and what it would change. Nothing is saved. */
  app.post<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/mandates/check",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const parsed = AgentMandateSchema.safeParse(request.body);
      if (!parsed.success) {
        const issues = parsed.error.issues.slice(0, 10).map((issue) => ({
          path: issue.path.join(".") || "(root)",
          message: issue.message,
        }));
        return reply.code(400).send({ error: "invalid_mandate", issues });
      }
      const active = AgentMandateSchema.safeParse(
        await loadActivePolicy(request.params.applicationId, MANDATE_POLICY_ID),
      );
      return {
        issues: lintMandate(parsed.data),
        ...(active.success ? { diff: diffMandates(active.data, parsed.data) } : {}),
      };
    },
  );

  /** Task 2.1 (Agent Mandate): register the application's ACTIVE mandate. */
  app.post<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/mandates",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const parsed = AgentMandateSchema.safeParse(request.body);
      if (!parsed.success) {
        // Never echo rejected values back.
        const issues = parsed.error.issues.slice(0, 10).map((issue) => ({
          path: issue.path.join(".") || "(root)",
          message: issue.message,
        }));
        return reply.code(400).send({ error: "invalid_mandate", issues });
      }
      const applicationId = request.params.applicationId;
      const definition = normalizeAgentMandate(
        request.body as { rules: Array<{ ruleId: string }> },
      ) as Record<string, unknown>;
      const version =
        typeof (definition as { version?: unknown }).version === "number"
          ? ((definition as { version: number }).version)
          : 1;
      const mandateHash = await saveActiveDefinition(applicationId, MANDATE_POLICY_ID, version, definition);
      return reply.code(201).send({
        mandateId: String(definition.mandateId),
        version,
        policyHash: mandateHash,
        ruleCount: Array.isArray(definition.rules) ? definition.rules.length : 0,
        issues: lintMandate(parsed.data),
      });
    },
  );

  app.get<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/mandates",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const definition = await loadActivePolicy(request.params.applicationId, MANDATE_POLICY_ID);
      if (!definition) return reply.code(404).send({ error: "mandate_not_found" });
      const { policyHash, ...rest } = definition as { policyHash?: string };
      return { mandate: rest, policyHash };
    },
  );

  /** Read-only budget usage for the active mandate (used / remaining / resetsAt). */
  app.get<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/budgets",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const definition = await loadActivePolicy(request.params.applicationId, MANDATE_POLICY_ID);
      const mandate = AgentMandateSchema.safeParse(definition);
      if (!mandate.success) return reply.code(404).send({ error: "mandate_not_found" });
      const clock = nowMs();
      const budgets = [];
      for (const budget of mandate.data.budgets ?? []) {
        const windowStart = budgetWindowStart(budget.window, clock);
        let used = 0n;
        try {
          used = await budgetSpends.sumUsed(request.params.applicationId, budget.budgetId, windowStart);
        } catch {
          return reply.code(503).send({ error: "budget_unavailable" });
        }
        const limit = budget.limit;
        const remaining = limit > used ? limit - used : 0n;
        budgets.push({
          budgetId: budget.budgetId,
          action: budget.action,
          currency: budget.currency,
          window: budget.window,
          limit: limit.toString(),
          used: used.toString(),
          remaining: remaining.toString(),
          resetsAt: budgetResetsAt(budget.window, clock),
        });
      }
      return { budgets };
    },
  );

  /** Gateway for unified actions: checks the active mandate, then settles what it allows. */
  app.post<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/unified-actions",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const body = request.body as { action?: unknown } | undefined;
      const parsed = UnifiedActionSchema.safeParse(body?.action);
      if (!parsed.success) {
        // Field paths and messages only; rejected values are never echoed.
        const issues = parsed.error.issues.slice(0, 10).map((issue) => ({
          path: issue.path.join(".") || "(root)",
          message: issue.message,
        }));
        return reply.code(400).send({ error: "invalid_unified_action", issues });
      }
      const action = parsed.data;
      const applicationId = request.params.applicationId;

      // Resolve the ACTIVE mandate: a registered mandate wins; otherwise one
      // is derived from the ACTIVE mandate policy (fail closed if neither).
      const registered = await loadActivePolicy(applicationId, MANDATE_POLICY_ID);
      const policyDefinition = await loadActivePolicy(applicationId, "policy_demo");
      const mandateDefinition = registered ?? agentMandateFromMandatePolicy(policyDefinition ?? {});
      if (!registered && !policyDefinition) {
        return reply.code(404).send({ error: "mandate_not_found", message: "no active mandate or policy" });
      }
      const mandateParsed = AgentMandateSchema.safeParse(mandateDefinition);
      let evaluated: MandateDecision = mandateParsed.success
        ? evaluateParsedMandate(mandateParsed.data, action)
        : {
            decision: "BLOCK",
            reason: "INVALID_MANDATE",
            matchedRuleIds: [],
            matchedPermitRuleIds: [],
            matchedForbidRuleIds: [],
          };

      // Disagreement between the engines is a fail-closed BLOCK (ENGINE_DISAGREEMENT).
      if (mandateParsed.success && !(await z3Confirms(mandateParsed.data, action))) {
        evaluated = {
          decision: "BLOCK",
          reason: "ENGINE_DISAGREEMENT",
          matchedRuleIds: [],
          matchedPermitRuleIds: [],
          matchedForbidRuleIds: [],
        };
      }

      // The mandate window and timestamp predicates read action.timestamp, which
      // the agent chooses: only trust it close to the gateway's own clock.
      const now = Date.now();
      const clockFailure =
        action.expiry <= now ? "ACTION_EXPIRED" : Math.abs(action.timestamp - now) > MAX_CLOCK_SKEW_MS ? "CLOCK_SKEW" : undefined;
      const gateFailure =
        clockFailure ?? (mandateParsed.success ? await mandateGateFailure(applicationId, mandateParsed.data, action) : undefined);
      if (gateFailure !== undefined) {
        evaluated = {
          decision: "BLOCK",
          reason: gateFailure,
          matchedRuleIds: [],
          matchedPermitRuleIds: [],
          matchedForbidRuleIds: [],
        };
      }

      // Base SPOT_TRADE survives the mandate: run the full pipeline (SMT gate,
      // capability, Uniswap execution, receipts). Other actions use
      // the durable mandate-receipt path below (fixture adapters; Phase 2).
      if (
        evaluated.decision === "ALLOW" &&
        action.action === "SPOT_TRADE" &&
        isBaseSpotVenue(action.resource.venue)
      ) {
        const policyVersion =
          typeof (policyDefinition as { policyVersion?: unknown } | undefined)?.policyVersion === "number"
            ? (policyDefinition as { policyVersion: number }).policyVersion
            : 1;
        const actionRequest = unifiedActionToActionRequest(action, policyVersion);
        if (actionRequest) {
          return runActionRoute(applicationId, actionRequest, request.log, reply, {
            unifiedAction: action,
            mandateDefinition,
          });
        }
      }

      const at = Math.floor(Date.now() / 1000);
      const intentHash = unifiedActionHash(action);
      const policyHash = hashObject(ObjectType.POLICY_PROFILE, mandateDefinition);

      if (evaluated.decision === "NEEDS_APPROVAL") {
        const approvalId = `appr_${intentHash.slice(2, 34)}`;
        const existingRaw = await loadApproval(applicationId, approvalId);
        const existing = existingRaw
          ? await materializeApprovalExpiry(applicationId, existingRaw)
          : undefined;
        if (existing?.status === "EXPIRED") {
          return reply.code(409).send({
            error: "approval_expired",
            reason: "approval_sla_timeout",
            status: "EXPIRED",
            approvalId,
            expiresAt: existing.expiresAt,
            decision: "BLOCK",
            productStatus: "blocked",
          });
        }
        const requestedAt = Date.now();
        const record: ApprovalRecord = existing ?? {
          approvalId,
          status: "PENDING",
          revision: 1,
          action: (request.body as { action?: unknown })?.action,
          mandateHash: policyHash,
          matchedRuleIds: evaluated.matchedRuleIds,
          requestedAt,
          expiresAt: Math.min(action.expiry, requestedAt + approvalSlaMs),
        };
        if (!existing) await saveApproval(applicationId, record);
        const productStatus = productStatusFromDecision("NEEDS_APPROVAL");
        activityLog.push({
          id: `activity_${action.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
          at,
          applicationId,
          action: action.action,
          idempotencyKey: action.idempotencyKey,
          decision: "NEEDS_APPROVAL",
          intentHash,
          policyHash,
          productStatus,
          approvalId,
        });
        return reply.code(202).send({
          decision: "NEEDS_APPROVAL",
          productStatus,
          mandate: { reason: evaluated.reason, matchedRuleIds: evaluated.matchedRuleIds },
          intentHash,
          policyHash,
          approvalId,
          approvalStatus: record.status,
          expiresAt: record.expiresAt,
          approvalSlaMs,
        });
      }

      if (evaluated.decision === "BLOCK") {
        const matched = [...evaluated.matchedForbidRuleIds, ...evaluated.matchedPermitRuleIds];
        const detail = matched.length > 0 ? ` (${matched.join(", ")})` : "";
        const violations = [{ ruleId: "MANDATE", reason: `MANDATE:${evaluated.reason}${detail}` }];
        const wireAction = (request.body as { action?: unknown })?.action;
        const block = {
          decision: "BLOCK" as const,
          violations,
          intentHash,
          policyHash,
          solverStatus: "invalid" as const,
          violatedRuleIds: [],
          proveContext: {
            intent: JSON.parse(JSON.stringify(action, (_k, v) => (typeof v === "bigint" ? v.toString() : v))) as Record<string, unknown>,
            policy: mandateDefinition as Record<string, unknown>,
            state: {},
          },
        };
        const decisionReceipt = await proofs.recordBlockDecision(applicationId, block).catch((error: unknown) => {
          request.log.error(error);
          return { status: "NON_PROVABLE" as const, reasonCode: "NOT_RECORDED" };
        });
        // A BLOCK the mandate itself decided gets a PENDING receipt and a
        // MANDATE proof job, so rejections become provable too. Blocks from a
        // bad signature, an unverified program or an engine disagreement do
        // not: the mandate alone does not explain them. A duplicate decision
        // for the same intent reuses the recorded receipt.
        let blockProofReceipt: { id: string; state: string } | undefined;
        const mandateDecided = mandateParsed.success && gateFailure === undefined && evaluated.reason !== "ENGINE_DISAGREEMENT";
        if (pool && mandateDecided) {
          const handle = { raw: pool, close: async () => {} };
          try {
            const replay = await findReceiptByIdempotencyKey(handle, applicationId, action.idempotencyKey);
            if (replay) {
              blockProofReceipt = { id: replay.receiptId, state: replay.state };
            } else {
              await handle.raw.query(
                "INSERT INTO applications (app_id, display_name) VALUES ($1, $1) ON CONFLICT (app_id) DO NOTHING",
                [applicationId],
              );
              const logged = await insertDecision(handle, {
                appId: applicationId,
                intentDigest: intentHash,
                policyId: MANDATE_POLICY_ID,
                policyRevision: mandateParsed.success ? mandateParsed.data.version : 1,
                outcome: "BLOCK",
                violatedRules: evaluated.matchedRuleIds,
                smtScript: "",
              });
              const receiptId = randomUUID();
              await insertReceipt(handle, {
                receiptId,
                appId: applicationId,
                intentDigest: intentHash,
                decisionId: Number(logged.decisionId),
                claim: {
                  kind: "MANDATE_DECISION_V1",
                  action: wireAction,
                  decision: "BLOCK",
                  matchedRuleIds: evaluated.matchedRuleIds,
                  intentHash,
                  mandateHash: policyHash,
                },
              });
              await claimIdempotencyKey(handle, {
                appId: applicationId,
                idemKey: action.idempotencyKey,
                intentDigest: intentHash,
                receiptId,
              });
              await enqueueProofJobOnce(handle, {
                receiptId,
                payload: {
                  kind: "MANDATE",
                  mandate: mandateDefinition,
                  action: wireAction,
                  // The deciding rules only, as the rules engine reports them, so the worker's re-check matches.
                  expected: { decision: "BLOCK", matchedRuleIds: evaluated.matchedRuleIds },
                  intentHash,
                  mandateHash: policyHash,
                },
              });
              blockProofReceipt = { id: receiptId, state: "PENDING" };
            }
          } catch (error) {
            request.log.error(error);
          }
        }
        const productStatus = productStatusFromDecision("BLOCK");
        const activity: ActivityItem = {
          id: `activity_${action.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
          at,
          applicationId,
          action: action.action,
          idempotencyKey: action.idempotencyKey,
          decision: "BLOCK",
          violations,
          intentHash,
          policyHash,
          productStatus,
          decisionReceipt: decisionReceipt as Record<string, unknown>,
        };
        activityLog.push(activity);
        return reply.code(200).send({
          decision: "BLOCK",
          productStatus,
          mandate: { reason: evaluated.reason, matchedRuleIds: evaluated.matchedRuleIds },
          violations,
          intentHash,
          policyHash,
          decisionReceipt,
          ...(blockProofReceipt ? { receipt: blockProofReceipt, receiptId: blockProofReceipt.id } : {}),
          activityId: activity.id,
        });
      }

      return settleAllowed({
        applicationId,
        action,
        wireAction: (request.body as { action?: unknown })?.action,
        mandateDefinition,
        mandateVersion: mandateParsed.success ? mandateParsed.data.version : 1,
        decision: "ALLOW",
        matchedRuleIds: evaluated.matchedPermitRuleIds,
        reason: evaluated.reason,
        log: request.log,
        reply,
      });
    },
  );

  app.get<{ Params: { applicationId: string; decisionId: string } }>(
    "/v1/applications/:applicationId/decisions/:decisionId",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const row = decisions.get(request.params.decisionId);
      if (!row || row.applicationId !== request.params.applicationId) {
        return reply.code(404).send({ error: "decision_not_found" });
      }
      return row;
    },
  );

  app.get<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/audit",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      return {
        entries: auditLog.filter((e) => e.applicationId === request.params.applicationId).slice(-100),
      };
    },
  );

  /** Agent-view feed: proposed actions with ALLOW/BLOCK, why, receipts, proof refs. */
  app.get<{ Params: { applicationId: string } }>(
    "/v1/applications/:applicationId/activity",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const items = activityLog
        .filter((e) => e.applicationId === request.params.applicationId)
        .slice(-100)
        .reverse();
      return { items };
    },
  );

  /** Verifies a receipt's action, hash, issuer signature and binding. */
  app.get<{ Params: { applicationId: string; receiptId: string } }>(
    "/v1/applications/:applicationId/receipts/:receiptId/verify",
    async (request, reply) => {
      if (
        !Identifier.safeParse(request.params.applicationId).success ||
        !Identifier.safeParse(request.params.receiptId).success
      ) {
        return reply.code(400).send({ error: "invalid_receipt_id" });
      }
      const record = await receipts.getReceipt(request.params.applicationId, request.params.receiptId);
      if (!record) return reply.code(404).send({ error: "receipt_not_found" });
      const verification = await verifyUnifiedActionReceipt(record, signer.address);
      const intentJson = record.intentJson as { action?: { action?: unknown; agent?: unknown } } | undefined;
      return {
        receiptId: record.receiptId,
        status: record.status,
        productStatus: productStatusFromReceipt(record.status as EngineReceiptStatus),
        valid: verification.valid,
        format: verification.format,
        checks: verification.checks,
        intentHash: record.intentHash,
        policyHash: record.policyHash,
        ...(intentJson?.action?.action
          ? { action: { type: intentJson.action.action, agent: intentJson.action.agent } }
          : {}),
      };
    },
  );

  app.get<{ Params: { applicationId: string; receiptId: string } }>(
    "/v1/applications/:applicationId/receipts/:receiptId",
    async (request, reply) => {
      if (
        !Identifier.safeParse(request.params.applicationId).success ||
        !Identifier.safeParse(request.params.receiptId).success
      ) {
        return reply.code(400).send({ error: "invalid_receipt_id" });
      }
      const record = await receipts.getReceipt(request.params.applicationId, request.params.receiptId);
      if (!record) {
        // Mandate receipts (non-Base actions) live in the proof ledger, not the trade store.
        const ledger = pool
          ? await findReceipt({ raw: pool, close: async () => {} }, request.params.receiptId)
          : undefined;
        if (!ledger || ledger.appId !== request.params.applicationId) {
          return reply.code(404).send({ error: "receipt_not_found" });
        }
        return {
          receiptId: ledger.receiptId,
          status: ledger.state,
          productStatus: productStatusFromReceipt(ledger.state),
          claim: ledger.claim,
          intentHash: ledger.intentDigest,
          proof: { ...(ledger.proofRef ? { reference: ledger.proofRef } : {}) },
        };
      }
      const key = `${request.params.applicationId}:${request.params.receiptId}`;
      const proofJob = await proofJobs?.getByReceipt(request.params.applicationId, request.params.receiptId);
      const storedBundle = await proofs.getTradeBundle(request.params.applicationId, request.params.receiptId);
      return {
        receiptId: record.receiptId,
        status: record.status,
        productStatus: productStatusFromReceipt(record.status as EngineReceiptStatus),
        claim: record.claimType,
        ...(record.reasonCode !== undefined ? { reason: record.reasonCode, reasonCode: record.reasonCode } : {}),
        signedReceipt: record.signedReceipt,
        evidenceRoot: record.evidenceRoot,
        intentHash: record.intentHash,
        policyHash: record.policyHash,
        proof: {
          // Submission identity and status come from the durable proof-job row.
          status: proofJob?.state ?? (storedBundle ? "AWAITING_PROOF" : "NOT_QUEUED"),
          ...proofJobFields(proofJob),
          ...(record.proofReference ? { reference: record.proofReference } : {}),
        },
        assumptions: {
          venue: "UNISWAP_V3_BASE",
          finalityRule: "BASE_CONFIRMATIONS_12",
          execution: labels.execution,
          base: labels.base,
          proofs: storedBundle || proveContexts.has(key) ? "guest_bundle_ready" : "not_configured",
          claimScope: "TRADE_RECEIPT_V1",
        },
      };
    },
  );

  /** Portable proof of a mandate receipt; `swaraj-verify` checks it with no Swaraj service. */
  app.get<{ Params: { applicationId: string; receiptId: string } }>(
    "/v1/applications/:applicationId/receipts/:receiptId/bundle",
    async (request, reply) => {
      const { applicationId, receiptId } = request.params;
      if (!Identifier.safeParse(applicationId).success || !Identifier.safeParse(receiptId).success) {
        return reply.code(400).send({ error: "invalid_receipt_id" });
      }
      if (!pool) return reply.code(404).send({ error: "receipt_not_found" });
      const handle = { raw: pool, close: async () => {} };
      const ledger = await findReceipt(handle, receiptId);
      if (!ledger || ledger.appId !== applicationId) {
        return reply.code(404).send({ error: "receipt_not_found" });
      }
      const record = await findProofRecord(handle, receiptId);
      if (ledger.state !== "PROVED" || !ledger.proofRef || !record) {
        return reply.code(409).send({ error: "receipt_not_proved", state: ledger.state });
      }
      const job = record.payload as {
        action: unknown;
        mandate: unknown;
        intentHash: string;
        mandateHash: string;
        expected: { decision: string; matchedRuleIds: string[] };
        approvedBy?: string;
        evidenceDigest?: string;
        chainExecution?: unknown;
      };
      const artifact = record.artifact as { statementId: string; canonicalText: string };
      const unsigned = {
        receiptId,
        state: ledger.state,
        proofRef: ledger.proofRef,
        statementId: artifact.statementId,
      };
      return {
        version: "swaraj/receipt-bundle/v1",
        ...unsigned,
        action: job.action,
        mandate: job.mandate,
        intentHash: job.intentHash,
        mandateHash: job.mandateHash,
        decision: job.expected.decision,
        matchedRuleIds: job.expected.matchedRuleIds,
        ...(job.approvedBy !== undefined ? { approvedBy: job.approvedBy } : {}),
        ...(job.evidenceDigest !== undefined ? { evidenceDigest: job.evidenceDigest } : {}),
        ...(job.chainExecution !== undefined ? { chainExecution: job.chainExecution } : {}),
        statementText: artifact.canonicalText,
        issuer: signer.address,
        signature: await signer.signDigest(bundleDigest(unsigned)),
      };
    },
  );

  /** Phase 7 bridge: export GuestInputBundle JSON for the SP1 host (`--input`). */
  app.get<{ Params: { applicationId: string; receiptId: string } }>(
    "/v1/applications/:applicationId/receipts/:receiptId/guest-bundle",
    async (request, reply) => {
      if (
        !Identifier.safeParse(request.params.applicationId).success ||
        !Identifier.safeParse(request.params.receiptId).success
      ) {
        return reply.code(400).send({ error: "invalid_receipt_id" });
      }
      const record = await receipts.getReceipt(request.params.applicationId, request.params.receiptId);
      if (!record) return reply.code(404).send({ error: "receipt_not_found" });
      const stored = await proofs.getTradeBundle(request.params.applicationId, request.params.receiptId);
      const ctx = proveContexts.get(`${request.params.applicationId}:${request.params.receiptId}`);
      if (!stored && !ctx) return reply.code(404).send({ error: "guest_bundle_unavailable" });
      try {
        // Bound to this exact signed receipt, so an SP1 proof of it can only promote this receipt.
        const bundle = stored ?? buildTradeProofBundle({ ...ctx!, receipt: record.signedReceipt });
        return {
          receiptId: record.receiptId,
          note: "Feed to SP1 host via --input. ALLOW over FINAL trade evidence yields TRADE_RECEIPT_V1; only the proof worker promotes the receipt after zkVerify finality.",
          guestBundle: bundle,
        };
      } catch (error) {
        return reply.code(500).send({
          error: "guest_bundle_build_failed",
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    },
  );

  /** Phase 9: Decision Receipt for a provable BLOCK, with its rejection-proof status. */
  app.get<{ Params: { applicationId: string; decisionReceiptId: string } }>(
    "/v1/applications/:applicationId/decision-receipts/:decisionReceiptId",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const found = await proofs.getDecisionReceipt(request.params.applicationId, request.params.decisionReceiptId);
      if (!found) return reply.code(404).send({ error: "decision_receipt_not_found" });
      const { receipt, job } = found;
      return {
        id: receipt.id,
        status: receipt.status,
        decision: receipt.decision,
        violatedRuleIds: receipt.violatedRuleIds,
        intentHash: receipt.intentHash,
        policyHash: receipt.policyHash,
        stateHash: receipt.stateHash,
        decisionLogEntryHash: receipt.decisionLogEntryHash,
        referenceTime: receipt.referenceTime,
        solverStatus: receipt.solverStatus,
        ...(receipt.reasonCode ? { reasonCode: receipt.reasonCode } : {}),
        ...(receipt.proofMetadata ? { proofMetadata: receipt.proofMetadata } : {}),
        proof: {
          claimScope: "BLOCK_DECISION_V1",
          status: job?.state ?? (found.bundle ? "AWAITING_PROOF" : "NOT_QUEUED"),
          ...proofJobFields(job),
        },
      };
    },
  );

  app.get<{ Params: { applicationId: string; decisionReceiptId: string } }>(
    "/v1/applications/:applicationId/decision-receipts/:decisionReceiptId/guest-bundle",
    async (request, reply) => {
      if (!Identifier.safeParse(request.params.applicationId).success) {
        return reply.code(400).send({ error: "invalid_application" });
      }
      const found = await proofs.getDecisionReceipt(request.params.applicationId, request.params.decisionReceiptId);
      if (!found?.bundle) return reply.code(404).send({ error: "guest_bundle_unavailable" });
      return { decisionReceiptId: found.receipt.id, guestBundle: found.bundle };
    },
  );

  /** Dev Projects dashboard: list / scaffold examples/* and edit mandate files on disk. */
  const examplesRoot = resolveExamplesRoot();

  app.get("/v1/projects", async (_request, reply) => {
    try {
      return { projects: await listProjects(examplesRoot) };
    } catch (err) {
      return reply.code(500).send({
        error: "projects_registry_unavailable",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  app.post("/v1/projects", async (request, reply) => {
    const body = CreateProjectBodySchema.safeParse(request.body);
    if (!body.success) {
      const issues = body.error.issues.slice(0, 10).map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      return reply.code(400).send({ error: "invalid_project", issues });
    }
    try {
      const project = await createProjectScaffold(examplesRoot, {
        displayName: body.data.displayName,
        ...(body.data.slug !== undefined ? { slug: body.data.slug } : {}),
        ...(body.data.applicationId !== undefined ? { applicationId: body.data.applicationId } : {}),
      });
      return reply.code(201).send({ project });
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "project_exists") return reply.code(409).send({ error: "project_exists" });
      if (code === "invalid_slug") return reply.code(400).send({ error: "invalid_slug" });
      return reply.code(500).send({
        error: "scaffold_failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  app.get<{ Params: { slug: string } }>("/v1/projects/:slug/mandate", async (request, reply) => {
    const slug = ProjectSlugSchema.safeParse(request.params.slug);
    if (!slug.success) return reply.code(400).send({ error: "invalid_slug" });
    const project = await getProject(examplesRoot, slug.data);
    if (!project) return reply.code(404).send({ error: "project_not_found" });
    try {
      const mandate = await readProjectMandate(examplesRoot, project);
      return { project, mandate };
    } catch {
      return reply.code(404).send({ error: "mandate_file_not_found" });
    }
  });

  app.put<{ Params: { slug: string } }>("/v1/projects/:slug/mandate", async (request, reply) => {
    const slug = ProjectSlugSchema.safeParse(request.params.slug);
    if (!slug.success) return reply.code(400).send({ error: "invalid_slug" });
    const project = await getProject(examplesRoot, slug.data);
    if (!project) return reply.code(404).send({ error: "project_not_found" });
    const parsed = AgentMandateSchema.safeParse(request.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.slice(0, 10).map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      return reply.code(400).send({ error: "invalid_mandate", issues });
    }
    const definition = normalizeAgentMandate(
      request.body as { rules: Array<{ ruleId: string }> },
    ) as Record<string, unknown>;
    await writeProjectMandate(examplesRoot, project, definition);
    return {
      project,
      mandate: definition,
      issues: lintMandate(parsed.data),
    };
  });

  app.post<{ Params: { slug: string } }>("/v1/projects/:slug/activate", async (request, reply) => {
    const slug = ProjectSlugSchema.safeParse(request.params.slug);
    if (!slug.success) return reply.code(400).send({ error: "invalid_slug" });
    const project = await getProject(examplesRoot, slug.data);
    if (!project) return reply.code(404).send({ error: "project_not_found" });
    let raw: unknown;
    try {
      raw = await readProjectMandate(examplesRoot, project);
    } catch {
      return reply.code(404).send({ error: "mandate_file_not_found" });
    }
    const parsed = AgentMandateSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.issues.slice(0, 10).map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      return reply.code(400).send({ error: "invalid_mandate", issues });
    }
    const definition = normalizeAgentMandate(
      raw as { rules: Array<{ ruleId: string }> },
    ) as Record<string, unknown>;
    const version =
      typeof (definition as { version?: unknown }).version === "number"
        ? (definition as { version: number }).version
        : 1;
    const mandateHash = await saveActiveDefinition(
      project.applicationId,
      MANDATE_POLICY_ID,
      version,
      definition,
    );
    return reply.code(201).send({
      project,
      mandateId: String(definition.mandateId),
      version,
      policyHash: mandateHash,
      ruleCount: Array.isArray(definition.rules) ? definition.rules.length : 0,
      issues: lintMandate(parsed.data),
    });
  });

  return app;
}
