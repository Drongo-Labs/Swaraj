import { signReceipt, type Signer } from "@swaraj/crypto";
import { parseSignedReceipt, type SignedReceipt } from "@swaraj/schemas";
import { assertTransition, IllegalTransitionError } from "./lifecycle.js";
import type { ReasonCode, ReceiptRecord } from "./types.js";
import type { ReceiptStore } from "./store.js";

export type CreatePendingParams = {
  applicationId: string;
  receiptId: string;
  actionId: string;
  intentHash: string;
  policyHash: string;
  evidenceRoot: string;
  claimType: SignedReceipt["claimType"];
  finalityRule: SignedReceipt["finalityRule"];
  verifierVersion: string;
  createdAt: number;
  signer: Signer;
  reasonCode?: ReasonCode;
  accountRef?: string;
  policyId?: string;
  policyVersion?: number;
  idempotencyKey?: string;
  intentJson?: Record<string, unknown>;
};

export type ProofMetadata = NonNullable<SignedReceipt["proof"]>;

export type ReceiptEngine = {
  createPendingReceipt(params: CreatePendingParams): Promise<ReceiptRecord>;
  markNonProvable(applicationId: string, receiptId: string, reasonCode: ReasonCode, signer: Signer): Promise<ReceiptRecord>;
  markDevUnverified(applicationId: string, receiptId: string, signer: Signer): Promise<ReceiptRecord>;
  /** PENDING → PROVED only with complete SP1 proof metadata. */
  markProved(
    applicationId: string,
    receiptId: string,
    proof: ProofMetadata,
    proofReference: string,
    signer: Signer,
  ): Promise<ReceiptRecord>;
  getReceipt(applicationId: string, receiptId: string): Promise<ReceiptRecord | undefined>;
};

async function resign(
  existing: SignedReceipt,
  status: SignedReceipt["status"],
  signer: Signer,
  proof?: ProofMetadata,
): Promise<SignedReceipt> {
  const { signature: _s, signerKeyId: _k, proof: _p, ...rest } = existing;
  if (status === "PROVED") {
    if (proof === undefined) throw new Error("PROVED requires proof metadata");
    return signReceipt({ ...rest, status, proof }, signer);
  }
  return signReceipt({ ...rest, status }, signer);
}

export function createReceiptEngine(store: ReceiptStore): ReceiptEngine {
  return {
    async createPendingReceipt(params) {
      const unsigned = {
        receiptId: params.receiptId,
        status: "PENDING" as const,
        claimType: params.claimType,
        intentHash: params.intentHash,
        policyHash: params.policyHash,
        evidenceRoot: params.evidenceRoot,
        finalityRule: params.finalityRule,
        verifierVersion: params.verifierVersion,
        createdAt: params.createdAt,
      };
      const signedReceipt = await signReceipt(unsigned, params.signer);
      return store.create({
        applicationId: params.applicationId,
        receiptId: params.receiptId,
        actionId: params.actionId,
        signedReceipt,
        ...(params.reasonCode !== undefined ? { reasonCode: params.reasonCode } : {}),
        ...(params.accountRef !== undefined ? { accountRef: params.accountRef } : {}),
        ...(params.policyId !== undefined ? { policyId: params.policyId } : {}),
        ...(params.policyVersion !== undefined ? { policyVersion: params.policyVersion } : {}),
        ...(params.idempotencyKey !== undefined ? { idempotencyKey: params.idempotencyKey } : {}),
        ...(params.intentJson !== undefined ? { intentJson: params.intentJson } : {}),
      });
    },

    async markNonProvable(applicationId, receiptId, reasonCode, signer) {
      const existing = await store.get(applicationId, receiptId);
      if (!existing) throw new Error("receipt not found");
      assertTransition(existing.status, "NON_PROVABLE");
      const signedReceipt = parseSignedReceipt(await resign(existing.signedReceipt, "NON_PROVABLE", signer));
      return store.updateStatus({
        applicationId,
        receiptId,
        status: "NON_PROVABLE",
        signedReceipt,
        reasonCode,
      });
    },

    async markDevUnverified(applicationId, receiptId, signer) {
      const existing = await store.get(applicationId, receiptId);
      if (!existing) throw new Error("receipt not found");
      assertTransition(existing.status, "DEV_UNVERIFIED");
      const signedReceipt = parseSignedReceipt(await resign(existing.signedReceipt, "DEV_UNVERIFIED", signer));
      return store.updateStatus({
        applicationId,
        receiptId,
        status: "DEV_UNVERIFIED",
        signedReceipt,
      });
    },

    async markProved(applicationId, receiptId, proof, proofReference, signer) {
      if (!proofReference.trim()) throw new Error("proof reference is required");
      const existing = await store.get(applicationId, receiptId);
      if (!existing) throw new Error("receipt not found");
      if (existing.status !== "PENDING") {
        throw new IllegalTransitionError(existing.status, "PROVED");
      }
      assertTransition(existing.status, "PROVED");
      if (proof.proofSystem !== "SP1") throw new Error("unsupported proof system");
      const signedReceipt = parseSignedReceipt(await resign(existing.signedReceipt, "PROVED", signer, proof));
      return store.updateStatus({
        applicationId,
        receiptId,
        status: "PROVED",
        signedReceipt,
        proofReference,
      });
    },

    async getReceipt(applicationId, receiptId) {
      return store.get(applicationId, receiptId);
    },
  };
}
