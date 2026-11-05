import { randomUUID, timingSafeEqual } from "node:crypto";
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
  type UnifiedAction,
} from "@swaraj/schemas";
import { crossCheckMandateDecision, evaluateParsedMandate, type MandateDecision } from "@swaraj/rules";
import { createAmountSolver, createPolicyGateway } from "@swaraj/smt";
import { createMemoryReceiptStore, createPostgresReceiptStore, createReceiptEngine, verifyUnifiedActionReceipt, type ReceiptStore } from "@swaraj/receipts";
import {
  createDatabase,
  createProofJobQueue,
  enqueueProofJob,
  insertDecision,
  insertReceipt,
  ensureApplication,
  getActivePolicy,
  upsertActivePolicy,
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
  unifiedActionHash,
  unifiedActionToActionRequest,
  type AuditEntry,
  type PipelineDeps,
  type PipelineMode,
  type ProveContext,
} from "./pipeline/index.js";
import { resolveBaseNetwork } from "@swaraj/evidence";
import { createLiveStateOracle, type LiveStateOracle } from "./pipeline/live-state.js";
import { proofStackStatus, scheduleAutoProve } from "./auto-prove.js";

export type ActivityItem = {
  id: string;
  at: number;
  applicationId: string;
  action: string;
  idempotencyKey: string;
  decision: "ALLOW" | "BLOCK";
  intentHash?: string;
  policyHash?: string;
  violations?: Array<{ ruleId: string; reason: string }>;
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
};

