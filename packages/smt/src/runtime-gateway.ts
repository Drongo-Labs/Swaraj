import { createHash } from "node:crypto";

export interface PolicyGatewayInput {
  intent: unknown;
  policy: unknown;
  state: unknown;
}

export type SolverStatus = "sat" | "unsat" | "invalid" | "timeout" | "unknown";

export interface PolicyViolation {
  ruleId: number;
  reason: string;
}

export interface AuthorizationDecisionToStore {
  intentHash: string;
  policyHash: string;
  stateHash: string;
  policyVersion: number;
  decision: "ALLOW" | "BLOCK";
  solverStatus: SolverStatus;
  violatedRuleIds: number[];
}

export interface DecisionStore {
  save(decision: AuthorizationDecisionToStore): Promise<string>;
}

export interface PolicyDecision extends AuthorizationDecisionToStore {
  violations: PolicyViolation[];
  decisionId?: string;
}

export interface PolicyGateway {
  check(input: PolicyGatewayInput): Promise<PolicyDecision>;
  close(): Promise<void>;
}

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : undefined;
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    if (typeof value === "bigint") return JSON.stringify(value.toString());
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const record = value as JsonObject;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
}

function digest(value: unknown): string {
  return `0x${createHash("sha256").update(stableJson(value)).digest("hex")}`;
}

function integer(value: unknown): bigint | undefined {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isSafeInteger(value)) return BigInt(value);
  if (typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value)) return BigInt(value);
  return undefined;
}

function number(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) ? value : undefined;
}

function strings(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value as string[]
    : undefined;
}

function balanceOf(state: JsonObject, asset: string): bigint {
  const balances = Array.isArray(state.balances) ? state.balances : [];
  const match = balances.find((entry) => object(entry)?.asset === asset);
  return integer(object(match)?.amount) ?? 0n;
}

function evaluate(input: PolicyGatewayInput): Omit<PolicyDecision, "decisionId"> {
  const intentHash = digest(input.intent);
  const policyHash = digest(input.policy);
  const stateHash = digest(input.state);
  const intent = object(input.intent);
  const policy = object(input.policy);
  const state = object(input.state);
  const policyVersion = number(policy?.policyVersion) ?? 0;

  const base = { intentHash, policyHash, stateHash, policyVersion };
  if (!intent || !policy || !state) {
    return {
      ...base,
      decision: "BLOCK",
      solverStatus: "invalid",
      violatedRuleIds: [],
      violations: [{ ruleId: 0, reason: "intent, policy, and state must be objects" }],
    };
  }

  const amount = integer(intent.amount);
  const maxAmount = integer(policy.maxAmountPerAction);
  const positionCap = integer(policy.positionCap);
  const dailyCap = integer(policy.dailyTurnoverCap);
  const reserveRequirement = integer(policy.reserveRequirement);
  const used = integer(state.usedDailyTurnover);
  const reserved = integer(state.reservedBudget);
  const timestamp = number(state.timestamp);
  const expiry = number(intent.expiry);
  const policyExpiry = number(policy.policyExpiry);
  const lastActionTime = state.lastActionTime === undefined ? undefined : number(state.lastActionTime);
  const cooldown = number(policy.cooldownSeconds);
  const freshness = number(state.freshnessSeconds);
  const maxFreshness = number(policy.quoteFreshnessSeconds);
  const slippage = number(intent.maxSlippageBps);
  const maxSlippage = number(policy.maxSlippageBps);
  const intentVersion = number(intent.policyVersion);
  const allowedVenues = strings(policy.allowedVenues);
  const allowedAssets = strings(policy.allowedAssets);

  if (
    amount === undefined || maxAmount === undefined || positionCap === undefined ||
    dailyCap === undefined || reserveRequirement === undefined || used === undefined ||
    reserved === undefined || timestamp === undefined || expiry === undefined ||
    policyExpiry === undefined || cooldown === undefined || freshness === undefined ||
    maxFreshness === undefined || slippage === undefined || maxSlippage === undefined ||
    intentVersion === undefined || !allowedVenues || !allowedAssets ||
    typeof intent.venue !== "string" || typeof intent.assetIn !== "string" ||
    typeof intent.assetOut !== "string"
  ) {
    return {
      ...base,
      decision: "BLOCK",
      solverStatus: "invalid",
      violatedRuleIds: [],
      violations: [{ ruleId: 0, reason: "policy, state, or intent has an invalid runtime shape" }],
    };
  }

  if (policy.paused === true || state.policyStatus !== "ACTIVE") {
    return {
      ...base,
      decision: "BLOCK",
      solverStatus: "invalid",
      violatedRuleIds: [],
      violations: [{ ruleId: 1, reason: "policy is not operational" }],
    };
  }

  const violations: PolicyViolation[] = [];
  const fail = (ruleId: number, reason: string) => violations.push({ ruleId, reason });
  if (timestamp > policyExpiry) fail(2, "policy has expired");
  if (timestamp > expiry) fail(3, "intent has expired");
  if (intentVersion !== policyVersion) fail(4, "intent policy version does not match active policy");
  if (!allowedVenues.includes(intent.venue)) fail(5, "venue is not allowed");
  if (!allowedAssets.includes(intent.assetIn) || !allowedAssets.includes(intent.assetOut)) {
    fail(6, "asset is not allowed");
  }
  if (amount <= 0n || amount > maxAmount) fail(7, "amount exceeds the per-action limit");
  if (used + reserved + amount > dailyCap) fail(8, "daily turnover budget would be exceeded");
  if (slippage > maxSlippage) fail(9, "slippage exceeds policy limit");
  if (freshness > maxFreshness) fail(10, "state or quote is stale");
  if (lastActionTime !== undefined && timestamp - lastActionTime < cooldown) fail(11, "cooldown has not elapsed");
  if (balanceOf(state, intent.assetIn) - reserved - amount < reserveRequirement) {
    fail(12, "reserve requirement would be violated");
  }
  const outputBalance = balanceOf(state, intent.assetOut);
  if (outputBalance > positionCap) fail(13, "position cap is already exceeded");

  return {
    ...base,
    decision: violations.length === 0 ? "ALLOW" : "BLOCK",
    solverStatus: violations.length === 0 ? "sat" : "unsat",
    violatedRuleIds: violations.map((entry) => entry.ruleId),
    violations,
  };
}

export async function createPolicyGateway(
  options: { decisionStore?: DecisionStore } = {},
): Promise<PolicyGateway> {
  return {
    async check(input) {
      const decision = evaluate(input);
      const decisionId = options.decisionStore
        ? await options.decisionStore.save(decision)
        : undefined;
      return decisionId === undefined ? decision : { ...decision, decisionId };
    },
    async close() {},
  };
}

export interface AmountCheckInput {
  amount: string;
  maxAmount: string;
  usedBudget: string;
  reservedBudget: string;
  budgetLimit: string;
  paused: boolean;
}

export function createAmountSolver(): Promise<{
  check(input: AmountCheckInput): Promise<{ satisfied: boolean; violations: string[] }>;
  close(): void;
}> {
  return Promise.resolve({
    async check(input) {
      const amount = BigInt(input.amount);
      const violations: string[] = [];
      if (input.paused) violations.push("POLICY_PAUSED");
      if (amount > BigInt(input.maxAmount)) violations.push("AMOUNT_LIMIT");
      if (BigInt(input.usedBudget) + BigInt(input.reservedBudget) + amount > BigInt(input.budgetLimit)) {
        violations.push("BUDGET_LIMIT");
      }
      return { satisfied: violations.length === 0, violations };
    },
    close() {},
  });
}
