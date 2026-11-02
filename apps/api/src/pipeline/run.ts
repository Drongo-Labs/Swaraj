import {
  createBaseUniswapExecutionAdapter,
  createCapabilityService,
  createMemoryCapabilityStore,
  createMemoryReservationStore,
  createMockExecutionAdapter,
  createNearLiveExecutionAdapter,
  isNearLiveConfigured,
  nearAccountRef,
  type CapabilityService,
  type ExecutionAdapter,
  type ExecutionTrade,
  type NearExecutionAction,
} from "@swaraj/capability";
import {
  createPostgresCapabilityStore,
  createPostgresReservationStore,
} from "@swaraj/database";
import type { Pool } from "pg";
import type { Signer } from "@swaraj/crypto";
import type { ActionRequest, ActionResult } from "@swaraj/contracts";
import {
  createBaseVenueAdapter,
  createMockVenueAdapter,
  createNearLiveVenueAdapter,
  DEFAULT_MOCK_FIXTURES,
  resolveBaseNetwork,
  type VenueAdapter,
} from "@swaraj/evidence";
import {
  ReasonCode,
  type ReceiptEngine,
  type ReceiptRecord,
} from "@swaraj/receipts";
import type { PolicyDecision, PolicyGatewayInput } from "@swaraj/smt";
import { serializeUnifiedAction, type UnifiedAction } from "@swaraj/schemas";
import {
  DEMO_POLICY,
  DEMO_STATE,
  demoAllowIntentForEnv,
  demoBlockIntentForEnv,
} from "./demo.js";
import { unifiedActionHash } from "./unified.js";

export type PipelineMode = "mock" | "base";

export type AuditEntry = {
  at: number;
  applicationId: string;
  kind: "DECISION" | "EXECUTION" | "RECEIPT";
  detail: Record<string, unknown>;
};

export type PipelineDeps = {
  evidence: VenueAdapter;
  receipts: ReceiptEngine;
  signer: Signer;
  /** Real Phase 4 gateway check(policy,state,intent). */
  checkPolicy: (input: PolicyGatewayInput) => Promise<PolicyDecision>;
  capabilities: CapabilityService;
  execution: ExecutionAdapter;
  /**
   * Integrated path: load the ACTIVE policy from the registry.
   * When set, client-supplied `input.policy` is ignored (cannot bypass the store).
   */
  loadActivePolicy?: (
    applicationId: string,
    policyId: string,
  ) => Promise<Record<string, unknown> | undefined>;
  /**
   * Live Base mode: load chain balances for the execution wallet.
   * When set, client-supplied `input.state` is ignored (cannot fake portfolio).
   */
  loadLiveState?: () => Promise<Record<string, unknown>>;
  /** When true (base mode), refuse client fixture state. */
  requireLiveState?: boolean;
  /**
   * The agent-submitted unified action this request originated from
   * (task 2.1). Receipts bind its canonical wire form so they can be
   * verified against the unified action format.
   */
  unifiedAction?: UnifiedAction;
  audit?: (entry: AuditEntry) => void;
};

/** Objects needed to build a Phase 7 GuestInputBundle for this receipt. */
export type ProveContext = {
  intent: unknown;
  policy: unknown;
  state: unknown;
  evidence: unknown;
};

export type PipelineAllowResult = Extract<ActionResult, { decision: "ALLOW" }> & {
  record: ReceiptRecord;
  decision: "ALLOW";
  capabilityId: string;
  intentHash: string;
  policyHash: string;
  decisionId?: string;
  proveContext: ProveContext;
};

export type PipelineBlockResult = Extract<ActionResult, { decision: "BLOCK" }> & {
  intentHash?: string;
  policyHash?: string;
  stateHash?: string;
  decisionId?: string;
  /** Gateway solver status; only sat/unsat blocks can become provable Decision Receipts (Phase 9). */
  solverStatus: PolicyDecision["solverStatus"];
  violatedRuleIds: number[];
  /** Inputs needed to build the Phase 9 BLOCK guest bundle. */
  proveContext: Omit<ProveContext, "evidence">;
};

export type PipelineResult = PipelineAllowResult | PipelineBlockResult;

