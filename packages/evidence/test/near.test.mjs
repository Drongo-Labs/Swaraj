import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createNearMockVenueAdapter,
  NEAR_KNOWN_TX_HASH,
  NEAR_FINAL_TX_HASH,
  NEAR_MISSING_TX_HASH,
  EvidenceValidationError,
} from "../dist/index.js";

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
