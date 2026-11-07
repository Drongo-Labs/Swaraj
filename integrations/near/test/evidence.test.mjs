import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createNearMockVenueAdapter,
  createNearVenueAdapter,
  nearTxMatches,
  NEAR_KNOWN_TX_HASH,
  NEAR_FINAL_TX_HASH,
  NEAR_MISSING_TX_HASH,
} from "../dist/index.js";
import { EvidenceValidationError } from "@swaraj/evidence";

const adapter = createNearMockVenueAdapter();

test("NEAR mock collects PENDING evidence for known tx", async () => {
  const bundle = await adapter.collectEvidence({
    txHash: NEAR_KNOWN_TX_HASH,
    venue: "REF_FINANCE_NEAR",
    executedAt: 1790000200,
  });
  assert.equal(bundle.finalityResult, "PENDING");
  assert.ok(bundle.items.length >= 2);
});

test("NEAR mock collects FINAL evidence for final fixture", async () => {
  const bundle = await adapter.collectEvidence({
    txHash: NEAR_FINAL_TX_HASH,
    venue: "REF_FINANCE_NEAR",
    executedAt: 1790000200,
  });
  assert.equal(bundle.finalityResult, "FINAL");
});

test("NEAR mock fails closed on missing evidence", async () => {
  await assert.rejects(
    () =>
      adapter.collectEvidence({
        txHash: NEAR_MISSING_TX_HASH,
        venue: "REF_FINANCE_NEAR",
        executedAt: 1790000200,
      }),
    (error) => error instanceof EvidenceValidationError,
  );
});

test("NEAR mock rejects Base venue", async () => {
  await assert.rejects(
    () =>
      adapter.collectEvidence({
        txHash: NEAR_KNOWN_TX_HASH,
        venue: "UNISWAP_V3_BASE",
        executedAt: 1790000200,
      }),
    (error) => error instanceof EvidenceValidationError,
  );
});

const liveRef = (expect) => ({
  txHash: NEAR_KNOWN_TX_HASH,
  venue: "NEAR_PAYMENT",
  executedAt: 1790000100,
  near: { hash: "Hash1111", signerId: "agent.testnet", expect },
});

function stubRpc({ tx }) {
  return async (_url, init) => {
    const { method } = JSON.parse(init.body);
    const result =
      method === "tx" ? tx
      : method === "block" ? { header: { hash: "Head1111" } }
      : { outcome_proof: { block_hash: "Block1111" } };
    return new Response(JSON.stringify({ result }));
  };
}

const transferTx = (overrides = {}) => ({
  final_execution_status: "FINAL",
  status: { SuccessValue: "" },
  transaction: { receiver_id: "vendor.testnet", actions: [{ Transfer: { deposit: "5" } }] },
  receipts_outcome: [{ id: "r1", outcome: { status: { SuccessValue: "" } } }],
  ...overrides,
});

const expectTransfer = { kind: "transfer", receiverId: "vendor.testnet", amount: "5" };

test("live NEAR evidence is FINAL only for a final, matching, successful transaction", async () => {
  const adapter = createNearVenueAdapter({ rpcUrl: "http://rpc", fetchImpl: stubRpc({ tx: transferTx() }) });
  assert.equal((await adapter.collectEvidence(liveRef(expectTransfer))).finalityResult, "FINAL");
});

test("live NEAR evidence fails closed on a mismatched amount or recipient", async () => {
  const wrong = [
    transferTx({ transaction: { receiver_id: "vendor.testnet", actions: [{ Transfer: { deposit: "6" } }] } }),
    transferTx({ transaction: { receiver_id: "evil.testnet", actions: [{ Transfer: { deposit: "5" } }] } }),
  ];
  for (const tx of wrong) {
    const adapter = createNearVenueAdapter({ rpcUrl: "http://rpc", fetchImpl: stubRpc({ tx }) });
    await assert.rejects(adapter.collectEvidence(liveRef(expectTransfer)), /does not match/);
  }
});

