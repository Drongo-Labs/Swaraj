import {
  advanceReceipt,
  finishProofJob,
  failProofJob,
  insertProofArtifact,
  leaseNextProofJob,
  type PoolHandle,
} from "@swaraj/database";
import type { PolicyDoc } from "@swaraj/smt";
import { readFile } from "node:fs/promises";
import { openArtifactStore, storeProofArtifact } from "./artifacts.js";
import { buildStatement, canonicalStatementText, statementId } from "./statement.js";
import { proveStatementViaSp1, type Sp1ProverConfig } from "./sp1-prover.js";
import { reevaluateGround, fromWirePolicy, type GroundBinding, type GroundDecision } from "./verifier.js";
import { selectProofSink, type ProofSink } from "./zkverify.js";

/**
 * Proof job payload. `expected` is the decision the gateway recorded when
 * the action was submitted; the worker recomputes it from the committed
 * policy and action and refuses to produce a bundle on disagreement.
 */
export interface GateJobPayload {
  /** Wire form of the policy: JSON-safe numbers, as stored in the queue. */
  policy: PolicyDoc;
  action: GroundBinding;
  expected: GroundDecision;
  /** Evidence the proof covers, when the evidence stage has run. */
  evidence?: { digest: string };
}

export interface WorkerOutcome {
  jobId: number;
  receiptId: string;
  statementId: string;
  proofRef: string;
  artifactPath: string;
}

export interface WorkerOptions {
  artifactRoot: string;
  sink?: ProofSink;
  /** When set, the SP1 guest proves the statement before submission. */
  sp1?: Sp1ProverConfig;
}

/**
 * Lease and fully process one proof job. On success the receipt advances
 * PENDING -> PROVED with the sink's reference; on any failure the job is
 * released for retry (or parked as FAILED once attempts are exhausted).
 */
export async function runOneProofJob(
  pool: PoolHandle,
  options: WorkerOptions,
): Promise<WorkerOutcome | undefined> {
  const job = await leaseNextProofJob(pool);
  if (!job) return undefined;

  const payload = job.payload as GateJobPayload;
  const receiptId = job.receiptId;
  const sink = options.sink ?? selectProofSink();

  try {
    const policy = fromWirePolicy(payload.policy);
    const decision = reevaluateGround(policy, payload.action);
    const sameOutcome = decision.outcome === payload.expected.outcome
      && decision.violatedRuleIds.slice().sort().join(",") === payload.expected.violatedRuleIds.slice().sort().join(",");
    if (!sameOutcome) {
      throw new Error(
        `gate parity failure: recorded ${payload.expected.outcome} [${payload.expected.violatedRuleIds}], recomputed ${decision.outcome} [${decision.violatedRuleIds}]`,
      );
    }

    const statement = buildStatement(policy, payload.action, decision);
    const id = statementId(statement);
    const bundle = {
      statementId: id,
      canonicalText: canonicalStatementText(statement),
      evidenceDigest: payload.evidence?.digest,
      createdAt: new Date().toISOString(),
    };

    const artifactPath = await openArtifactStore(options.artifactRoot).writeBundle(receiptId, bundle);
    await insertProofArtifact(pool, {
      jobId: job.jobId,
      receiptId,
      kind: "VERIFICATION_BUNDLE",
      content: bundle,
    });

    if (options.sp1) {
      const proof = await proveStatementViaSp1(options.sp1, {
        policy: payload.policy,
        action: payload.action,
        policyDocDigest: statement.policyDocDigest,
        expectedStatementId: id,
      });
      const proofArtifactPath = await storeProofArtifact(
        options.artifactRoot,
        receiptId,
        id,
        new Uint8Array(await readFile(proof.proofPath)),
      );
      await insertProofArtifact(pool, {
        jobId: job.jobId,
        receiptId,
        kind: "SP1_PROOF",
        content: { statementId: id, proofPath: proofArtifactPath },
      });
    }

    const attestation = await sink.submit(bundle);
    await insertProofArtifact(pool, {
      jobId: job.jobId,
      receiptId,
      kind: "ZKVERIFY_ATTESTATION",
      content: { ref: attestation.ref, sink: attestation.sink, statementId: id },
    });
    await advanceReceipt(pool, receiptId, "PROVED", {
      proofRef: attestation.ref,
      note: `statement ${id} via ${attestation.sink} sink`,
    });
    await finishProofJob(pool, job.jobId);

    return { jobId: job.jobId, receiptId, statementId: id, proofRef: attestation.ref, artifactPath };
  } catch (err) {
    await failProofJob(pool, job.jobId, String(err));
    return undefined;
  }
}
