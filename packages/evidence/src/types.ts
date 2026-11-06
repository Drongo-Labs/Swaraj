import type { EvidenceBundle, EvidenceItem } from "@swaraj/schemas";

/** Venues the evidence layer can collect for. Append only. */
export type EvidenceVenue = "UNISWAP_V3_BASE" | "REF_FINANCE_NEAR" | "NEAR_PAYMENT";

/** What the chain must show for a NEAR execution to count as the approved action. */
export type NearExpectation =
  | { kind: "transfer"; receiverId: string; amount: string }
  | { kind: "ft_transfer"; contractId: string; receiverId: string; amount: string }
  | {
      kind: "ref_swap";
      refContract: string;
      poolId: number;
      tokenIn: string;
      tokenOut: string;
      amount: string;
      minAmountOut: string;
    };

export type ExecutionRef = {
  txHash: EvidenceItem["payloadHash"];
  venue: EvidenceVenue;
  executedAt: number;
  /** Live NEAR lookup data; absent on fixture executions. */
  near?: { hash: string; signerId: string; expect: NearExpectation };
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
