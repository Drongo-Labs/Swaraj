import assert from "node:assert/strict";
import test from "node:test";
import { hashList } from "@swaraj/crypto";
import { ObjectType } from "@swaraj/schemas";
import {
  buildEvidenceBundle,
  CONFLICT_TX_HASH,
  createMockVenueAdapter,
  DEFAULT_MOCK_FIXTURES,
  EvidenceValidationError,
  KNOWN_TX_HASH,
  normalizeRawArtifacts,
  validateEvidenceItems,
} from "../dist/index.js";

const adapter = createMockVenueAdapter(DEFAULT_MOCK_FIXTURES);

test("known txHash yields deterministic evidence root matching hashList", async () => {
  const bundle = await adapter.collectEvidence({
    txHash: KNOWN_TX_HASH,
    venue: "UNISWAP_V3_BASE",
    executedAt: 1790000200,
  });
  assert.equal(bundle.finalityResult, "PENDING");
  assert.equal(bundle.items.length, 2);
  assert.equal(bundle.evidenceRoot, hashList(ObjectType.EVIDENCE_BUNDLE, bundle.items));
  const again = await adapter.collectEvidence({
    txHash: KNOWN_TX_HASH,
    venue: "UNISWAP_V3_BASE",
    executedAt: 1790000200,
  });
  assert.equal(again.evidenceRoot, bundle.evidenceRoot);
});

test("unknown txHash fails closed", async () => {
  await assert.rejects(
    () =>
      adapter.collectEvidence({
        txHash: "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        venue: "UNISWAP_V3_BASE",
        executedAt: 1,
      }),
    (err) => err instanceof EvidenceValidationError && /unknown execution/.test(err.message),
  );
});

test("FINAL_TX_HASH declares FINAL finality for prove demos", async () => {
  const { FINAL_TX_HASH } = await import("../dist/index.js");
  const bundle = await adapter.collectEvidence({
    txHash: FINAL_TX_HASH,
    venue: "UNISWAP_V3_BASE",
    executedAt: 1790000200,
  });
  assert.equal(bundle.finalityResult, "FINAL");
});

test("missing required tag fails validation", () => {
  const items = normalizeRawArtifacts([
    {
      itemId: "item_0001_receipt",
      sourceClass: "CANONICAL_CHAIN_STATE",
      tag: "TX_RECEIPT",
      timestamp: 1,
      payloadHash: "0x4444444444444444444444444444444444444444444444444444444444444444",
      integrity: {
        method: "CHAIN_STATE_PROOF",
        proofHash: "0x5555555555555555555555555555555555555555555555555555555555555555",
      },
    },
  ]);
  assert.throws(() => validateEvidenceItems(items), /TRANSFER_LOG/);
});

test("conflict fixture sets finalityResult CONFLICT", async () => {
  const bundle = await adapter.collectEvidence({
    txHash: CONFLICT_TX_HASH,
    venue: "UNISWAP_V3_BASE",
    executedAt: 1790000200,
  });
  assert.equal(bundle.finalityResult, "CONFLICT");
  assert.ok(bundle.items.length >= 2);
});

test("buildEvidenceBundle refuses empty items", () => {
  assert.throws(
    () => buildEvidenceBundle({ items: [], collectedAt: 1 }),
    EvidenceValidationError,
  );
});
