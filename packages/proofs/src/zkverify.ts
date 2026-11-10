import { createHash } from "node:crypto";
import type { VerificationBundle } from "./artifacts.js";
import { NearProofSink } from "./near-sink.js";

/** Where proofs get verified. The local sink is offline and deterministic, and is not a ZK proof. */

export interface SinkAttestation {
  /** Reference recorded on the receipt, e.g. a statement id on the verification network. */
  ref: string;
  sink: "local" | "zkverify" | "near";
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

export function selectProofSink(env: NodeJS.ProcessEnv = process.env): ProofSink {
  const kind = env.SWARAJ_PROOF_SINK ?? "local";
  if (kind === "local") return new LocalProofSink();
  if (kind === "near") {
    const accountId = env.NEAR_SINK_ACCOUNT_ID?.trim();
    const privateKey = env.NEAR_SINK_PRIVATE_KEY?.trim();
    const receiptsContractId = env.NEAR_RECEIPTS_CONTRACT_ID?.trim();
    // Fail closed: a NEAR sink without its settings must never fall back to local.
    if (!accountId || !privateKey || !receiptsContractId) {
      throw new Error(
        "SWARAJ_PROOF_SINK=near requires NEAR_SINK_ACCOUNT_ID, NEAR_SINK_PRIVATE_KEY and NEAR_RECEIPTS_CONTRACT_ID",
      );
    }
    return new NearProofSink({
      accountId,
      privateKey,
      receiptsContractId,
      ...(env.NEAR_RPC_URL?.trim() ? { rpcUrl: env.NEAR_RPC_URL.trim() } : {}),
    });
  }
  throw new Error(`unknown SWARAJ_PROOF_SINK: ${kind}`);
}

/** Compatibility exports for callers that provide their own zkVerify session. */
export const SP1_PALLET = "poe";

export function createZkVerifyClient<T extends { openSession: () => unknown }>(config: T): T {
  return config;
}
