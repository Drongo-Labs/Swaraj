import type { PoolHandle } from "./pool.js";

export type ProofJobPhase = "QUEUED" | "LEASED" | "DONE" | "FAILED";

export interface ProofJob {
  jobId: number;
  receiptId: string;
  payload: unknown;
  phase: ProofJobPhase;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
}

interface RawProofJobRow {
  job_id: string | number;
  receipt_id: string;
  payload: unknown;
  phase: ProofJobPhase;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
}

function toJob(row: RawProofJobRow): ProofJob {
  return {
    jobId: Number(row.job_id),
    receiptId: row.receipt_id,
    payload: row.payload,
    phase: row.phase,
    attempts: Number(row.attempts),
    maxAttempts: Number(row.max_attempts),
    lastError: row.last_error,
  };
}

const JOB_COLUMNS = "job_id, receipt_id, payload, phase, attempts, max_attempts, last_error";

export async function enqueueProofJob(
  handle: PoolHandle,
  entry: { receiptId: string; payload: unknown; maxAttempts?: number },
): Promise<ProofJob> {
  const result = await handle.raw.query<RawProofJobRow>(
    `INSERT INTO proof_jobs (receipt_id, payload, max_attempts)
     VALUES ($1, $2::jsonb, COALESCE($3, 3))
     RETURNING ${JOB_COLUMNS}`,
    [entry.receiptId, JSON.stringify(entry.payload), entry.maxAttempts ?? null],
  );
  return toJob(result.rows[0]!);
}

/**
 * Atomically lease the oldest queued job. SKIP LOCKED keeps concurrent
 * workers from fighting over the same row; attempts increments on every
 * lease so max_attempts bounds total tries.
 */
export async function leaseNextProofJob(handle: PoolHandle): Promise<ProofJob | undefined> {
  const result = await handle.raw.query<RawProofJobRow>(
    `UPDATE proof_jobs SET phase = 'LEASED', leased_at = now(), attempts = attempts + 1
     WHERE job_id = (
       SELECT job_id FROM proof_jobs WHERE phase = 'QUEUED' AND attempts < max_attempts
       ORDER BY job_id FOR UPDATE SKIP LOCKED LIMIT 1
     )
     RETURNING ${JOB_COLUMNS}`,
  );
  const row = result.rows[0];
  return row ? toJob(row) : undefined;
}

export async function finishProofJob(
  handle: PoolHandle,
  jobId: number,
): Promise<void> {
  await handle.raw.query(
    "UPDATE proof_jobs SET phase = 'DONE', finished_at = now() WHERE job_id = $1",
    [jobId],
  );
}

/**
 * Release a failed lease. Goes back to QUEUED while attempts remain,
 * otherwise the job is parked as FAILED with the error text recorded.
 */
export async function failProofJob(
  handle: PoolHandle,
  jobId: number,
  error: string,
): Promise<ProofJobPhase> {
  const result = await handle.raw.query<{ phase: ProofJobPhase }>(
    `UPDATE proof_jobs
        SET phase = CASE WHEN attempts >= max_attempts THEN 'FAILED' ELSE 'QUEUED' END,
            last_error = $2,
            leased_at = NULL
      WHERE job_id = $1
      RETURNING phase`,
    [jobId, error],
  );
  return result.rows[0]?.phase ?? "QUEUED";
}

export async function insertProofArtifact(
  handle: PoolHandle,
  artifact: { jobId: number; receiptId: string; kind: "VERIFICATION_BUNDLE" | "ZKVERIFY_ATTESTATION"; content: unknown },
): Promise<number> {
  const result = await handle.raw.query<{ artifact_id: string | number }>(
    `INSERT INTO proof_artifacts (job_id, receipt_id, kind, content)
     VALUES ($1, $2, $3, $4::jsonb) RETURNING artifact_id`,
    [artifact.jobId, artifact.receiptId, artifact.kind, JSON.stringify(artifact.content)],
  );
  return Number(result.rows[0]!.artifact_id);
}