export type PipelineStack = {
  mode: PipelineMode;
  evidence: VenueAdapter;
  capabilities: CapabilityService;
  execution: ExecutionAdapter;
  /** Live NEAR adapters when NEAR_ACCOUNT_ID + NEAR_PRIVATE_KEY are set. */
  nearLive?: {
    execution: ReturnType<typeof createNearLiveExecutionAdapter>;
    evidence: VenueAdapter;
    accountId: string;
  };
  labels: {
    base: "mock" | "rpc" | "rpc:base" | "rpc:base-sepolia";
    execution: "mock" | "uniswap_v3";
    capabilityStore: "postgres" | "memory";
    near?: "live" | "off";
  };
};

/**
 * Mode resolution — fail-closed for runtime:
 * - explicit `pipelineMode` in tests wins (`mock` | `base`)
 * - `SWARAJ_FORCE_MOCK=1` → mock (CI / unit only)
 * - otherwise **base** (requires DATABASE_URL + BASE_RPC_URL + execution key)
 * Never silently falls back to mock.
 */
export function resolvePipelineMode(
  env: NodeJS.ProcessEnv = process.env,
  explicit?: PipelineMode,
): PipelineMode {
  if (explicit === "mock" || explicit === "base") return explicit;
  if (env.SWARAJ_FORCE_MOCK === "1") return "mock";

  const rpc = env.BASE_RPC_URL?.trim();
  const key = env.SWARAJ_EXECUTION_PRIVATE_KEY?.trim();
  const databaseUrl = env.DATABASE_URL?.trim();

  if (!databaseUrl || !rpc || !key) {
    throw new Error(
      "Live Base pipeline requires DATABASE_URL, BASE_RPC_URL, and SWARAJ_EXECUTION_PRIVATE_KEY. " +
        "For chain-off CI/unit tests only, pass pipelineMode: \"mock\" or set SWARAJ_FORCE_MOCK=1.",
    );
  }
  return "base";
}

/** Required env for live (non-mock) API startup. */
export function assertLiveRuntimeEnv(env: NodeJS.ProcessEnv = process.env): void {
  if (env.SWARAJ_FORCE_MOCK === "1") return;
  const missing: string[] = [];
  for (const name of [
    "DATABASE_URL",
    "BASE_RPC_URL",
    "SWARAJ_EXECUTION_PRIVATE_KEY",
    "SWARAJ_SIGNER_PRIVATE_KEY",
  ] as const) {
    if (!env[name]?.trim()) missing.push(name);
  }
  if (missing.length > 0) {
    throw new Error(
      `Live Swaraj runtime missing: ${missing.join(", ")}. Set SWARAJ_FORCE_MOCK=1 only for CI.`,
    );
  }
}

export function createDefaultEvidenceAdapter(mode: PipelineMode = "mock"): VenueAdapter {
  if (mode === "base") {
    const rpcUrl = process.env.BASE_RPC_URL;
    if (!rpcUrl) {
      throw new Error("BASE_RPC_URL is required when SWARAJ_PIPELINE_MODE=base");
    }
    const network = resolveBaseNetwork(process.env);
    const confEnv = Number(process.env.BASE_CONFIRMATIONS);
    const confirmations =
      Number.isFinite(confEnv) && confEnv > 0 ? confEnv : network.defaultConfirmations;
    return createBaseVenueAdapter({
      rpcUrl,
      chain: network.chain,
      confirmations,
    });
  }
  return createMockVenueAdapter(DEFAULT_MOCK_FIXTURES);
}