type StoredPolicy = {
  applicationId: string;
  policyId: string;
  version: number;
  status: "DRAFT" | "ACTIVE" | "RETIRED";
  definition: Record<string, unknown>;
  policyHash: string;
};

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
  const { evidence, capabilities, execution, labels } = stack;
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
    reply.header("access-control-allow-methods", "GET, POST, OPTIONS");
    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
    if (request.routeOptions.url === "/health") return;
    const supplied = Buffer.from(request.headers.authorization ?? "");
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

  /**
   * Shared action handling: run the pipeline (SMT + mandate gates) and
   * respond with the Phase 8/9 receipt/decision-receipt bookkeeping.
   * Used by the legacy actions route and the unified-actions route (task 2.1).
   */
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
        if (pipelineMode === "base" && decisionReceipt && "id" in decisionReceipt && decisionReceipt.id) {
          scheduleAutoProve("decision");
        }
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
      if (pipelineMode === "base") {
        scheduleAutoProve("trade");
      }
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
      const mandateHash = hashObject(ObjectType.POLICY_PROFILE, definition);
      const version =
        typeof (definition as { version?: unknown }).version === "number"
          ? ((definition as { version: number }).version)
          : 1;
      if (pool) {
        await ensureApplication(pool, applicationId, applicationId);
        await upsertActivePolicy(pool, {
          applicationId,
          policyId: MANDATE_POLICY_ID,
          version,
          definition,
          policyHash: mandateHash,
        });
      } else {
        for (const [key, existing] of policiesMemory) {
          if (
            existing.applicationId === applicationId &&
            existing.policyId === MANDATE_POLICY_ID &&
            existing.status === "ACTIVE"
          ) {
            policiesMemory.set(key, { ...existing, status: "RETIRED" });
          }
        }
        policiesMemory.set(`${applicationId}:${MANDATE_POLICY_ID}:${version}`, {
          applicationId,
          policyId: MANDATE_POLICY_ID,
          version,
          status: "ACTIVE",
          definition,
          policyHash: mandateHash,
        });
      }
      return reply.code(201).send({
        mandateId: String(definition.mandateId),
        version,
        policyHash: mandateHash,
        ruleCount: Array.isArray(definition.rules) ? definition.rules.length : 0,
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

  /**
   * Task 2.1: gateway input for the unified action format. The action is
   * strictly validated, evaluated against the application's ACTIVE Agent
   * Mandate (registered mandate, else derived from the active policy), and
   * SPOT_TRADE allows feed the existing execution/receipt pipeline.
   */
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

      // Dual-engine cross-check (opt-in): Z3 must independently confirm the
      // predicate engine's decision; disagreement or solver failure is a
      // fail-closed BLOCK (ENGINE_DISAGREEMENT).
      if (process.env.SWARAJ_Z3_CROSSCHECK === "1" && mandateParsed.success) {
        try {
          const { agree } = await crossCheckMandateDecision(mandateParsed.data, action);
          if (!agree) {
            evaluated = {
              decision: "BLOCK",
              reason: "ENGINE_DISAGREEMENT",
              matchedRuleIds: [],
              matchedPermitRuleIds: [],
              matchedForbidRuleIds: [],
            };
          }
        } catch {
          evaluated = {
            decision: "BLOCK",
            reason: "ENGINE_DISAGREEMENT",
            matchedRuleIds: [],
            matchedPermitRuleIds: [],
            matchedForbidRuleIds: [],
          };
        }
      }

      // A mandate that names an agent key only accepts actions signed by it.
      if (
        mandateParsed.success &&
        mandateParsed.data.agentSigner !== undefined &&
        !(await agentSignatureValid(action, mandateParsed.data.agentSigner))
      ) {
        evaluated = {
          decision: "BLOCK",
          reason: "INVALID_SIGNATURE",
          matchedRuleIds: [],
          matchedPermitRuleIds: [],
          matchedForbidRuleIds: [],
        };
      }

      // Base SPOT_TRADE survives the mandate: run the full pipeline (SMT gate,
      // capability, Uniswap execution, receipts). NEAR SPOT_TRADE / PAYMENT use
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

      if (evaluated.decision === "BLOCK") {
        const matched = [...evaluated.matchedForbidRuleIds, ...evaluated.matchedPermitRuleIds];
        const detail = matched.length > 0 ? ` (${matched.join(", ")})` : "";
        const violations = [{ ruleId: "MANDATE", reason: `MANDATE:${evaluated.reason}${detail}` }];
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
          activityId: activity.id,
        });
      }

      // Permitted NEAR trade / payment / other non-Base actions: durable
      // PENDING receipt + optional mandate proof job (pool mode). Fixture
      // execution adapters live in @swaraj/capability / @swaraj/evidence.
      let proofReceipt: { id: string; state: string } | undefined;
      if (pool) {
        try {
          const receiptId = randomUUID();
          const handle = { raw: pool, close: async () => {} }; // PoolHandle adapter over the pg pool
          // The receipts table references the applications registry — make
          // sure the application row exists (idempotent).
          await handle.raw.query(
            "INSERT INTO applications (app_id, display_name) VALUES ($1, $1) ON CONFLICT (app_id) DO NOTHING",
            [applicationId],
          );
          // Log the decision (authz_decisions) — the receipt's decision_id
          // references it.
          const logged = await insertDecision(handle, {
            appId: applicationId,
            intentDigest: intentHash,
            policyId: MANDATE_POLICY_ID,
            policyRevision: mandateParsed.success ? mandateParsed.data.version : 1,
            outcome: "ALLOW",
            violatedRules: evaluated.matchedPermitRuleIds,
            smtScript: "",
          });
          await insertReceipt(handle, {
            receiptId,
            appId: applicationId,
            intentDigest: intentHash,
            decisionId: Number(logged.decisionId),
            claim: {
              kind: "MANDATE_DECISION_V1",
              action: (request.body as { action?: unknown })?.action,
              decision: "ALLOW",
              matchedRuleIds: evaluated.matchedPermitRuleIds,
              intentHash,
              mandateHash: policyHash,
            },
          });
          await enqueueProofJob(handle, {
            receiptId,
            payload: {
              kind: "MANDATE",
              mandate: mandateDefinition,
              action: (request.body as { action?: unknown })?.action,
              expected: { decision: "ALLOW", matchedRuleIds: evaluated.matchedPermitRuleIds },
              intentHash,
              mandateHash: policyHash,
            },
          });
          proofReceipt = { id: receiptId, state: "PENDING" };
        } catch (error) {
          request.log.error(error);
        }
      }
      const engineStatus: EngineReceiptStatus = proofReceipt ? "PENDING" : "NOT_EXECUTABLE";
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
        productStatus,
        mandate: { reason: evaluated.reason, matchedPermitRuleIds: evaluated.matchedPermitRuleIds },
        status: engineStatus,
        intentHash,
        policyHash,
        activityId: activity.id,
        ...(proofReceipt ? { receipt: proofReceipt, receiptId: proofReceipt.id } : {}),
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

  /**
   * Task 3.2: verify a receipt against the unified action format. Checks the
   * stored action against the strict schema, recomputes its canonical hash,
   * verifies the issuer signature and the record↔signed-receipt binding.
   */
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
      if (!record) return reply.code(404).send({ error: "receipt_not_found" });
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

  return app;
}
