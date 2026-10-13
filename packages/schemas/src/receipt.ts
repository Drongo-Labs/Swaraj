import { z } from "zod";
import { BoundedId, FinalityRule, HexHash, SemVer, SignatureHex, UnixSeconds, parseWith } from "./primitives.js";

export const ReceiptStatus = z.enum(["PENDING", "PROVED", "NON_PROVABLE", "INVALIDATED", "DEV_UNVERIFIED"]);
export const ClaimType = z.enum(["ORDER_PLACED", "TRADE_EXECUTED"]);
export const ProofMetadataSchema = z.strictObject({
  proofSystem: z.enum(["SP1"]),
  proofHash: HexHash,
  programVkeyHash: HexHash,
  publicInputsHash: HexHash,
});

const unsignedShape = {
  receiptId: BoundedId,
  status: ReceiptStatus,
  claimType: ClaimType,
  /** Other objects are referenced by hash only, never embedded. */
  intentHash: HexHash,
  policyHash: HexHash,
  evidenceRoot: HexHash,
  finalityRule: FinalityRule,
  verifierVersion: SemVer,
  /** Required for PROVED, forbidden otherwise. */
  proof: ProofMetadataSchema.optional(),
  createdAt: UnixSeconds,
};
type ProofRule = { status: z.infer<typeof ReceiptStatus>; proof?: unknown };
const proofRule = (receipt: ProofRule, ctx: z.RefinementCtx) => {
  if (receipt.status === "PROVED" && receipt.proof === undefined) {
    ctx.addIssue({ code: "custom", path: ["proof"], message: "PROVED receipts require proof metadata" });
  }
  if (receipt.status !== "PROVED" && receipt.proof !== undefined) {
    ctx.addIssue({ code: "custom", path: ["proof"], message: "only PROVED receipts carry proof metadata" });
  }
};

/** The receipt as hashed and signed, before a signer is attached. */
export const ReceiptUnsignedSchema = z.strictObject(unsignedShape).superRefine(proofRule);
/** `signerKeyId` is part of the signed content; `signature` covers hashObject(RECEIPT, everything else). */
export const SignedReceiptSchema = z
  .strictObject({ ...unsignedShape, signerKeyId: HexHash, signature: SignatureHex })
  .superRefine(proofRule);

export type ReceiptUnsigned = z.infer<typeof ReceiptUnsignedSchema>;
export type SignedReceipt = z.infer<typeof SignedReceiptSchema>;
export const parseReceiptUnsigned = (input: unknown): ReceiptUnsigned => parseWith(ReceiptUnsignedSchema, input, "ReceiptUnsigned");
export const parseSignedReceipt = (input: unknown): SignedReceipt => parseWith(SignedReceiptSchema, input, "SignedReceipt");