export function createDefaultCapabilityStack(
  mode: PipelineMode = "mock",
  pool?: Pool,
): {
  capabilities: CapabilityService;
  execution: ExecutionAdapter;
  capabilityStore: "postgres" | "memory";
} {
  const capabilityStore = pool ? createPostgresCapabilityStore(pool) : createMemoryCapabilityStore();
  const reservationStore = pool ? createPostgresReservationStore(pool) : createMemoryReservationStore();
  const capabilities = createCapabilityService({
    capabilities: capabilityStore,
    reservations: reservationStore,
  });

  if (mode === "base") {
    const rpcUrl = process.env.BASE_RPC_URL;
    const privateKey = process.env.SWARAJ_EXECUTION_PRIVATE_KEY;
    if (!rpcUrl || !privateKey) {
      throw new Error(
        "BASE_RPC_URL and SWARAJ_EXECUTION_PRIVATE_KEY are required when SWARAJ_PIPELINE_MODE=base",
      );
    }
    const network = resolveBaseNetwork(process.env);
    const feeTier = Number(process.env.UNISWAP_V3_FEE ?? "500");
    const router = (process.env.UNISWAP_V3_ROUTER ?? network.swapRouter02) as `0x${string}`;
    return {
      capabilities,
      execution: createBaseUniswapExecutionAdapter(capabilities, {
        rpcUrl,
        privateKey: privateKey as `0x${string}`,
        chain: network.chain,
        routerAddress: router.toLowerCase() as `0x${string}`,
        feeTier: Number.isFinite(feeTier) && feeTier > 0 ? feeTier : 500,
      }),
      capabilityStore: pool ? "postgres" : "memory",
    };
  }

  return {
    capabilities,
    execution: createMockExecutionAdapter(capabilities),
    capabilityStore: pool ? "postgres" : "memory",
  };
}

export function createPipelineStack(
  mode: PipelineMode = resolvePipelineMode(),
  pool?: Pool,
): PipelineStack {
  const { capabilities, execution, capabilityStore } = createDefaultCapabilityStack(mode, pool);
  const nearOpts = {
    ...(process.env.NEAR_RPC_URL?.trim() ? { rpcUrl: process.env.NEAR_RPC_URL.trim() } : {}),
    ...(process.env.NEAR_ACCOUNT_ID?.trim()
      ? { accountId: process.env.NEAR_ACCOUNT_ID.trim() }
      : {}),
    ...(process.env.NEAR_PRIVATE_KEY?.trim()
      ? { privateKey: process.env.NEAR_PRIVATE_KEY.trim() }
      : {}),
    ...(process.env.NEAR_FT_CONTRACT?.trim()
      ? { ftContract: process.env.NEAR_FT_CONTRACT.trim() }
      : {}),
  };
  const nearLive = isNearLiveConfigured(process.env)
    ? {
        execution: createNearLiveExecutionAdapter(capabilities, nearOpts),
        evidence: createNearLiveVenueAdapter({
          ...(nearOpts.rpcUrl ? { rpcUrl: nearOpts.rpcUrl } : {}),
          ...(nearOpts.accountId ? { senderAccountId: nearOpts.accountId } : {}),
        }),
        accountId: process.env.NEAR_ACCOUNT_ID!.trim(),
      }
    : undefined;
  return {
    mode,
    evidence: createDefaultEvidenceAdapter(mode),
    capabilities,
    execution,
    ...(nearLive ? { nearLive } : {}),
    labels:
      mode === "base"
        ? {
            base: `rpc:${resolveBaseNetwork(process.env).id}`,
            execution: "uniswap_v3",
            capabilityStore,
            near: nearLive ? "live" : "off",
          }
        : {
            base: "mock",
            execution: "mock",
            capabilityStore,
            near: nearLive ? "live" : "off",
          },
  };
}

/**
 * After mandate ALLOW for NEAR trade/payment: issue capability → live NEAR tx →
 * evidence (NEAR_FINALITY) → PENDING receipt. Skips Base SMT / Uniswap.
 */
