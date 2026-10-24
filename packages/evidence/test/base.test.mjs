import assert from "node:assert/strict";
import test from "node:test";
import {
  createBaseVenueAdapter,
  EvidenceValidationError,
} from "../dist/index.js";

const TX = "0x1111111111111111111111111111111111111111111111111111111111111111";
const BLOCK = "0x2222222222222222222222222222222222222222222222222222222222222222";
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function successReceipt() {
  return {
    transactionHash: TX,
    blockHash: BLOCK,
    blockNumber: 100n,
    status: "success",
    gasUsed: 21000n,
    cumulativeGasUsed: 21000n,
    effectiveGasPrice: 1n,
    from: "0x0000000000000000000000000000000000000001",
    to: "0x0000000000000000000000000000000000000002",
    contractAddress: null,
    logsBloom: "0x" + "00".repeat(256),
    type: "eip1559",
    transactionIndex: 0,
    logs: [
      {
        address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        topics: [
          TRANSFER_TOPIC,
          "0x0000000000000000000000000000000000000000000000000000000000000001",
          "0x0000000000000000000000000000000000000000000000000000000000000002",
        ],
        data: "0x0000000000000000000000000000000000000000000000000000000002faf080",
        blockHash: BLOCK,
        blockNumber: 100n,
        transactionHash: TX,
        logIndex: 0,
        transactionIndex: 0,
        removed: false,
      },
    ],
  };
}

test("Base venue adapter waits for 12 confirmations then returns FINAL", async () => {
  let heads = [100n, 105n, 111n];
  const client = {
    getTransactionReceipt: async () => successReceipt(),
    getBlockNumber: async () => heads.shift() ?? 111n,
  };

  let sleeps = 0;
  const adapter = createBaseVenueAdapter({
    client,
    confirmations: 12,
    pollMs: 1,
    timeoutMs: 5_000,
    sleep: async () => {
      sleeps += 1;
    },
  });

  const bundle = await adapter.collectEvidence({
    txHash: TX,
    venue: "UNISWAP_V3_BASE",
    executedAt: 1_790_000_200,
  });

  assert.equal(bundle.finalityResult, "FINAL");
  assert.equal(bundle.items.length, 2);
  assert.equal(bundle.items[0].tag, "TX_RECEIPT");
  assert.equal(bundle.items[1].tag, "TRANSFER_LOG");
  assert.equal(bundle.items[0].integrity.proofHash, BLOCK);
  assert.ok(sleeps >= 1);
});

test("Base venue adapter fails closed on reverted tx", async () => {
  const client = {
    getTransactionReceipt: async () => ({ ...successReceipt(), status: "reverted", logs: [] }),
    getBlockNumber: async () => 200n,
  };

  const adapter = createBaseVenueAdapter({ client, confirmations: 1, pollMs: 1, timeoutMs: 100 });
  await assert.rejects(
    () =>
      adapter.collectEvidence({
        txHash: TX,
        venue: "UNISWAP_V3_BASE",
        executedAt: 1,
      }),
    (err) => err instanceof EvidenceValidationError && /reverted/.test(err.message),
  );
});

test("Base venue adapter times out before FINAL", async () => {
  const client = {
    getTransactionReceipt: async () => successReceipt(),
    getBlockNumber: async () => 100n,
  };

  const adapter = createBaseVenueAdapter({
    client,
    confirmations: 12,
    pollMs: 1,
    timeoutMs: 5,
    sleep: async () => {},
  });

  await assert.rejects(
    () =>
      adapter.collectEvidence({
        txHash: TX,
        venue: "UNISWAP_V3_BASE",
        executedAt: 1,
      }),
    (err) => err instanceof EvidenceValidationError && /finality timeout/.test(err.message),
  );
});
