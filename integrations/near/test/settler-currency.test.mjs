import assert from "node:assert/strict";
import test from "node:test";
import { isNearAction } from "../dist/index.js";

const payment = (service, currency) => ({
  intentId: "intent_1",
  agent: "agent:treasury",
  action: "PAYMENT",
  resource: { service },
  context: { amount: 1n, currency, recipient: "vendor.testnet" },
  policyHash: "0x" + "9".repeat(64),
  timestamp: Date.now(),
  expiry: Date.now() + 60_000,
  idempotencyKey: "idem_1",
  signature: "0x" + "00".repeat(65),
});

test("near_transfer only handles currency NEAR", () => {
  assert.equal(isNearAction(payment("near_transfer", "NEAR")), true);
  assert.equal(isNearAction(payment("near_transfer", "XNEAR")), false);
  assert.equal(isNearAction(payment("near_transfer", "USDC")), false);
});

test("near_ft_transfer requires NEAR_FT_CURRENCY and an exact label match", () => {
  assert.equal(isNearAction(payment("near_ft_transfer", "USDC")), false);
  assert.equal(isNearAction(payment("near_ft_transfer", "USDC"), { ftCurrency: "USDC" }), true);
  assert.equal(isNearAction(payment("near_ft_transfer", "USDT"), { ftCurrency: "USDC" }), false);
});
