import type { CreateReceiptInput, ReceiptRecord } from "./types.js";
import { type ReceiptStore, recordFromCreate } from "./store.js";

/** In-memory store for tests and mock pipeline without Postgres. Idempotent on (applicationId, receiptId). */
export function createMemoryReceiptStore(): ReceiptStore {
  const rows = new Map<string, ReceiptRecord>();
  const key = (applicationId: string, receiptId: string) => `${applicationId}\0${receiptId}`;

  return {
    async create(input: CreateReceiptInput) {
      const existing = rows.get(key(input.applicationId, input.receiptId));
      if (existing) {
        if (existing.intentHash !== input.signedReceipt.intentHash) {
          throw new Error("idempotency conflict: receipt exists with different intentHash");
        }
        return existing;
      }
      const record = recordFromCreate(input);
      rows.set(key(input.applicationId, input.receiptId), record);
      return record;
    },

    async get(applicationId, receiptId) {
      return rows.get(key(applicationId, receiptId));
    },

    async updateStatus(params) {
      const existing = rows.get(key(params.applicationId, params.receiptId));
      if (!existing) throw new Error("receipt not found");
      const now = Math.floor(Date.now() / 1000);
      const next: ReceiptRecord = {
        ...existing,
        status: params.status,
        signedReceipt: params.signedReceipt,
        updatedAt: now,
      };
      if (params.reasonCode !== undefined) next.reasonCode = params.reasonCode;
      else delete next.reasonCode;
      if (params.proofReference !== undefined) next.proofReference = params.proofReference;
      rows.set(key(params.applicationId, params.receiptId), next);
      return next;
    },
  };
}
