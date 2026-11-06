import type { EvidenceBundle, EvidenceItem } from "@swaraj/schemas";

export type ExecutionRef = {
  txHash: EvidenceItem["payloadHash"];
  /** Set by the adapter that executed: core Base venues here, others in their integration. */
  venue: string;
  executedAt: number;
};

export type RawArtifact = {
  itemId: string;
  sourceClass: EvidenceItem["sourceClass"];
  tag: EvidenceItem["tag"];
  timestamp: number;
  payloadHash: EvidenceItem["payloadHash"];
  integrity: EvidenceItem["integrity"];
};

export type MockEvidenceFixture = {
  artifacts: readonly RawArtifact[];
  /** When true, buildEvidenceBundle sets finalityResult to CONFLICT. */
  conflict?: boolean;
  /**
   * Explicit finality override for demo/prove paths.
   * Mock never invents FINAL unless this is set — SP1 guest requires FINAL for ALLOW.
   */
  finalityResult?: "PENDING" | "FINAL" | "NOT_FINAL" | "CONFLICT";
};

export type VenueAdapter = {
  collectEvidence(ref: ExecutionRef): Promise<EvidenceBundle>;
};

export type { EvidenceBundle, EvidenceItem };
export type HexHash = EvidenceItem["payloadHash"];
export type UnixSeconds = number;
export type FinalityResult = NonNullable<EvidenceBundle["finalityResult"]>;
