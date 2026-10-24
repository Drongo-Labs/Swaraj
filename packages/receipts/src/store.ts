import type { CreateReceiptInput, ReceiptRecord, ReasonCode } from "./types.js";

export type ReceiptStore = {
  create(input: CreateReceiptInput): Promise<ReceiptRecord>;
  get(applicationId: string, receiptId: string): Promise<ReceiptRecord | undefined>;
  updateStatus(params: {
    applicationId: string;
    receiptId: string;
    status: ReceiptRecord["status"];
    signedReceipt: ReceiptRecord["signedReceipt"];
    reasonCode?: ReasonCode;
    proofReference?: string;
  }): Promise<ReceiptRecord>;
};

export function recordFromCreate(input: CreateReceiptInput, now = Math.floor(Date.now() / 1000)): ReceiptRecord {
  const signed = input.signedReceipt;
  const record: ReceiptRecord = {
    applicationId: input.applicationId,
    receiptId: input.receiptId,
    actionId: input.actionId,
    status: signed.status,
    claimType: signed.claimType,
    intentHash: signed.intentHash,
    policyHash: signed.policyHash,
    evidenceRoot: signed.evidenceRoot,
    signedReceipt: signed,
    createdAt: signed.createdAt,
    updatedAt: now,
  };
  if (input.reasonCode !== undefined) record.reasonCode = input.reasonCode;
  return record;
}
