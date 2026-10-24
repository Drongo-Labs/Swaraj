import { hashList } from "@swaraj/crypto";
import { ObjectType, parseEvidenceBundle, type EvidenceBundle, type EvidenceItem } from "@swaraj/schemas";
import { validateEvidenceItems } from "./validate.js";
import type { FinalityResult } from "./types.js";

export type BuildEvidenceBundleOptions = {
  items: readonly EvidenceItem[];
  collectedAt: number;
  /** Defaults to PENDING. Mock never claims FINAL. */
  finalityResult?: FinalityResult;
  /** Skip validateEvidenceItems when false. Default true. */
  validate?: boolean;
};

/** Build a typed EvidenceBundle with a canonical evidenceRoot over sorted items. */
export function buildEvidenceBundle(options: BuildEvidenceBundleOptions): EvidenceBundle {
  const validate = options.validate !== false;
  if (validate) validateEvidenceItems(options.items);

  const evidenceRoot = hashList(ObjectType.EVIDENCE_BUNDLE, options.items);
  const finalityResult = options.finalityResult ?? "PENDING";

  return parseEvidenceBundle({
    items: [...options.items],
    collectedAt: options.collectedAt,
    finalityResult,
    evidenceRoot,
  });
}
