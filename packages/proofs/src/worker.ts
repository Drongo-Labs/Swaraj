import {
  advanceReceipt,
  finishProofJob,
  failProofJob,
  insertProofArtifact,
  leaseNextProofJob,
  type PoolHandle,
} from "@swaraj/database";
import type { PolicyDoc } from "@swaraj/smt";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateParsedMandate } from "@swaraj/rules";
import { buildMandateStatement, canonicalMandateStatementText, mandateStatementId } from "./mandate-statement.js";
import { openArtifactStore, storeProofArtifact, type VerificationBundle } from "./artifacts.js";
import { buildStatement, canonicalStatementText, statementId } from "./statement.js";
import { proveStatementViaSp1, type Sp1ProverConfig } from "./sp1-prover.js";
import {
  decisionGuestInput,
  expectedHashes,
  proveMandateDecision,
  type DecisionProverConfig,
} from "./decision-prover.js";
import { reevaluateGround, fromWirePolicy, type GroundBinding, type GroundDecision } from "./verifier.js";
import { selectProofSink, type ProofSink } from "./zkverify.js";

/** Mandate job: re-derives the decision and refuses to bundle on disagreement. Not SP1-proved yet. */
export interface MandateJobPayload {
  kind: "MANDATE";
  /** Wire mandate document as registered (JSON-safe). */
  mandate: unknown;
  /** Wire unified action as submitted (JSON-safe). */
  action: unknown;
  expected: { decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL"; matchedRuleIds: string[] };
  intentHash: string;
  mandateHash: string;
  /** Who approved a NEEDS_APPROVAL decision. */
  approvedBy?: string;
  /** Evidence root of the executed action; bound into the proved statement. */
  evidenceDigest?: string;
  /** The on-chain transaction reference, carried through to the receipt bundle. */
  chainExecution?: unknown;
}

/** `expected` is the recorded decision. The worker refuses to bundle if it recomputes differently. */
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
  /** When set, the SP1 gate guest proves the statement before submission. */
  sp1?: Sp1ProverConfig;
  /** When set, the decision guest proves MANDATE jobs with Groth16 before submission. */
  decisionSp1?: DecisionProverConfig;
}

