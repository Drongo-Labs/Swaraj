import { createHash } from "node:crypto";

type ObjectValue = Record<string, unknown>;

export interface GuestOutput {
  decisionAllow: boolean;
  claimType: string;
  violatedRuleIds: number[];
  publicValues: string;
}

function object(value: unknown): ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ObjectValue
    : {};
}

function bigint(value: unknown): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isSafeInteger(value)) return BigInt(value);
  if (typeof value === "string" && /^-?\d+$/.test(value)) return BigInt(value);
  return 0n;
}

function integer(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) ? value : 0;
}

function balance(state: ObjectValue, asset: unknown): bigint {
  if (typeof asset !== "string" || !Array.isArray(state.balances)) return 0n;
  const row = state.balances.find((entry) => object(entry).asset === asset);
  return bigint(object(row).amount);
}

function deriveRules(bundle: ObjectValue): number[] {
  const intent = object(bundle.intent);
  const policy = object(bundle.policy);
  const state = object(bundle.state);
  const evidence = object(bundle.evidence);
  const rules: number[] = [];
  const amount = bigint(intent.amount);
  const timestamp = integer(state.timestamp);

  if (policy.paused === true || state.policyStatus !== "ACTIVE") rules.push(1);
  if (timestamp > integer(policy.policyExpiry)) rules.push(2);
  if (timestamp > integer(intent.expiry)) rules.push(3);
  if (integer(intent.policyVersion) !== integer(policy.policyVersion)) rules.push(4);
  if (!Array.isArray(policy.allowedVenues) || !policy.allowedVenues.includes(intent.venue)) rules.push(5);
  if (!Array.isArray(policy.allowedAssets) ||
      !policy.allowedAssets.includes(intent.assetIn) || !policy.allowedAssets.includes(intent.assetOut)) rules.push(6);
  if (amount <= 0n || amount > bigint(policy.maxAmountPerAction)) rules.push(7);
  if (bigint(state.usedDailyTurnover) + bigint(state.reservedBudget) + amount > bigint(policy.dailyTurnoverCap)) rules.push(8);
  if (integer(intent.maxSlippageBps) > integer(policy.maxSlippageBps)) rules.push(9);
  if (integer(state.freshnessSeconds) > integer(policy.quoteFreshnessSeconds)) rules.push(10);
  if (state.lastActionTime !== undefined && timestamp - integer(state.lastActionTime) < integer(policy.cooldownSeconds)) rules.push(11);
  if (balance(state, intent.assetIn) - bigint(state.reservedBudget) - amount < bigint(policy.reserveRequirement)) rules.push(12);
  if (balance(state, intent.assetOut) > bigint(policy.positionCap)) rules.push(13);
  if (bundle.receiptBinding !== undefined && evidence.finalityResult !== "FINAL") rules.push(14);
  return [...new Set(rules)].sort((a, b) => a - b);
}

export function deriveGuestOutput(value: unknown): GuestOutput {
  const bundle = object(value);
  const violatedRuleIds = deriveRules(bundle);
  const decisionAllow = violatedRuleIds.length === 0;
  const claimType = decisionAllow && bundle.receiptBinding !== undefined
    ? "TRADE_EXECUTED"
    : decisionAllow ? "POLICY_ALLOWED" : "POLICY_BLOCKED";
  const committed = JSON.stringify({ decisionAllow, claimType, violatedRuleIds });
  const publicValues = `0x${createHash("sha256").update(committed).digest("hex")}`;
  return { decisionAllow, claimType, violatedRuleIds, publicValues };
}
