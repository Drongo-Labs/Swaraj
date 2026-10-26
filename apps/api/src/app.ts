import { timingSafeEqual } from "node:crypto";
import Fastify from "fastify";
import {
  ActionRequestSchema,
  AmountCheckSchema,
  Identifier,
  PolicyRecordSchema,
} from "@swaraj/contracts";
import { LocalKeySigner, hashObject, type Signer } from "@swaraj/crypto";
import { ObjectType, PolicyProfileSchema, normalizePolicyProfile } from "@swaraj/schemas";
import { createAmountSolver, createPolicyGateway } from "@swaraj/smt";
import { createMemoryReceiptStore, createPostgresReceiptStore, createReceiptEngine, type ReceiptStore } from "@swaraj/receipts";
import {
  createDatabase,
  createProofJobQueue,
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
  DEMO_POLICY,
  demoPolicyForEnv,
  resolvePipelineMode,
  runPipeline,
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
  decisionReceipt?: Record<string, unknown>;
  proof?: Record<string, unknown>;
};

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

  const pipelineDeps = (): PipelineDeps => ({
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
    checkPolicy: (input) => mandateGateway.check(input),
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
      const normalized = normalizePolicyProfile({
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
      const parsed = PolicyProfileSchema.safeParse(definition);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_policy_definition", issues: parsed.error.issues });
      }

      // AtomicAmount transforms to bigint; persist/hash as decimal strings (Policy Profile wire form).
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

  app.post<{ Params: { applicationId: string } }>("/v1/applications/:applicationId/actions", async (request, reply) => {
    if (!Identifier.safeParse(request.params.applicationId).success || !ActionRequestSchema.safeParse(request.body).success) {
      return reply.code(400).send({ error: "invalid_action" });
    }
    const body = ActionRequestSchema.parse(request.body);
    try {
      const applicationId = request.params.applicationId;
      const result = await runPipeline(applicationId, body, pipelineDeps());
      const at = Math.floor(Date.now() / 1000);
      if (result.decision === "BLOCK") {
        // Phase 9: a provable BLOCK becomes a PENDING Decision Receipt for the rejection-proof worker.
        const decisionReceipt = await proofs.recordBlockDecision(applicationId, result).catch((error: unknown) => {
          request.log.error(error);
          return { status: "NON_PROVABLE" as const, reasonCode: "NOT_RECORDED" };
        });
        const activity: ActivityItem = {
          id: `activity_${body.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
          at,
          applicationId,
          action: body.action,
          idempotencyKey: body.idempotencyKey,
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
        request.log.error(error);
        return { status: "NOT_PROVABLE" as const, reason: "proof inputs could not be recorded" };
      });
      const activity: ActivityItem = {
        id: `activity_${body.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
        at,
        applicationId,
        action: body.action,
        idempotencyKey: body.idempotencyKey,
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
      request.log.error(error);
      return reply.code(500).send({ error: "pipeline_failed", message });
    }
  });

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
