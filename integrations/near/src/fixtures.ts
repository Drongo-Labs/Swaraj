import type { MockEvidenceFixture } from "@swaraj/evidence";

/** Fixture NEAR execution ids (not live chain hashes). */
export const NEAR_KNOWN_TX_HASH =
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01" as const;
export const NEAR_FINAL_TX_HASH =
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc01" as const;
/** Reserved id — intentionally absent from fixtures so collectEvidence fails closed. */
export const NEAR_MISSING_TX_HASH =
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd01" as const;

const nearReceipt = {
  itemId: "near_item_0001_receipt",
  sourceClass: "CANONICAL_CHAIN_STATE" as const,
  tag: "TX_RECEIPT" as const,
  timestamp: 1790000100,
  payloadHash: "0x4141414141414141414141414141414141414141414141414141414141414141" as const,
  integrity: {
    method: "CHAIN_STATE_PROOF" as const,
    proofHash: "0x5151515151515151515151515151515151515151515151515151515151515151" as const,
  },
};

const nearTransfer = {
  itemId: "near_item_0002_log",
  sourceClass: "CANONICAL_CHAIN_STATE" as const,
  tag: "TRANSFER_LOG" as const,
  timestamp: 1790000100,
  payloadHash: "0x6161616161616161616161616161616161616161616161616161616161616161" as const,
  integrity: { method: "CHAIN_STATE_PROOF" as const },
};

const nearFinalTransfer = {
  ...nearTransfer,
  integrity: {
    method: "CHAIN_STATE_PROOF" as const,
    proofHash: "0x5151515151515151515151515151515151515151515151515151515151515151" as const,
  },
};

export const DEFAULT_NEAR_MOCK_FIXTURES: Readonly<Record<string, MockEvidenceFixture>> = {
  [NEAR_KNOWN_TX_HASH]: {
    artifacts: [nearReceipt, nearTransfer],
  },
  [NEAR_FINAL_TX_HASH]: {
    artifacts: [nearReceipt, nearFinalTransfer],
    finalityResult: "FINAL",
  },
};
