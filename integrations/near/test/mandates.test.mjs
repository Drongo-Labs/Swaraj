import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { evaluateParsedMandate } from "@swaraj/rules";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";

const root = join(dirname(fileURLToPath(import.meta.url)), "../mandates");
const tradingMandate = parseAgentMandate(JSON.parse(readFileSync(join(root, "trading.json"), "utf8")));
const paymentMandate = parseAgentMandate(JSON.parse(readFileSync(join(root, "payment.json"), "utf8")));
const combinedMandate = parseAgentMandate(JSON.parse(readFileSync(join(root, "combined.json"), "utf8")));

const ZERO_SIG =
  "0x2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222";
const POLICY =
  "0x3333333333333333333333333333333333333333333333333333333333333333";

function trade(amount, venue = "REF_FINANCE_NEAR") {
  return parseUnifiedAction({
    intentId: "intent_near_trade",
    agent: "agent:near",
    action: "SPOT_TRADE",
    resource: { venue },
    context: {
      amount,
      assetIn: "usdc.near",
      assetOut: "wrap.near",
      slippageBps: 50,
    },
    policyHash: POLICY,
    timestamp: 1790000000000,
    expiry: 1790000300000,
    idempotencyKey: `near_trade_${amount}`,
    signature: ZERO_SIG,
  });
}

function payment(amount, currency = "USDC") {
  return parseUnifiedAction({
    intentId: "intent_near_pay",
    agent: "agent:near",
    action: "PAYMENT",
    resource: { service: "near_ft_transfer" },
    context: {
      amount,
      currency,
      recipient: "vendor.near",
    },
    policyHash: POLICY,
    timestamp: 1790000000000,
    expiry: 1790000300000,
    idempotencyKey: `near_pay_${amount}`,
    signature: ZERO_SIG,
  });
}

test("NEAR trading template ALLOWs in-cap trade", () => {
  const d = evaluateParsedMandate(tradingMandate, trade("50000000"));
  assert.equal(d.decision, "ALLOW");
  assert.equal(d.reason, "PERMIT_MATCH");
});

test("NEAR trading template BLOCKs over-cap trade", () => {
  const d = evaluateParsedMandate(tradingMandate, trade("100000001"));
  assert.equal(d.decision, "BLOCK");
  assert.equal(d.reason, "FORBID_MATCH");
  assert.ok(d.matchedForbidRuleIds.includes("forbid_near_trade_amount"));
});

test("NEAR payment template ALLOWs in-cap payment", () => {
  const d = evaluateParsedMandate(paymentMandate, payment("1000000"));
  assert.equal(d.decision, "ALLOW");
});

test("NEAR payment template BLOCKs over-cap payment", () => {
  const d = evaluateParsedMandate(paymentMandate, payment("5000001"));
  assert.equal(d.decision, "BLOCK");
  assert.equal(d.reason, "FORBID_MATCH");
});

test("NEAR combined mandate gates both action types", () => {
  assert.equal(evaluateParsedMandate(combinedMandate, trade("1")).decision, "ALLOW");
  assert.equal(evaluateParsedMandate(combinedMandate, payment("1")).decision, "ALLOW");
  assert.equal(evaluateParsedMandate(combinedMandate, trade("100000001")).decision, "BLOCK");
  assert.equal(evaluateParsedMandate(combinedMandate, payment("5000001")).decision, "BLOCK");
});
