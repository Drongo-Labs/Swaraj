import type { MockEvidenceFixture } from "./types.js";

/** Canonical demo tx used by the mock pipeline. */
export const KNOWN_TX_HASH = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;
export const CONFLICT_TX_HASH = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as const;
/** Same artifacts as KNOWN_TX_HASH but declared FINAL for Phase 7 prove demos (not real Base finality). */
export const FINAL_TX_HASH = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" as const;

const receiptArtifact = {
  itemId: "item_0001_receipt",
  sourceClass: "CANONICAL_CHAIN_STATE" as const,
  tag: "TX_RECEIPT" as const,
  timestamp: 1790000100,
  payloadHash: "0x4444444444444444444444444444444444444444444444444444444444444444" as const,
  integrity: {
    method: "CHAIN_STATE_PROOF" as const,
    proofHash: "0x5555555555555555555555555555555555555555555555555555555555555555" as const,
  },
};

const transferArtifact = {
  itemId: "item_0002_log",
  sourceClass: "CANONICAL_CHAIN_STATE" as const,
  tag: "TRANSFER_LOG" as const,
  timestamp: 1790000100,
  payloadHash: "0x6666666666666666666666666666666666666666666666666666666666666666" as const,
  integrity: { method: "CHAIN_STATE_PROOF" as const },
};

/** The FINAL demo declares a chain-state proof on both trade artifacts, as the live Base adapter does. */
const finalTransferArtifact = {
  ...transferArtifact,
  integrity: {
    method: "CHAIN_STATE_PROOF" as const,
    proofHash: "0x5555555555555555555555555555555555555555555555555555555555555555" as const,
  },
};

const indexerConflict = {
  itemId: "item_0003_indexer",
  sourceClass: "THIRD_PARTY_INDEXER" as const,
  tag: "INDEXER_FILL" as const,
  timestamp: 1790000100,
  payloadHash: "0x8888888888888888888888888888888888888888888888888888888888888888" as const,
  integrity: { method: "NONE" as const },
};

export const DEFAULT_MOCK_FIXTURES: Readonly<Record<string, MockEvidenceFixture>> = {
  [KNOWN_TX_HASH]: {
    artifacts: [receiptArtifact, transferArtifact],
  },
  [CONFLICT_TX_HASH]: {
    artifacts: [receiptArtifact, transferArtifact, indexerConflict],
    conflict: true,
  },
  [FINAL_TX_HASH]: {
    artifacts: [receiptArtifact, finalTransferArtifact],
    finalityResult: "FINAL",
  },
};
