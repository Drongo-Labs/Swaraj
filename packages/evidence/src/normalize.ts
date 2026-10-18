import { compareStrings, EvidenceItemSchema, type EvidenceItem } from "@swaraj/schemas";
import type { RawArtifact } from "./types.js";

/** Map mock raw artifacts into typed EvidenceItems, sorted by itemId ascending. */
export function normalizeRawArtifacts(artifacts: readonly RawArtifact[]): EvidenceItem[] {
  const items = artifacts.map((artifact) => {
    const integrity =
      artifact.integrity.proofHash === undefined
        ? { method: artifact.integrity.method }
        : { method: artifact.integrity.method, proofHash: artifact.integrity.proofHash };
    return EvidenceItemSchema.parse({
      itemId: artifact.itemId,
      sourceClass: artifact.sourceClass,
      tag: artifact.tag,
      timestamp: artifact.timestamp,
      payloadHash: artifact.payloadHash,
      integrity,
    });
  });
  return items.sort((a, b) => compareStrings(a.itemId, b.itemId));
}
