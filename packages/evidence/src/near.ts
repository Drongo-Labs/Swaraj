import { normalizeRawArtifacts } from "./normalize.js";
import { buildEvidenceBundle } from "./bundle.js";
import { EvidenceValidationError } from "./validate.js";
import type { ExecutionRef, MockEvidenceFixture, VenueAdapter } from "./types.js";
import { NEAR_KNOWN_TX_HASH, NEAR_FINAL_TX_HASH, NEAR_MISSING_TX_HASH, DEFAULT_NEAR_MOCK_FIXTURES } from "./nearFixtures.js";

export { NEAR_KNOWN_TX_HASH, NEAR_FINAL_TX_HASH, NEAR_MISSING_TX_HASH, DEFAULT_NEAR_MOCK_FIXTURES };

/**
 * Fixture NEAR venue adapter (Phase 2). Exact-input by txHash.
 * Unknown / missing evidence fails closed — never invents FINAL.
 */
export function createNearMockVenueAdapter(
  fixtures: Readonly<Record<string, MockEvidenceFixture>> = DEFAULT_NEAR_MOCK_FIXTURES,
): VenueAdapter {
  return {
    async collectEvidence(ref: ExecutionRef) {
      if (ref.venue !== "REF_FINANCE_NEAR") {
        throw new EvidenceValidationError(`unsupported venue for NEAR adapter: ${ref.venue}`);
      }
      const fixture = fixtures[ref.txHash];
      if (fixture === undefined) {
        throw new EvidenceValidationError(`unknown NEAR execution txHash: ${ref.txHash}`);
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
