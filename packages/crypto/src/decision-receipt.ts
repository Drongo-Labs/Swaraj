import { keccak256, recoverAddress } from "viem";
import type { Hex } from "./types.js";
import { canonicalize, toCanonicalValue } from "./canonical.js";
import { deriveKeyId, type KeyRegistry } from "./keys.js";
import type { Signer } from "./signing.js";

/** Phase 9 attestation that a BLOCK decision was proved; the signature covers every field but itself. */
export type SignedDecisionReceipt = {
  id: string;
  status: "PROVED";
  decision: "BLOCK";
  violatedRuleIds: number[];
  intentHash: Hex;
  policyHash: Hex;
  stateHash: Hex;
  decisionLogEntryHash: Hex;
  referenceTime: number;
  verifierVersion: string;
  proof: Record<string, unknown>;
  zkVerify: Record<string, unknown>;
  /** Seconds since epoch; key validity is checked at this time. */
  signedAt: number;
  signerKeyId: Hex;
  signature: Hex;
};

export type UnsignedDecisionReceipt = Omit<SignedDecisionReceipt, "signature" | "signerKeyId">;

const encoder = new TextEncoder();
const DOMAIN = "swaraj.v1.DECISION_RECEIPT";

/** keccak256("swaraj.v1.DECISION_RECEIPT" || 0x00 || canonicalBytes(receipt without signature)). */
export function decisionReceiptDigest(value: Omit<SignedDecisionReceipt, "signature">): Hex {
  const body = canonicalize(toCanonicalValue(value));
  const tag = encoder.encode(DOMAIN);
  const bytes = new Uint8Array(tag.length + 1 + body.length);
  bytes.set(tag, 0);
  bytes[tag.length] = 0;
  bytes.set(body, tag.length + 1);
  return keccak256(bytes);
}

export async function signDecisionReceipt(value: UnsignedDecisionReceipt, signer: Signer): Promise<SignedDecisionReceipt> {
  if (value.status !== "PROVED" || value.decision !== "BLOCK") throw new Error("only PROVED BLOCK Decision Receipts are signed");
  if (!Number.isSafeInteger(value.signedAt) || value.signedAt < 0) throw new Error("invalid signedAt");
  const unsigned = { ...value, signerKeyId: deriveKeyId(signer.address) };
  const signature = await signer.signDigest(decisionReceiptDigest(unsigned));
  return { ...unsigned, signature };
}

/** Returns false (never throws) for a malformed, unknown-key, out-of-window or mismatched receipt. */
export async function verifyDecisionReceiptSignature(receipt: SignedDecisionReceipt, registry: KeyRegistry): Promise<boolean> {
  try {
    if (receipt.status !== "PROVED" || receipt.decision !== "BLOCK") return false;
    if (!Number.isSafeInteger(receipt.signedAt) || receipt.signedAt < 0) return false;
    const key = registry.get(receipt.signerKeyId);
    if (!key || !registry.isValidAt(receipt.signerKeyId, receipt.signedAt)) return false;
    const { signature, ...unsigned } = receipt;
    const recovered = await recoverAddress({ hash: decisionReceiptDigest(unsigned), signature });
    return recovered.toLowerCase() === key.address.toLowerCase();
  } catch {
    return false;
  }
}