test("live NEAR evidence never claims FINAL for a failed or unfinished transaction", async () => {
  const failed = transferTx({ status: { Failure: {} } });
  const nestedFailure = transferTx({ receipts_outcome: [{ id: "r1", outcome: { status: { Failure: {} } } }] });
  const unfinished = transferTx({ final_execution_status: "EXECUTED_OPTIMISTIC" });
  const results = [];
  for (const tx of [failed, nestedFailure, unfinished]) {
    const adapter = createNearVenueAdapter({ rpcUrl: "http://rpc", fetchImpl: stubRpc({ tx }) });
    results.push((await adapter.collectEvidence(liveRef(expectTransfer))).finalityResult);
  }
  assert.deepEqual(results, ["CONFLICT", "CONFLICT", "PENDING"]);
});

test("ft_transfer evidence checks the contract, receiver and amount inside the call", () => {
  const args = (o) => Buffer.from(JSON.stringify(o)).toString("base64");
  const expectFt = { kind: "ft_transfer", contractId: "usdc.testnet", receiverId: "v.testnet", amount: "7" };
  const tx = (contract, a) => ({
    receiver_id: contract,
    actions: [{ FunctionCall: { method_name: "ft_transfer", args: args(a) } }],
  });
  assert.equal(nearTxMatches(tx("usdc.testnet", { receiver_id: "v.testnet", amount: "7" }), expectFt), true);
  assert.equal(nearTxMatches(tx("usdc.testnet", { receiver_id: "v.testnet", amount: "8" }), expectFt), false);
  assert.equal(nearTxMatches(tx("fake.testnet", { receiver_id: "v.testnet", amount: "7" }), expectFt), false);
});

const swapExpect = {
  kind: "ref_swap", refContract: "ref.testnet", poolId: 17, tokenIn: "wrap.testnet",
  tokenOut: "ref.fakes.testnet", amount: "100", minAmountOut: "90",
};

function swapTx({ used = "100", minOut = "90", amount = "100" } = {}) {
  const msg = JSON.stringify({ force: 0, actions: [{ pool_id: 17, token_in: "wrap.testnet", token_out: "ref.fakes.testnet", amount_in: amount, min_amount_out: minOut }] });
  const args = Buffer.from(JSON.stringify({ receiver_id: "ref.testnet", amount, msg })).toString("base64");
  return transferTx({
    status: { SuccessValue: Buffer.from(JSON.stringify(used)).toString("base64") },
    transaction: { receiver_id: "wrap.testnet", actions: [{ FunctionCall: { method_name: "ft_transfer_call", args } }] },
  });
}

test("a swap is FINAL only when the pool consumed the full amount", async () => {
  const collect = (tx) => createNearVenueAdapter({ rpcUrl: "http://rpc", fetchImpl: stubRpc({ tx }) }).collectEvidence(liveRef(swapExpect));
  assert.equal((await collect(swapTx())).finalityResult, "FINAL");
  assert.equal((await collect(swapTx({ used: "0" }))).finalityResult, "CONFLICT");
});

test("a swap with weaker slippage protection than approved does not match", async () => {
  const adapter = createNearVenueAdapter({ rpcUrl: "http://rpc", fetchImpl: stubRpc({ tx: swapTx({ minOut: "1" }) }) });
  await assert.rejects(adapter.collectEvidence(liveRef(swapExpect)), /does not match/);
});

test("a rate-limited or failing RPC is retried, and a client error is not", async () => {
  const flaky = (failures) => {
    let calls = 0;
    const ok = stubRpc({ tx: transferTx() });
    const fetchImpl = async (url, init) => {
      calls += 1;
      if (calls <= failures.length) {
        const failure = failures[calls - 1];
        if (failure === "drop") throw new Error("connection reset");
        return new Response("", { status: failure });
      }
      return ok(url, init);
    };
    return { fetchImpl, calls: () => calls };
  };
  const collect = (fetchImpl) =>
    createNearVenueAdapter({ rpcUrl: "http://rpc", fetchImpl, retryDelayMs: 0 }).collectEvidence(liveRef(expectTransfer));

  assert.equal((await collect(flaky([429, 503, "drop"]).fetchImpl)).finalityResult, "FINAL");

  const forever = flaky(Array(50).fill(429));
  await assert.rejects(collect(forever.fetchImpl), /429/);
  assert.equal(forever.calls(), 6);

  const denied = flaky([403]);
  await assert.rejects(collect(denied.fetchImpl), /403/);
  assert.equal(denied.calls(), 1);
});
