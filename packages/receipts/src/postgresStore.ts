import type { Pool } from "pg";
import { parseSignedReceipt } from "@swaraj/schemas";
import type { CreateReceiptInput, ReceiptRecord, ReasonCode } from "./types.js";
import { type ReceiptStore, recordFromCreate } from "./store.js";

function rowToRecord(row: Record<string, unknown>): ReceiptRecord {
  const signed = parseSignedReceipt(row.signed_receipt);
  const record: ReceiptRecord = {
    applicationId: String(row.application_id),
    receiptId: String(row.id),
    actionId: String(row.action_id),
    status: signed.status,
    claimType: signed.claimType,
    intentHash: String(row.intent_hash),
    policyHash: String(row.policy_hash),
    evidenceRoot: String(row.evidence_root),
    signedReceipt: signed,
    createdAt: Math.floor(new Date(String(row.created_at)).getTime() / 1000),
    updatedAt: Math.floor(new Date(String(row.updated_at)).getTime() / 1000),
  };
  if (row.reason_code != null) record.reasonCode = String(row.reason_code) as ReasonCode;
  if (row.proof_reference != null) record.proofReference = String(row.proof_reference);
  if (row.intent_json != null && typeof row.intent_json === "object") {
    record.intentJson = row.intent_json as Record<string, unknown>;
  }
  return record;
}

/**
 * Postgres-backed receipt store. Ensures stub application/policy/action rows exist so the
 * receipts FK can be satisfied without a full Phase 5 capability path.
 */
export function createPostgresReceiptStore(pool: Pool): ReceiptStore {
  return {
    async create(input: CreateReceiptInput) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const existing = await client.query(
          `SELECT * FROM runtime_receipts WHERE application_id = $1 AND id = $2`,
          [input.applicationId, input.receiptId],
        );
        if (existing.rows[0]) {
          const record = rowToRecord(existing.rows[0] as Record<string, unknown>);
          if (record.intentHash !== input.signedReceipt.intentHash) {
            throw new Error("idempotency conflict: receipt exists with different intentHash");
          }
          await client.query("COMMIT");
          return record;
        }

        const policyId = input.policyId ?? "policy_stub";
        const policyVersion = input.policyVersion ?? 1;
        const accountRef = input.accountRef ?? "0x" + "00".repeat(32);
        const idempotencyKey = input.idempotencyKey ?? input.receiptId;
        const intentJson = input.intentJson ?? {};

        await client.query(
          `INSERT INTO runtime_applications (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
          [input.applicationId, input.applicationId],
        );
        await client.query(
          `INSERT INTO runtime_policies (application_id, id, version, action_type, status, definition, policy_hash)
           VALUES ($1, $2, $3, 'SPOT_TRADE', 'ACTIVE', '{}'::jsonb, $4)
           ON CONFLICT (application_id, id, version) DO NOTHING`,
          [input.applicationId, policyId, policyVersion, input.signedReceipt.policyHash],
        );
        await client.query(
          `INSERT INTO runtime_actions (application_id, id, account_ref, policy_id, policy_version, idempotency_key, intent_hash, intent)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
           ON CONFLICT (application_id, id) DO NOTHING`,
          [
            input.applicationId,
            input.actionId,
            accountRef,
            policyId,
            policyVersion,
            idempotencyKey,
            input.signedReceipt.intentHash,
            JSON.stringify(intentJson),
          ],
        );

        const record = recordFromCreate(input);
        await client.query(
          `INSERT INTO runtime_receipts (
             application_id, id, action_id, status, claim_type, reason_code,
             intent_hash, policy_hash, evidence_root, proof_reference, signed_receipt
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb)`,
          [
            record.applicationId,
            record.receiptId,
            record.actionId,
            record.status,
            record.claimType,
            record.reasonCode ?? null,
            record.intentHash,
            record.policyHash,
            record.evidenceRoot,
            record.proofReference ?? null,
            JSON.stringify(record.signedReceipt),
          ],
        );
        await client.query(
          `INSERT INTO runtime_receipt_jobs (application_id, receipt_id, state)
           VALUES ($1, $2, 'PENDING')
           ON CONFLICT (application_id, receipt_id) DO NOTHING`,
          [record.applicationId, record.receiptId],
        );
        await client.query("COMMIT");
        return record;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async get(applicationId, receiptId) {
      const result = await pool.query(
        `SELECT r.*, a.intent AS intent_json
         FROM runtime_receipts r
         LEFT JOIN runtime_actions a ON a.application_id = r.application_id AND a.id = r.action_id
         WHERE r.application_id = $1 AND r.id = $2`,
        [
          applicationId,
          receiptId,
        ],
      );
      const row = result.rows[0] as Record<string, unknown> | undefined;
      return row ? rowToRecord(row) : undefined;
    },

    async updateStatus(params) {
      const result = await pool.query(
        `UPDATE runtime_receipts SET
           status = $3,
           reason_code = $4,
           proof_reference = COALESCE($5, proof_reference),
           signed_receipt = $6::jsonb,
           updated_at = now()
         WHERE application_id = $1 AND id = $2
         RETURNING *`,
        [
          params.applicationId,
          params.receiptId,
          params.status,
          params.reasonCode ?? null,
          params.proofReference ?? null,
          JSON.stringify(params.signedReceipt),
        ],
      );
      const row = result.rows[0] as Record<string, unknown> | undefined;
      if (!row) throw new Error("receipt not found");
      return rowToRecord(row);
    },
  };
}
