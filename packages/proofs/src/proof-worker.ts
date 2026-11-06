/** Deprecated entry point. Use `runOneProofJob` from the package root. */
export async function runProofWorkerOnce(): Promise<never> {
  throw new Error("receipt-specific proof worker is unavailable; use runOneProofJob from @swaraj/proofs");
}
