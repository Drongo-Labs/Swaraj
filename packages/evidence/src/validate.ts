import type { EvidenceItem } from "@swaraj/schemas";

const REQUIRED_TRADE_TAGS = ["TX_RECEIPT", "TRANSFER_LOG"] as const;

export class EvidenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvidenceValidationError";
  }
}

/** Fail-closed checks: chain-state tags, no agent-local-only bundles, integrity present. */
export function validateEvidenceItems(items: readonly EvidenceItem[]): void {
  if (items.length === 0) {
    throw new EvidenceValidationError("evidence items required");
  }

  const tags = new Set(items.map((item) => item.tag));
  for (const required of REQUIRED_TRADE_TAGS) {
    if (!tags.has(required)) {
      throw new EvidenceValidationError(`missing required evidence tag: ${required}`);
    }
  }

  const hasCanonical = items.some((item) => item.sourceClass === "CANONICAL_CHAIN_STATE");
  if (!hasCanonical) {
    throw new EvidenceValidationError("TRADE_EXECUTED requires CANONICAL_CHAIN_STATE evidence");
  }

  const onlyAgentLocal = items.every((item) => item.sourceClass === "AGENT_LOCAL_LOG");
  if (onlyAgentLocal) {
    throw new EvidenceValidationError("agent-local-only evidence is not admissible");
  }

  for (const item of items) {
    if (item.sourceClass === "CANONICAL_CHAIN_STATE" && item.integrity.method === "NONE") {
      throw new EvidenceValidationError(`canonical item ${item.itemId} requires integrity method`);
    }
    if (item.tag === "TX_RECEIPT" && item.integrity.method === "CHAIN_STATE_PROOF" && item.integrity.proofHash === undefined) {
      throw new EvidenceValidationError(`TX_RECEIPT ${item.itemId} requires proofHash`);
    }
  }
}
