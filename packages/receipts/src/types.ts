import type { SignedReceipt } from "@swaraj/schemas";

export const ReasonCode = {
  EVIDENCE_MISSING: "EVIDENCE_MISSING",
  EVIDENCE_CONFLICT: "EVIDENCE_CONFLICT",
  FINALITY_PENDING: "FINALITY_PENDING",
  SOURCE_QUALITY: "SOURCE_QUALITY",
  SCHEMA: "SCHEMA",
  POLICY: "POLICY",
  PROOF: "PROOF",
} as const;
export type ReasonCode = (typeof ReasonCode)[keyof typeof ReasonCode];

export type ReceiptRecord = {
  applicationId: string;
  receiptId: string;
  actionId: string;
  status: SignedReceipt["status"];
  claimType: SignedReceipt["claimType"];
  reasonCode?: ReasonCode;
  intentHash: string;
  policyHash: string;
  evidenceRoot: string;
  proofReference?: string;
  signedReceipt: SignedReceipt;
  createdAt: number;
  updatedAt: number;
  /** Stored intent blob; unified-action receipts carry { format, action, actionHash }. */
  intentJson?: Record<string, unknown>;
};

export type CreateReceiptInput = {
  applicationId: string;
  receiptId: string;
  actionId: string;
  signedReceipt: SignedReceipt;
  reasonCode?: ReasonCode;
  /** Opaque intent blob stored with the stub action row (Postgres). */
  intentJson?: Record<string, unknown>;
  accountRef?: string;
  policyId?: string;
  policyVersion?: number;
  idempotencyKey?: string;
};
