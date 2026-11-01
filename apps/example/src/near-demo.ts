/**
 * Phase 2 NEAR demo scenes — mandate ALLOW/BLOCK for trade + payment.
 * Run: pnpm --filter @swaraj/example exec node --import tsx src/near-demo.ts
 * Or after build against a live API with the combined NEAR mandate registered.
 *
 * Offline (default): evaluates fixtures locally via @swaraj/rules.
 * Live: set SWARAJ_NEAR_LIVE=1 and hit unified-actions (requires API + mandate).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateParsedMandate } from "@swaraj/rules";
import { parseAgentMandate, parseUnifiedAction, type UnifiedAction } from "@swaraj/schemas";
import { productStatusFromDecision } from "@swaraj/contracts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../packages/contracts/fixtures");
const mandate = parseAgentMandate(
  JSON.parse(readFileSync(join(root, "near-mandate-combined.json"), "utf8")),
);

const ZERO_SIG =
  "0x2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222";
const POLICY = "0x3333333333333333333333333333333333333333333333333333333333333333";

const sceneArg = process.argv.find((a) => a.startsWith("--scene="))?.slice("--scene=".length) ?? "all";

function say(line: string) {
  console.log(`\n[near-agent] ${line}`);
}

function trade(amount: string): UnifiedAction {
  return parseUnifiedAction({
    intentId: `intent_near_t_${amount}`.slice(0, 64),
    agent: "agent:near",
    action: "SPOT_TRADE",
    resource: { venue: "REF_FINANCE_NEAR" },
    context: {
      amount,
      assetIn: "usdc.near",
      assetOut: "wrap.near",
      slippageBps: 50,
    },
    policyHash: POLICY,
    timestamp: Date.now(),
    expiry: Date.now() + 300_000,
    idempotencyKey: `near_trade_${amount}_${Date.now()}`.slice(0, 128),
    signature: ZERO_SIG,
  });
}

function payment(amount: string): UnifiedAction {
  return parseUnifiedAction({
    intentId: `intent_near_p_${amount}`.slice(0, 64),
    agent: "agent:near",
    action: "PAYMENT",
    resource: { service: "near_ft_transfer" },
    context: {
      amount,
      currency: "USDC",
      recipient: "vendor.near",
    },
    policyHash: POLICY,
    timestamp: Date.now(),
    expiry: Date.now() + 300_000,
    idempotencyKey: `near_pay_${amount}_${Date.now()}`.slice(0, 128),
    signature: ZERO_SIG,
  });
}

function run(label: string, action: UnifiedAction, expect: "ALLOW" | "BLOCK") {
  say(label);
  const decision = evaluateParsedMandate(mandate, action);
  const productStatus = productStatusFromDecision(decision.decision);
  console.log({
    action: action.action,
    decision: decision.decision,
    reason: decision.reason,
    matchedForbidRuleIds: decision.matchedForbidRuleIds,
    matchedPermitRuleIds: decision.matchedPermitRuleIds,
    productStatus,
  });
  if (decision.decision !== expect) {
    console.error(`FAIL: expected ${expect}, got ${decision.decision}`);
    process.exitCode = 1;
  } else {
    console.log(`OK — productStatus=${productStatus}`);
  }
}

console.log(`NEAR PHASE-2 DEMO — scene=${sceneArg}`);
console.log("Mandate:", mandate.mandateId);

if (sceneArg === "trade.allow" || sceneArg === "all") {
  run("Within-policy NEAR trade (50e6). Expect ALLOW.", trade("50000000"), "ALLOW");
}
if (sceneArg === "trade.block" || sceneArg === "all") {
  run("Over-limit NEAR trade (100e6+1). Expect BLOCK.", trade("100000001"), "BLOCK");
}
if (sceneArg === "payment.allow" || sceneArg === "all") {
  run("Within-policy NEAR payment (1e6). Expect ALLOW.", payment("1000000"), "ALLOW");
}
if (sceneArg === "payment.block" || sceneArg === "all") {
  run("Over-limit NEAR payment (5e6+1). Expect BLOCK.", payment("5000001"), "BLOCK");
}

if (process.exitCode) {
  say("One or more scenes failed.");
} else {
  say("All requested scenes passed.");
}
