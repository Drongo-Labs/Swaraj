import { normalizeRawArtifacts } from "./normalize.js";
import { buildEvidenceBundle } from "./bundle.js";
import { EvidenceValidationError } from "./validate.js";
import type { ExecutionRef, MockEvidenceFixture, VenueAdapter } from "./types.js";

/**
 * Exact-input mock venue adapter: keyed by txHash.
 * Unknown txHash fails closed. Never claims FINAL finality.
 */
export function createMockVenueAdapter(
  fixtures: Readonly<Record<string, MockEvidenceFixture>>,
): VenueAdapter {
  return {
    async collectEvidence(ref: ExecutionRef) {
      if (ref.venue !== "UNISWAP_V3_BASE") {
        throw new EvidenceValidationError(`unsupported venue: ${ref.venue}`);
      }
      const fixture = fixtures[ref.txHash];
      if (fixture === undefined) {
        throw new EvidenceValidationError(`unknown execution txHash: ${ref.txHash}`);
      }
      const items = normalizeRawArtifacts(fixture.artifacts);
      const finalityResult =
        fixture.finalityResult ?? (fixture.conflict === true ? "CONFLICT" : "PENDING");
      return buildEvidenceBundle({
        items,
        collectedAt: ref.executedAt,
        finalityResult,
      });
    },
  };
}
