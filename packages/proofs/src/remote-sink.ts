import type { SinkAttestation, ProofSink } from "./zkverify.js";
import type { VerificationBundle } from "./artifacts.js";

/**
 * Remote proof sink: submits a bundle to a verification endpoint and
 * polls the attestation endpoint until the statement is finalized. The
 * same flow drives zkVerify behind an HTTP gateway (direct or relayed
 * via Kurier); test deployments point it at a local relay.
 */

export interface RemoteSinkConfig {
  submitUrl: string;
  attestationUrl: (submissionRef: string) => string;
  pollIntervalMs?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface SubmissionAccepted {
  ref: string;
}

export interface AttestationStatus {
  status: "pending" | "finalized" | "failed";
  attestation?: string;
  reason?: string;
}

export class RemoteProofSink implements ProofSink {
  private readonly fetchImpl: typeof fetch;
  private readonly pollIntervalMs: number;
  private readonly timeoutMs: number;

  constructor(private readonly config: RemoteSinkConfig) {
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.pollIntervalMs = config.pollIntervalMs ?? 250;
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  async submit(bundle: VerificationBundle): Promise<SinkAttestation> {
    const submission = await this.fetchImpl(this.config.submitUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        statementId: bundle.statementId,
        canonicalText: bundle.canonicalText,
        evidenceDigest: bundle.evidenceDigest,
      }),
    });
    if (!submission.ok) {
      throw new Error(`submission rejected: ${submission.status} ${await submission.text()}`);
    }
    const accepted = (await submission.json()) as SubmissionAccepted;

    const deadline = Date.now() + this.timeoutMs;
    for (;;) {
      const poll = await this.fetchImpl(this.config.attestationUrl(accepted.ref));
      if (!poll.ok) throw new Error(`attestation poll failed: ${poll.status}`);
      const state = (await poll.json()) as AttestationStatus;
      if (state.status === "finalized") {
        return { ref: state.attestation ?? accepted.ref, sink: "zkverify" };
      }
      if (state.status === "failed") {
        throw new Error(`attestation failed: ${state.reason ?? "no reason given"}`);
      }
      if (Date.now() >= deadline) {
        throw new Error(`attestation not finalized within ${this.timeoutMs}ms`);
      }
      await delay(this.pollIntervalMs);
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
