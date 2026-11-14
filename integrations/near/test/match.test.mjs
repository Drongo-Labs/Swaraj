import assert from "node:assert/strict";
import test from "node:test";
import { parseUnifiedAction } from "@swaraj/schemas";
import { nearExecutionMatchesAction } from "../dist/index.js";

const base = { intentId: "i", agent: "agent:a", policyHash: "0x" + "9".repeat(64), timestamp: 1790000000000, expiry: 1790000300000, idempotencyKey: "k", signature: "0x" + "00".repeat(65) };
const pay = parseUnifiedAction({ ...base, action: "PAYMENT", resource: { service: "near_transfer" }, context: { amount: "5", currency: "NEAR", recipient: "v.testnet" } });
const swap = parseUnifiedAction({ ...base, action: "SPOT_TRADE", resource: { venue: "REF_FINANCE_NEAR" }, context: { amount: "1000", assetIn: "wrap.testnet", assetOut: "ref.fakes.testnet", slippageBps: 100 } });
const tx = (expect) => ({ hash: "H", signerId: "a.testnet", expect });

test("a native NEAR payment matches only a native transfer of the same amount to the same account", () => {
  assert.equal(nearExecutionMatchesAction(tx({ kind: "transfer", receiverId: "v.testnet", amount: "5" }), pay), true);
  assert.equal(nearExecutionMatchesAction(tx({ kind: "ft_transfer", contractId: "x.testnet", receiverId: "v.testnet", amount: "5" }), pay, { ftContract: "x.testnet" }), false);
  assert.equal(nearExecutionMatchesAction(tx({ kind: "transfer", receiverId: "v.testnet", amount: "6" }), pay), false);
});

test("a swap must carry a real minimum output", () => {
  const ref = { kind: "ref_swap", refContract: "ref-finance-101.testnet", poolId: 17, tokenIn: "wrap.testnet", tokenOut: "ref.fakes.testnet", amount: "1000" };
  assert.equal(nearExecutionMatchesAction(tx({ ...ref, minAmountOut: "950" }), swap), true);
  assert.equal(nearExecutionMatchesAction(tx({ ...ref, minAmountOut: "0" }), swap), false);
  assert.equal(nearExecutionMatchesAction(tx({ ...ref, tokenOut: "other.testnet", minAmountOut: "950" }), swap), false);
});
