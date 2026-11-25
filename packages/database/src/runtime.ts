import { createHash, randomUUID } from "node:crypto";
import pg from "pg";

export function createDatabase(url: string | undefined): pg.Pool {
  if (!url) throw new Error("DATABASE_URL is not set");
  return new pg.Pool({ connectionString: url, max: 5, idleTimeoutMillis: 10_000 });
}

export interface ActivePolicyRecord {
  applicationId: string;
  policyId: string;
  version: number;
  status: "DRAFT" | "ACTIVE" | "RETIRED";
  definition: Record<string, unknown>;
  policyHash: string;
}

export async function ensureApplication(pool: pg.Pool, id: string, name: string): Promise<void> {
  await pool.query(
    "INSERT INTO runtime_applications (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
    [id, name],
  );
}

export async function upsertActivePolicy(
  pool: pg.Pool,
  policy: Omit<ActivePolicyRecord, "status"> & { status?: ActivePolicyRecord["status"] },
): Promise<ActivePolicyRecord> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE runtime_policies SET status = 'RETIRED'
       WHERE application_id = $1 AND id = $2 AND status = 'ACTIVE' AND version <> $3`,
      [policy.applicationId, policy.policyId, policy.version],
    );
    const result = await client.query(
      `INSERT INTO runtime_policies
         (application_id, id, version, action_type, status, definition, policy_hash)
       VALUES ($1, $2, $3, 'SPOT_TRADE', 'ACTIVE', $4::jsonb, $5)
       ON CONFLICT (application_id, id, version) DO UPDATE
         SET status = 'ACTIVE', definition = EXCLUDED.definition, policy_hash = EXCLUDED.policy_hash
       RETURNING application_id, id, version, status, definition, policy_hash`,
      [policy.applicationId, policy.policyId, policy.version, JSON.stringify(policy.definition), policy.policyHash],
    );
    await client.query("COMMIT");
    return policyFromRow(result.rows[0] as Record<string, unknown>);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getActivePolicy(
  pool: pg.Pool,
  applicationId: string,
  policyId: string,
): Promise<ActivePolicyRecord | undefined> {
  const result = await pool.query(
    `SELECT application_id, id, version, status, definition, policy_hash
     FROM runtime_policies
     WHERE application_id = $1 AND id = $2 AND status = 'ACTIVE'
     ORDER BY version DESC LIMIT 1`,
    [applicationId, policyId],
  );
  return result.rows[0] ? policyFromRow(result.rows[0] as Record<string, unknown>) : undefined;
}

function policyFromRow(row: Record<string, unknown>): ActivePolicyRecord {
  return {
    applicationId: String(row.application_id),
    policyId: String(row.id),
    version: Number(row.version),
    status: String(row.status) as ActivePolicyRecord["status"],
    definition: row.definition as Record<string, unknown>,
    policyHash: String(row.policy_hash),
  };
}

type CapabilityStatus = "ISSUED" | "CONSUMED" | "EXPIRED" | "RELEASED";
type ReservationStatus = "HELD" | "COMMITTED" | "RELEASED";
type Hex = `0x${string}`;
type Token = {
  capabilityId: string;
  intentHash: Hex;
  policyHash: Hex;
  accountRef: Hex;
  idempotencyKey: string;
  audience: "swaraj.execution.v1";
  amount: string;
  issuedAt: number;
  expiresAt: number;
  signature: Hex;
  signerKeyId: Hex;
};
type StoredCapability = { token: Token; applicationId: string; status: CapabilityStatus };
type Reservation = {
  reservationId: string;
  applicationId: string;
  capabilityId: string;
  accountRef: string;
  amount: string;
  status: ReservationStatus;
  createdAt: number;
  updatedAt: number;
};

export function createPostgresCapabilityStore(pool: pg.Pool) {
  const fromRow = (row: Record<string, unknown>): StoredCapability => ({
    token: row.token as Token,
    applicationId: String(row.application_id),
    status: String(row.status) as CapabilityStatus,
  });
  return {
    async get(capabilityId: string): Promise<StoredCapability | undefined> {
      const result = await pool.query("SELECT * FROM runtime_capabilities WHERE id = $1", [capabilityId]);
      return result.rows[0] ? fromRow(result.rows[0] as Record<string, unknown>) : undefined;
    },
    async put(record: StoredCapability): Promise<void> {
      await pool.query(
        `INSERT INTO runtime_capabilities (id, application_id, account_ref, idempotency_key, status, token)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb)`,
        [record.token.capabilityId, record.applicationId, record.token.accountRef,
          record.token.idempotencyKey, record.status, JSON.stringify(record.token)],
      );
    },
    async updateStatus(capabilityId: string, status: CapabilityStatus): Promise<void> {
      const result = await pool.query(
        "UPDATE runtime_capabilities SET status=$2, updated_at=now() WHERE id=$1",
        [capabilityId, status],
      );
      if (!result.rowCount) throw new Error("capability not found");
    },
    async getByIdempotency(applicationId: string, accountRef: string, idempotencyKey: string) {
      const result = await pool.query(
        `SELECT * FROM runtime_capabilities
         WHERE application_id=$1 AND account_ref=$2 AND idempotency_key=$3`,
        [applicationId, accountRef, idempotencyKey],
      );
      return result.rows[0] ? fromRow(result.rows[0] as Record<string, unknown>) : undefined;
    },
  };
}

export function createPostgresReservationStore(pool: pg.Pool) {
  const fromRow = (row: Record<string, unknown>): Reservation => ({
    reservationId: String(row.id),
    applicationId: String(row.application_id),
    capabilityId: String(row.capability_id),
    accountRef: String(row.account_ref),
    amount: String(row.amount),
    status: String(row.status) as ReservationStatus,
    createdAt: Math.floor(new Date(String(row.created_at)).getTime() / 1000),
    updatedAt: Math.floor(new Date(String(row.updated_at)).getTime() / 1000),
  });
  return {
    async get(id: string) {
      const result = await pool.query("SELECT * FROM runtime_reservations WHERE id=$1", [id]);
      return result.rows[0] ? fromRow(result.rows[0] as Record<string, unknown>) : undefined;
    },
    async getByCapability(capabilityId: string) {
      const result = await pool.query("SELECT * FROM runtime_reservations WHERE capability_id=$1", [capabilityId]);
      return result.rows[0] ? fromRow(result.rows[0] as Record<string, unknown>) : undefined;
    },
    async put(record: Reservation): Promise<void> {
      await pool.query(
        `INSERT INTO runtime_reservations
           (id, application_id, capability_id, account_ref, amount, status, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,to_timestamp($7),to_timestamp($8))`,
        [record.reservationId, record.applicationId, record.capabilityId, record.accountRef,
          record.amount, record.status, record.createdAt, record.updatedAt],
      );
    },
    async update(record: Reservation): Promise<void> {
      await pool.query(
        "UPDATE runtime_reservations SET amount=$2,status=$3,updated_at=to_timestamp($4) WHERE id=$1",
        [record.reservationId, record.amount, record.status, record.updatedAt],
      );
    },
    async sumHeld(applicationId: string, accountRef: string): Promise<bigint> {
      const result = await pool.query<{ total: string }>(
        `SELECT COALESCE(sum(amount), 0)::text AS total FROM runtime_reservations
         WHERE application_id=$1 AND account_ref=$2 AND status='HELD'`,
        [applicationId, accountRef],
      );
      return BigInt(result.rows[0]?.total ?? "0");
    },
    async sumCommittedSince(applicationId: string, accountRef: string, since: number): Promise<bigint> {
      const result = await pool.query<{ total: string }>(
        `SELECT COALESCE(sum(amount), 0)::text AS total FROM runtime_reservations
         WHERE application_id=$1 AND account_ref=$2 AND status='COMMITTED'
           AND updated_at >= to_timestamp($3)`,
        [applicationId, accountRef, since],
      );
      return BigInt(result.rows[0]?.total ?? "0");
    },
  };
}

export interface AuthorizationDecisionRow {
  id: string;
  decisionHash: string;
}

interface RuntimeDecisionToStore {
  intentHash: string;
  policyHash: string;
  stateHash: string;
  policyVersion: number;
  decision: "ALLOW" | "BLOCK";
  solverStatus: string;
  violatedRuleIds: number[];
}

export function createPostgresDecisionStore(pool: pg.Pool) {
  return {
    async save(decision: RuntimeDecisionToStore): Promise<string> {
      const id = randomUUID();
      const decisionHash = createHash("sha256").update(JSON.stringify(decision)).digest("hex");
      await pool.query(
        `INSERT INTO runtime_authorization_decisions
           (id, intent_hash, policy_hash, state_hash, policy_version, decision,
            solver_status, violated_rule_ids, decision_hash, payload)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10::jsonb)`,
        [id, decision.intentHash, decision.policyHash, decision.stateHash, decision.policyVersion,
          decision.decision, decision.solverStatus, JSON.stringify(decision.violatedRuleIds ?? []),
          decisionHash, JSON.stringify(decision)],
      );
      return id;
    },
  };
}

export async function getAuthorizationDecision(
  pool: pg.Pool,
  id: string,
): Promise<AuthorizationDecisionRow | undefined> {
  const result = await pool.query("SELECT id, decision_hash FROM runtime_authorization_decisions WHERE id=$1", [id]);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? { id: String(row.id), decisionHash: String(row.decision_hash) } : undefined;
}

export interface RuntimeProofJob {
  id: string;
  state: string;
  attempts: number;
  [key: string]: unknown;
}

function proofJobFromRow(row: Record<string, unknown>): RuntimeProofJob {
  return {
    id: String(row.id),
    state: String(row.state),
    attempts: Number(row.attempts),
    ...(row.last_error != null ? { lastError: String(row.last_error) } : {}),
    ...(row.zkverify_network != null ? { zkverifyNetwork: String(row.zkverify_network) } : {}),
    ...(row.zkverify_tx_hash != null ? { zkverifyTxHash: String(row.zkverify_tx_hash) } : {}),
    ...(row.zkverify_statement != null ? { zkverifyStatement: String(row.zkverify_statement) } : {}),
    ...(row.aggregation_id != null ? { aggregationId: String(row.aggregation_id) } : {}),
  };
}

export function createProofJobQueue(pool: pg.Pool) {
  return {
    async getByReceipt(applicationId: string, receiptId: string): Promise<RuntimeProofJob | undefined> {
      const result = await pool.query(
        "SELECT * FROM runtime_proof_jobs WHERE application_id=$1 AND receipt_id=$2 ORDER BY created_at DESC LIMIT 1",
        [applicationId, receiptId],
      );
      return result.rows[0] ? proofJobFromRow(result.rows[0] as Record<string, unknown>) : undefined;
    },
  };
}

export interface ProofInputRecord {
  subjectKind: "TRADE_RECEIPT" | "DECISION_RECEIPT";
  applicationId: string;
  subjectId: string;
  guestBundle: unknown;
}

export function createProofInputStore(pool: pg.Pool) {
  return {
    async put(record: ProofInputRecord): Promise<void> {
      const payload = JSON.stringify(record.guestBundle);
      const hash = createHash("sha256").update(payload).digest("hex");
      await pool.query(
        `INSERT INTO runtime_proof_inputs
           (subject_kind, application_id, subject_id, guest_bundle, bundle_sha256)
         VALUES ($1,$2,$3,$4::jsonb,$5)
         ON CONFLICT (subject_kind, application_id, subject_id) DO NOTHING`,
        [record.subjectKind, record.applicationId, record.subjectId, payload, hash],
      );
    },
    async get(subjectKind: ProofInputRecord["subjectKind"], applicationId: string, subjectId: string) {
      const result = await pool.query(
        `SELECT subject_kind, application_id, subject_id, guest_bundle
         FROM runtime_proof_inputs WHERE subject_kind=$1 AND application_id=$2 AND subject_id=$3`,
        [subjectKind, applicationId, subjectId],
      );
      const row = result.rows[0] as Record<string, unknown> | undefined;
      return row ? {
        subjectKind: String(row.subject_kind) as ProofInputRecord["subjectKind"],
        applicationId: String(row.application_id), subjectId: String(row.subject_id),
        guestBundle: row.guest_bundle,
      } : undefined;
    },
  };
}

export type DecisionReceiptStatus = "PENDING" | "PROVED" | "NON_PROVABLE";
export interface DecisionReceiptRecord {
  id: string;
  applicationId: string;
  decisionLogEntryHash: string;
  intentHash: string;
  policyHash: string;
  stateHash: string;
  decision: "BLOCK";
  violatedRuleIds: number[];
  referenceTime: number;
  verifierVersion: string;
  solverStatus: string;
  status: DecisionReceiptStatus;
  reasonCode?: string;
  proofMetadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

function decisionReceiptFromRow(row: Record<string, unknown>): DecisionReceiptRecord {
  const record: DecisionReceiptRecord = {
    id: String(row.id), applicationId: String(row.application_id),
    decisionLogEntryHash: String(row.decision_log_entry_hash), intentHash: String(row.intent_hash),
    policyHash: String(row.policy_hash), stateHash: String(row.state_hash), decision: "BLOCK",
    violatedRuleIds: row.violated_rule_ids as number[], referenceTime: Number(row.reference_time),
    verifierVersion: String(row.verifier_version), solverStatus: String(row.solver_status),
    status: String(row.status) as DecisionReceiptStatus,
    createdAt: new Date(String(row.created_at)), updatedAt: new Date(String(row.updated_at)),
  };
  if (row.reason_code != null) record.reasonCode = String(row.reason_code);
  if (row.proof_metadata != null) record.proofMetadata = row.proof_metadata as Record<string, unknown>;
  return record;
}

export function createDecisionReceiptStore(pool: pg.Pool) {
  const insert = async (record: Omit<DecisionReceiptRecord, "status" | "createdAt" | "updatedAt">, status: DecisionReceiptStatus) => {
    const result = await pool.query(
      `INSERT INTO runtime_decision_receipts
         (id,application_id,decision_log_entry_hash,intent_hash,policy_hash,state_hash,decision,
          violated_rule_ids,reference_time,verifier_version,solver_status,status,reason_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13) RETURNING *`,
      [record.id, record.applicationId, record.decisionLogEntryHash, record.intentHash, record.policyHash,
        record.stateHash, record.decision, JSON.stringify(record.violatedRuleIds), record.referenceTime,
        record.verifierVersion, record.solverStatus, status, record.reasonCode ?? null],
    );
    return decisionReceiptFromRow(result.rows[0] as Record<string, unknown>);
  };
  return {
    create: (record: Omit<DecisionReceiptRecord, "status" | "createdAt" | "updatedAt">) => insert(record, "PENDING"),
    createNonProvable: (record: Omit<DecisionReceiptRecord, "status" | "createdAt" | "updatedAt">) => insert(record, "NON_PROVABLE"),
    async get(id: string) {
      const result = await pool.query("SELECT * FROM runtime_decision_receipts WHERE id=$1", [id]);
      return result.rows[0] ? decisionReceiptFromRow(result.rows[0] as Record<string, unknown>) : undefined;
    },
  };
}

export interface DecisionProofJob extends RuntimeProofJob {
  decisionReceiptId: string;
}

export function createDecisionProofJobQueue(pool: pg.Pool) {
  return {
    async getByDecisionReceipt(id: string): Promise<DecisionProofJob | undefined> {
      const result = await pool.query(
        "SELECT * FROM runtime_decision_proof_jobs WHERE decision_receipt_id=$1 ORDER BY created_at DESC LIMIT 1",
        [id],
      );
      const row = result.rows[0] as Record<string, unknown> | undefined;
      return row ? { ...proofJobFromRow(row), decisionReceiptId: String(row.decision_receipt_id) } : undefined;
    },
  };
}