async function runMandateJob(
  pool: PoolHandle,
  options: WorkerOptions,
  jobId: number,
  receiptId: string,
  payload: MandateJobPayload,
  sink: ProofSink,
): Promise<WorkerOutcome | undefined> {
  try {
    // Parity gate: re-derive the decision from the committed mandate + action.
    const mandate = parseAgentMandate(payload.mandate);
    const action = parseUnifiedAction(payload.action);
    const decision = evaluateParsedMandate(mandate, action);
    const expectedIds = payload.expected.matchedRuleIds.slice().sort().join(",");
    const actualIds = decision.matchedRuleIds.slice().sort().join(",");
    const sameOutcome = decision.decision === payload.expected.decision && actualIds === expectedIds;
    if ((decision.decision as string) === "NEEDS_APPROVAL" && payload.approvedBy === undefined) {
      throw new Error("mandate parity failure: NEEDS_APPROVAL with no approver");
    }
    if (!sameOutcome) {
      throw new Error(
        `mandate parity failure: recorded ${payload.expected.decision} [${expectedIds}], recomputed ${decision.decision} [${actualIds}]`,
      );
    }

    const statement = buildMandateStatement({
      intentHash: payload.intentHash,
      mandateHash: payload.mandateHash,
      decision: decision.decision,
      matchedRuleIds: decision.matchedRuleIds,
      ...(payload.approvedBy !== undefined ? { approvedBy: payload.approvedBy } : {}),
      ...(payload.evidenceDigest !== undefined ? { evidenceDigest: payload.evidenceDigest } : {}),
    });
    const id = mandateStatementId(statement);
    const canonicalText = canonicalMandateStatementText(statement);
    const bundle: VerificationBundle = {
      statementId: id,
      canonicalText,
      createdAt: new Date().toISOString(),
    };

    // Prove with the decision guest (Groth16) when configured. The guest must
    // commit exactly the bundle's text; anything else fails the job.
    if (options.decisionSp1) {
      const guestInput = decisionGuestInput(payload);
      const hashes = expectedHashes(guestInput);
      if (hashes.intentHash !== payload.intentHash || hashes.mandateHash !== payload.mandateHash) {
        throw new Error(
          `mandate hash mismatch: payload intent=${payload.intentHash} mandate=${payload.mandateHash}, canonical bytes give intent=${hashes.intentHash} mandate=${hashes.mandateHash}`,
        );
      }
      const proof = await proveMandateDecision(options.decisionSp1, guestInput, canonicalText);
      bundle.proof = proof.groth16;
      const proofArtifactPath = await storeProofArtifact(options.artifactRoot, receiptId, id, proof.proofBytes);
      await insertProofArtifact(pool, {
        jobId,
        receiptId,
        kind: "SP1_PROOF",
        content: { statementId: id, proofPath: proofArtifactPath },
      });
    }

    const artifactPath = await openArtifactStore(options.artifactRoot).writeBundle(receiptId, bundle);
    await insertProofArtifact(pool, { jobId, receiptId, kind: "VERIFICATION_BUNDLE", content: bundle });

    const attestation = await sink.submit(bundle);
    await insertProofArtifact(pool, {
      jobId,
      receiptId,
      kind: "ZKVERIFY_ATTESTATION",
      content: { ref: attestation.ref, sink: attestation.sink, statementId: id },
    });
    await advanceReceipt(pool, receiptId, "PROVED", {
      proofRef: attestation.ref,
      note: `mandate statement ${id} via ${attestation.sink} sink`,
    });
    await finishProofJob(pool, jobId);
    return { jobId, receiptId, statementId: id, proofRef: attestation.ref, artifactPath };
  } catch (error) {
    await failProofJob(pool, jobId, error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

/** Processes one job: PENDING → PROVED on success. On failure it retries, or parks the job as FAILED. */
export async function runOneProofJob(
  pool: PoolHandle,
  options: WorkerOptions,
): Promise<WorkerOutcome | undefined> {
  const job = await leaseNextProofJob(pool);
  if (!job) return undefined;

  const payload = job.payload as GateJobPayload | MandateJobPayload;
  const receiptId = job.receiptId;
  const sink = options.sink ?? selectProofSink();

  if ((payload as MandateJobPayload).kind === "MANDATE") {
    return runMandateJob(pool, options, job.jobId, receiptId, payload as MandateJobPayload, sink);
  }
  const gatePayload = payload as GateJobPayload;

  try {
    const policy = fromWirePolicy(gatePayload.policy);
    const decision = reevaluateGround(policy, gatePayload.action);
    const sameOutcome = decision.outcome === gatePayload.expected.outcome
      && decision.violatedRuleIds.slice().sort().join(",") === gatePayload.expected.violatedRuleIds.slice().sort().join(",");
    if (!sameOutcome) {
      throw new Error(
        `gate parity failure: recorded ${gatePayload.expected.outcome} [${gatePayload.expected.violatedRuleIds}], recomputed ${decision.outcome} [${decision.violatedRuleIds}]`,
      );
    }

    const statement = buildStatement(policy, gatePayload.action, decision);
    const id = statementId(statement);
    const bundle = {
      statementId: id,
      canonicalText: canonicalStatementText(statement),
      evidenceDigest: gatePayload.evidence?.digest,
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
        policy: gatePayload.policy,
        action: gatePayload.action,
        policyDocDigest: statement.policyDocDigest,
        expectedStatementId: id,
      });
      const proofArtifactPath = await storeProofArtifact(
        options.artifactRoot,
        receiptId,
        id,
        proof.proofBytes,
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
