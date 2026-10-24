/**
 * Compatibility entry point for the earlier receipt-specific worker API.
 * The integrated generic worker is exported as `runOneProofJob` from the
 * package root; live callers should migrate to that API.
 */
export async function runProofWorkerOnce(): Promise<never> {
  throw new Error("receipt-specific proof worker is unavailable; use runOneProofJob from @swaraj/proofs");
}