export async function runNearLivePipeline(params: {
  applicationId: string;
  idempotencyKey: string;
  intentHash: string;
  policyHash: string;
  amount: string;
  nearAction: NearExecutionAction;
  capabilities: CapabilityService;
  nearExecution: ReturnType<typeof createNearLiveExecutionAdapter>;
  nearEvidence: VenueAdapter;
  receipts: ReceiptEngine;
  signer: Signer;
  nearAccountId: string;
  unifiedAction?: UnifiedAction;
}): Promise<PipelineAllowResult> {
  const accountRef = nearAccountRef(params.nearAccountId);
  const { token } = await params.capabilities.issue(
    {
      applicationId: params.applicationId,
      intentHash: params.intentHash as `0x${string}`,
      policyHash: params.policyHash as `0x${string}`,
      accountRef,
      idempotencyKey: params.idempotencyKey,
      amount: params.amount,
      // Soft ceiling: one action amount (mandate already gated the real limit).
      budgetLimit: params.amount,
      usedBudget: "0",
    },
    params.signer,
  );

  let execution;
  try {
    execution = await params.nearExecution.executeNear({
      token,
      intentHash: params.intentHash,
      policyHash: params.policyHash,
      accountRef,
      nearAction: params.nearAction,
    });
  } catch (error) {
    await params.capabilities.release(token.capabilityId).catch(() => undefined);
    throw error;
  }

  const evidence = await params.nearEvidence.collectEvidence(execution);
  const receiptId = `receipt_${params.idempotencyKey}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 64);
  const actionId = `action_${params.idempotencyKey}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 64);

  const record = await params.receipts.createPendingReceipt({
    applicationId: params.applicationId,
    receiptId,
    actionId,
    intentHash: params.intentHash,
    policyHash: params.policyHash,
    evidenceRoot: evidence.evidenceRoot,
    claimType: params.nearAction.kind === "PAYMENT" ? "TRADE_EXECUTED" : "TRADE_EXECUTED",
    finalityRule: "NEAR_FINALITY",
    verifierVersion: "0.1.0",
    createdAt: evidence.collectedAt,
    signer: params.signer,
    idempotencyKey: params.idempotencyKey,
    ...(params.unifiedAction
      ? {
          intentJson: {
            format: "unified-action" as const,
            action: JSON.parse(serializeUnifiedAction(params.unifiedAction)) as Record<
              string,
              unknown
            >,
            actionHash: unifiedActionHash(params.unifiedAction),
            nearTxHash: execution.txHash,
            venue: execution.venue,
          },
        }
      : {
          intentJson: {
            nearAction: params.nearAction,
            nearTxHash: execution.txHash,
          },
        }),
    accountRef,
  });

  const status = record.status === "NON_PROVABLE" ? "NON_PROVABLE" : "PENDING";
  return {
    decision: "ALLOW",
    receiptId: record.receiptId,
    status,
    productStatus: status === "NON_PROVABLE" ? "cant_prove" : "allowed",
    capabilityId: token.capabilityId,
    intentHash: params.intentHash,
    policyHash: params.policyHash,
    record,
    proveContext: {
      intent: params.unifiedAction ?? params.nearAction,
      policy: { mandateHash: params.policyHash },
      state: {},
      evidence,
    },
  };
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function sanitizeIdempotencyKey(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128);
}

/** Drop committed hashes and refresh wall-clock fields so demo intents do not expire on stale fixtures. */
function withLiveTiming(
  state: Record<string, unknown>,
  intent: Record<string, unknown>,
  idempotencyKey: string,
): { state: Record<string, unknown>; intent: Record<string, unknown> } {
  const now = Math.floor(Date.now() / 1000);
  const { stateHash: _sh, ...stateRest } = state;
  const { intentHash: _ih, ...intentRest } = intent;
  return {
    state: {
      ...stateRest,
      timestamp: now,
      freshnessSeconds: 5,
      lastActionTime: now - 60,
    },
    intent: {
      ...intentRest,
      intentId: `intent_${idempotencyKey}`.slice(0, 64),
      idempotencyKey,
      expiry: now + 300,
    },
  };
}

