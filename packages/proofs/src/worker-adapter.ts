export interface WorkerDependenciesOptions {
  [key: string]: unknown;
}

export function createWorkerDependencies(options: WorkerDependenciesOptions): WorkerDependenciesOptions {
  return options;
}

export async function proveAndEnqueue(): Promise<never> {
  throw new Error("legacy receipt-specific prover is not configured; use runOneProofJob");
}
