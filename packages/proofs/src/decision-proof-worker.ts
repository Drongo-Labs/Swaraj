/** Decision-receipt worker compatibility entry point. */
export async function runDecisionProofWorkerOnce(): Promise<never> {
  throw new Error("decision-receipt proof worker is unavailable in the integrated generic proof pipeline");
}
