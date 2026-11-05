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
import { openArtifactStore, storeProofArtifact } from "./artifacts.js";
import { buildStatement, canonicalStatementText, statementId } from "./statement.js";
import { proveStatementViaSp1, type Sp1ProverConfig } from "./sp1-prover.js";
import { reevaluateGround, fromWirePolicy, type GroundBinding, type GroundDecision } from "./verifier.js";
import { selectProofSink, type ProofSink } from "./zkverify.js";

/**
/** Mandate-decision job: the worker re-derives the decision with the rules
 * engine (@swaraj/rules, deterministic) and refuses to bundle on any
 * disagreement with the recorded decision. SP1 zk proving of this statement
 * kind is future work (the guest is gate-scoped); the bundle + sink +
 * PENDING→PROVED lifecycle is the reused pipeline.
 */
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
  /** Live NEAR transaction reference, carried through to the receipt bundle. */
  near?: unknown;
}

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
    if (decision.decision === "NEEDS_APPROVAL" && payload.approvedBy === undefined) {
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
    const bundle = {
      statementId: id,
      canonicalText: canonicalMandateStatementText(statement),
      createdAt: new Date().toISOString(),
    };

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