async function resolvePolicyStateIntent(
  applicationId: string,
  request: ActionRequest,
  deps: Pick<PipelineDeps, "loadActivePolicy" | "loadLiveState" | "requireLiveState">,
): Promise<PolicyGatewayInput> {
  const input = request.input;
  const policyId =
    typeof input.policyId === "string" && IdentifierLike(input.policyId) ? input.policyId : "policy_demo";

  let policy: Record<string, unknown>;
  if (deps.loadActivePolicy) {
    const loaded = await deps.loadActivePolicy(applicationId, policyId);
    if (!loaded) {
      throw new Error(`active_policy_not_found:${policyId}`);
    }
    const { policyHash: _ph, ...rest } = loaded;
    policy = rest;
  } else {
    // Test / memory path only: allow inline policy body or demo default.
    const policyRaw = asObject(input.policy) ?? { ...DEMO_POLICY };
    const { policyHash: _ph, ...rest } = policyRaw;
    policy = rest;
  }

  let stateDefault: Record<string, unknown>;
  if (deps.requireLiveState || deps.loadLiveState) {
    if (!deps.loadLiveState) {
      throw new Error("live_state_oracle_required");
    }
    stateDefault = await deps.loadLiveState();
  } else {
    stateDefault = asObject(input.state) ?? { ...DEMO_STATE };
  }
  const idempotencyKey = sanitizeIdempotencyKey(request.idempotencyKey);

  const activePolicyVersion =
    typeof policy.policyVersion === "number"
      ? policy.policyVersion
      : Number(policy.policyVersion ?? 1);

  if (asObject(input.intent)) {
    const timed = withLiveTiming(stateDefault, asObject(input.intent)!, idempotencyKey);
    return { policy, state: timed.state, intent: timed.intent };
  }

  if (request.action === "trade.block") {
    const timed = withLiveTiming(
      stateDefault,
      { ...demoBlockIntentForEnv(), policyVersion: activePolicyVersion },
      idempotencyKey,
    );
    return { policy, state: timed.state, intent: timed.intent };
  }

  const timed = withLiveTiming(
    stateDefault,
    { ...demoAllowIntentForEnv(), policyVersion: activePolicyVersion },
    idempotencyKey,
  );
  return { policy, state: timed.state, intent: timed.intent };
}

function IdentifierLike(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(value);
}

function tradeFromIntent(intentObj: Record<string, unknown>): ExecutionTrade | undefined {
  const assetIn = typeof intentObj.assetIn === "string" ? intentObj.assetIn : undefined;
  const assetOut = typeof intentObj.assetOut === "string" ? intentObj.assetOut : undefined;
  const amount =
    typeof intentObj.amount === "string"
      ? intentObj.amount
      : intentObj.amount !== undefined
        ? String(intentObj.amount)
        : undefined;
  const limitPrice =
    typeof intentObj.limitPrice === "string"
      ? intentObj.limitPrice
      : intentObj.limitPrice !== undefined
        ? String(intentObj.limitPrice)
        : undefined;
  const maxSlippageBps =
    typeof intentObj.maxSlippageBps === "number" ? intentObj.maxSlippageBps : undefined;

  if (
    assetIn === undefined ||
    assetOut === undefined ||
    amount === undefined ||
    limitPrice === undefined ||
    maxSlippageBps === undefined
  ) {
    return undefined;
  }

  return {
    assetIn: assetIn.toLowerCase() as `0x${string}`,
    assetOut: assetOut.toLowerCase() as `0x${string}`,
    amount,
    limitPrice,
    maxSlippageBps,
  };
}

/**
 * Runtime order:
 * Agent proposes → Phase 4 SMT → Phase 5 capability + reservation → execute
 * → Phase 2 evidence → Phase 3 receipt.
 * Never issues PROVED itself: the API records proof inputs and the Phase 8/9 workers promote receipts.
 */
