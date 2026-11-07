import type { PoolHandle } from "./pool.js";

export type ReceiptState = "PENDING" | "PROVED" | "NON_PROVABLE" | "INVALIDATED";

export interface ReceiptRow {
  receiptId: string;
  appId: string;
  intentDigest: string;
  decisionId: number;
  claim: unknown;
  state: ReceiptState;
  proofRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptEvent {
  seq: number;
  fromState: ReceiptState | null;
  toState: ReceiptState;
  note: string | null;
  recordedAt: string;
}

export class IllegalReceiptTransition extends Error {
  constructor(
    public readonly receiptId: string,
    public readonly attempted: string,
    public readonly current: string,
  ) {
    super(`receipt ${receiptId}: cannot move ${current} -> ${attempted}`);
    this.name = "IllegalReceiptTransition";
  }
}

interface RawReceiptRow {
  receipt_id: string;
  app_id: string;
  intent_digest: string;
  decision_id: string | number;
  claim: unknown;
  state: ReceiptState;
  proof_ref: string | null;
  created_at: Date;
  updated_at: Date;
}

function toReceiptRow(row: RawReceiptRow): ReceiptRow {
  return {
    receiptId: row.receipt_id,
    appId: row.app_id,
    intentDigest: row.intent_digest,
    decisionId: Number(row.decision_id),
    claim: row.claim,
    state: row.state,
    proofRef: row.proof_ref,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

const RECEIPT_COLUMNS =
  "receipt_id, app_id, intent_digest, decision_id, claim, state, proof_ref, created_at, updated_at";

export async function insertReceipt(
  handle: PoolHandle,
  receipt: { receiptId: string; appId: string; intentDigest: string; decisionId: number; claim: unknown },
): Promise<ReceiptRow> {
  const result = await handle.raw.query<RawReceiptRow>(
    `INSERT INTO receipts (receipt_id, app_id, intent_digest, decision_id, claim)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     RETURNING ${RECEIPT_COLUMNS}`,
    [receipt.receiptId, receipt.appId, receipt.intentDigest, receipt.decisionId, JSON.stringify(receipt.claim)],
  );
  return toReceiptRow(result.rows[0]!);
}

export async function findReceipt(
  handle: PoolHandle,
  receiptId: string,
): Promise<ReceiptRow | undefined> {
  const result = await handle.raw.query<RawReceiptRow>(
    `SELECT ${RECEIPT_COLUMNS} FROM receipts WHERE receipt_id = $1`,
    [receiptId],
  );
  const row = result.rows[0];
  return row ? toReceiptRow(row) : undefined;
}

export async function findReceiptByIdempotencyKey(
  handle: PoolHandle,
  appId: string,
  idemKey: string,
): Promise<ReceiptRow | undefined> {
  const result = await handle.raw.query<RawReceiptRow>(
    `SELECT r.${RECEIPT_COLUMNS.replaceAll(", ", ", r.")}
     FROM receipts r
     JOIN idempotency_claims c ON c.receipt_id = r.receipt_id
     WHERE c.app_id = $1 AND c.idem_key = $2`,
    [appId, idemKey],
  );
  const row = result.rows[0];
  return row ? toReceiptRow(row) : undefined;
}

export async function claimIdempotencyKey(
  handle: PoolHandle,
  entry: { appId: string; idemKey: string; intentDigest: string; receiptId: string },
): Promise<boolean> {
  const result = await handle.raw.query(
    `INSERT INTO idempotency_claims (app_id, idem_key, intent_digest, receipt_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (app_id, idem_key) DO NOTHING`,
    [entry.appId, entry.idemKey, entry.intentDigest, entry.receiptId],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listReceiptEvents(
  handle: PoolHandle,
  receiptId: string,
): Promise<ReceiptEvent[]> {
  const result = await handle.raw.query<{
    seq: string | number;
    from_state: ReceiptState | null;
    to_state: ReceiptState;
    note: string | null;
    recorded_at: Date;
  }>(
    `SELECT seq, from_state, to_state, note, recorded_at
     FROM receipt_events WHERE receipt_id = $1 ORDER BY seq`,
    [receiptId],
  );
  return result.rows.map((row) => ({
    seq: Number(row.seq),
    fromState: row.from_state,
    toState: row.to_state,
    note: row.note,
    recordedAt: new Date(row.recorded_at).toISOString(),
  }));
}

/** Advances a receipt and logs the event in one transaction. The trigger rejects illegal moves (P0004). */
export async function advanceReceipt(
  handle: PoolHandle,
  receiptId: string,
  next: ReceiptState,
  options: { note?: string; proofRef?: string } = {},
): Promise<ReceiptRow> {
  try {
    const client = await handle.raw.connect();
    let result: ReceiptRow;
    try {
      await client.query("BEGIN");
      try {
        const prior = await client.query<{ state: ReceiptState }>(
          "SELECT state FROM receipts WHERE receipt_id = $1 FOR UPDATE",
          [receiptId],
        );
        if (!prior.rows[0]) throw new Error(`receipt ${receiptId} not found`);

        const updated = await client.query<RawReceiptRow>(
          `UPDATE receipts
             SET state = $2,
                 proof_ref = COALESCE($3, proof_ref)
           WHERE receipt_id = $1
           RETURNING ${RECEIPT_COLUMNS}`,
          [receiptId, next, options.proofRef ?? null],
        );
        await client.query(
          `INSERT INTO receipt_events (receipt_id, from_state, to_state, note)
           VALUES ($1, $2, $3, $4)`,
          [receiptId, prior.rows[0].state, next, options.note ?? null],
        );
        await client.query("COMMIT");
        result = toReceiptRow(updated.rows[0]!);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    } finally {
      client.release();
    }
    return result;
  } catch (err) {
    if (isIllegalTransitionError(err)) {
      const current = (await findReceipt(handle, receiptId))?.state ?? "unknown";
      throw new IllegalReceiptTransition(receiptId, next, current);
    }
    throw err;
  }
}

function isIllegalTransitionError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P0004";
}
