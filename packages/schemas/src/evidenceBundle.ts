import { z } from "zod";
import { BoundedId, HexHash, UnixSeconds, requireStrictlyAscending, parseWith } from "./primitives.js";

export const SourceClass = z.enum([
  "CANONICAL_CHAIN_STATE",
  "SIGNED_VENUE_ATTESTATION",
  "UNSIGNED_VENUE_API",
  "THIRD_PARTY_INDEXER",
  "AGENT_LOCAL_LOG",
]);
export const EvidenceTag = z.enum(["TX_INCLUDED", "TX_RECEIPT", "TRANSFER_LOG", "BLOCK_HEADER", "VENUE_ORDER_ACK", "INDEXER_FILL", "AGENT_LOG"]);
export const IntegrityMethod = z.enum(["NONE", "CHAIN_STATE_PROOF", "VENUE_SIGNATURE"]);
/** Filled in Phase 2. */
export const FinalityResult = z.enum(["PENDING", "FINAL", "NOT_FINAL", "CONFLICT"]);

export const EvidenceItemSchema = z.strictObject({
  itemId: BoundedId,
  sourceClass: SourceClass,
  tag: EvidenceTag,
  timestamp: UnixSeconds,
  /** Hash of the raw artifact this item was normalized from. */
  payloadHash: HexHash,
  integrity: z.strictObject({ method: IntegrityMethod, proofHash: HexHash.optional() }),
});

export const EvidenceBundleSchema = z
  .strictObject({
    /** Sorted ascending by `itemId`, no duplicates. */
    items: z.array(EvidenceItemSchema).min(1).max(1024),
    collectedAt: UnixSeconds,
    finalityResult: FinalityResult.optional(),
    /** hashList(EVIDENCE_BUNDLE, items). Excluded from the bundle's own hash. */
    evidenceRoot: HexHash,
  })
  .superRefine((bundle, ctx) => requireStrictlyAscending(bundle.items.map((item) => item.itemId), ctx, ["items"], "items (by itemId)"));

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type EvidenceBundle = z.infer<typeof EvidenceBundleSchema>;
export type EvidenceBundleJson = z.input<typeof EvidenceBundleSchema>;
export const parseEvidenceBundle = (input: unknown): EvidenceBundle => parseWith(EvidenceBundleSchema, input, "EvidenceBundle");
