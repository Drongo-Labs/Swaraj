import { createHash } from "node:crypto";
import type { VerificationBundle } from "./artifacts.js";

/** Where proofs get verified. The local sink is offline and deterministic, and is not a ZK proof. */

export interface SinkAttestation {
  /** Reference recorded on the receipt, e.g. a statement id on the verification network. */
  ref: string;
  sink: "local" | "zkverify";
}

export interface ProofSink {
  submit(bundle: VerificationBundle): Promise<SinkAttestation>;
}

export class LocalProofSink implements ProofSink {
  async submit(bundle: VerificationBundle): Promise<SinkAttestation> {
    const hash = createHash("sha256").update(bundle.canonicalText).digest("hex").slice(0, 32);
    return { ref: `zkv_local_${hash}`, sink: "local" };
  }
}

export function selectProofSink(): ProofSink {
  // ZKVERIFY_SEED_PHRASE / KURIER_API_KEY will select the network sink
  // once the submission client is wired in; until then everything is
  // local.
  return new LocalProofSink();
}

/** Compatibility exports for callers that provide their own zkVerify session. */
export const SP1_PALLET = "poe";

export function createZkVerifyClient<T extends { openSession: () => unknown }>(config: T): T {
  return config;
}
