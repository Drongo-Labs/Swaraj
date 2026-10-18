import { createHash } from "node:crypto";
import type { VerificationBundle } from "./artifacts.js";

/**
 * Proof sink: wherever a statement's proof gets verified publicly. The
 * local sink is deterministic and offline — it references the bundle by
 * a content hash so tests and development runs are reproducible. The
 * zkVerify-backed sink is selected when the environment carries
 * credentials; its wire-up lands with the network integration pass.
 */

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