export async function runPipeline(
  applicationId: string,
  request: ActionRequest,
  deps: PipelineDeps,
): Promise<PipelineResult> {
  const gatewayInput = await resolvePolicyStateIntent(applicationId, request, deps);
  const decision = await deps.checkPolicy(gatewayInput);

  deps.audit?.({
    at: Math.floor(Date.now() / 1000),
    applicationId,
    kind: "DECISION",
    detail: {
      decision: decision.decision,
      intentHash: decision.intentHash,
      policyHash: decision.policyHash,
      violatedRuleIds: decision.violatedRuleIds,
      decisionId: decision.decisionId,
    },
  });

  if (decision.decision === "BLOCK") {
    const violations =
      decision.violations.length > 0
        ? decision.violations.map((v) => ({ ruleId: String(v.ruleId), reason: v.reason }))
        : [{ ruleId: "POLICY", reason: "blocked by policy gateway" }];
    return {
      decision: "BLOCK",
      violations,
      intentHash: decision.intentHash,
      policyHash: decision.policyHash,
      stateHash: decision.stateHash,
      solverStatus: decision.solverStatus,
      violatedRuleIds: [...decision.violatedRuleIds],
      proveContext: { intent: gatewayInput.intent, policy: gatewayInput.policy, state: gatewayInput.state },
      ...(decision.decisionId !== undefined ? { decisionId: decision.decisionId } : {}),
    };
  }

  const intentObj = asObject(gatewayInput.intent) ?? {};
  const accountRef =
    typeof intentObj.accountRef === "string"
      ? intentObj.accountRef
      : "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const amount =
    typeof intentObj.amount === "string" ? intentObj.amount : String(intentObj.amount ?? "0");
  const stateObj = asObject(gatewayInput.state) ?? {};
  const usedBudget =
    typeof stateObj.usedDailyTurnover === "string"
      ? stateObj.usedDailyTurnover
      : String(stateObj.usedDailyTurnover ?? "0");
  const policyObj = asObject(gatewayInput.policy) ?? {};
  const budgetLimit =
    typeof policyObj.dailyTurnoverCap === "string"
      ? policyObj.dailyTurnoverCap
      : String(policyObj.dailyTurnoverCap ?? "0");

  const { token } = await deps.capabilities.issue(
    {
      applicationId,
      intentHash: decision.intentHash as `0x${string}`,
      policyHash: decision.policyHash as `0x${string}`,
      accountRef: accountRef as `0x${string}`,
      idempotencyKey: request.idempotencyKey,
      amount,
      budgetLimit,
      usedBudget,
    },
    deps.signer,
  );

  const trade = tradeFromIntent(intentObj);
  let execution;
  try {
    execution = await deps.execution.execute({
      token,
      intentHash: decision.intentHash,
      policyHash: decision.policyHash,
      accountRef,
      ...(trade !== undefined ? { trade } : {}),
    });
  } catch (error) {
    await deps.capabilities.release(token.capabilityId).catch(() => undefined);
    throw error;
  }

  deps.audit?.({
    at: Math.floor(Date.now() / 1000),
    applicationId,
    kind: "EXECUTION",
    detail: {
      capabilityId: token.capabilityId,
      txHash: execution.txHash,
      venue: execution.venue,
    },
  });

  const evidence = await deps.evidence.collectEvidence(execution);
  const receiptId = `receipt_${request.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  const actionId = `action_${request.idempotencyKey}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);

  let record = await deps.receipts.createPendingReceipt({
    applicationId,
    receiptId,
    actionId,
    intentHash: decision.intentHash,
    policyHash: decision.policyHash,
    evidenceRoot: evidence.evidenceRoot,
    claimType: "TRADE_EXECUTED",
    finalityRule: "BASE_CONFIRMATIONS_12",
    verifierVersion: "0.1.0",
    createdAt: evidence.collectedAt,
    signer: deps.signer,
    idempotencyKey: request.idempotencyKey,
    // Unified-action requests bind the receipt to the canonical wire form of
    // the agent's action (format + action + its hash) so verification can
    // revalidate the format and the stored blob end to end.
    ...(deps.unifiedAction
      ? {
          intentJson: {
            format: "unified-action" as const,
            action: JSON.parse(serializeUnifiedAction(deps.unifiedAction)) as Record<string, unknown>,
            actionHash: unifiedActionHash(deps.unifiedAction),
          },
        }
      : { intentJson: { action: request.action, input: request.input } }),
    accountRef,
  });

  if (evidence.finalityResult === "CONFLICT") {
    record = await deps.receipts.markNonProvable(
      applicationId,
      receiptId,
      ReasonCode.EVIDENCE_CONFLICT,
      deps.signer,
    );
  }

  deps.audit?.({
    at: Math.floor(Date.now() / 1000),
    applicationId,
    kind: "RECEIPT",
    detail: { receiptId: record.receiptId, status: record.status },
  });

  const status = record.status === "NON_PROVABLE" ? "NON_PROVABLE" : "PENDING";
  return {
    decision: "ALLOW",
    receiptId: record.receiptId,
    status,
    productStatus: status === "NON_PROVABLE" ? "cant_prove" : "allowed",
    record,
    capabilityId: token.capabilityId,
    intentHash: decision.intentHash,
    policyHash: decision.policyHash,
    proveContext: {
      intent: gatewayInput.intent,
      policy: gatewayInput.policy,
      state: gatewayInput.state,
      evidence,
    },
    ...(decision.decisionId !== undefined ? { decisionId: decision.decisionId } : {}),
  };
}

/** @deprecated Use runPipeline — kept for import compatibility during transition. */
export const runMockPipeline = runPipeline;
