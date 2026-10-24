import { privateKeyToAccount } from "viem/accounts";
import { recoverAddress } from "viem";
import { ObjectType, ReceiptUnsignedSchema, SignedReceiptSchema, type ReceiptUnsigned, type SignedReceipt } from "@swaraj/schemas";
import { hashObject } from "./hash.js";
import { deriveKeyId, type KeyRegistry } from "./keys.js";
import type { Hex } from "./types.js";

/** Key source abstraction: a local key now, KMS/HSM later. */
export interface Signer {
  /** Lowercase address. */
  readonly address: Hex;
  /** Signs a 32-byte digest directly (no prefix). Returns 65-byte r||s||v hex. */
  signDigest(digest: Hex): Promise<Hex>;
}

export class LocalKeySigner implements Signer {
  readonly address: Hex;
  readonly #account: ReturnType<typeof privateKeyToAccount>;

  constructor(privateKey: string) {
    if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) throw new Error("invalid private key format");
    this.#account = privateKeyToAccount(privateKey as Hex);
    this.address = this.#account.address.toLowerCase() as Hex;
  }

  static fromEnv(env: Record<string, string | undefined> = process.env, name = "SWARAJ_SIGNER_PRIVATE_KEY"): LocalKeySigner {
    const key = env[name];
    if (!key) throw new Error(`${name} is not set`);
    return new LocalKeySigner(key);
  }

  async signDigest(digest: Hex): Promise<Hex> {
    return (await this.#account.sign({ hash: digest })).toLowerCase() as Hex;
  }

  // Keep the key out of logs, JSON and util.inspect.
  toJSON(): { address: Hex } {
    return { address: this.address };
  }
  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return `LocalKeySigner(${this.address})`;
  }
}

/** Digest that is signed: hashObject(RECEIPT, receipt minus `signature`). It covers `signerKeyId`. */
function receiptDigest(receipt: ReceiptUnsigned & { signerKeyId: string }): Hex {
  return hashObject(ObjectType.RECEIPT, receipt);
}

export async function signReceipt(receiptUnsigned: ReceiptUnsigned, signer: Signer): Promise<SignedReceipt> {
  const unsigned = ReceiptUnsignedSchema.parse(receiptUnsigned);
  const signerKeyId = deriveKeyId(signer.address);
  const signature = await signer.signDigest(receiptDigest({ ...unsigned, signerKeyId }));
  return SignedReceiptSchema.parse({ ...unsigned, signerKeyId, signature });
}

/** Returns false (never throws) for any malformed, unknown-key, out-of-window, revoked or mismatched receipt. */
export async function verifyReceiptSignature(signed: SignedReceipt, registry: KeyRegistry): Promise<boolean> {
  try {
    const parsed = SignedReceiptSchema.safeParse(signed);
    if (!parsed.success) return false;
    const receipt = parsed.data;
    const key = registry.get(receipt.signerKeyId);
    if (!key || !registry.isValidAt(receipt.signerKeyId, receipt.createdAt)) return false;
    const { signature, ...rest } = receipt;
    const recovered = await recoverAddress({ hash: receiptDigest(rest), signature: signature as Hex });
    return recovered.toLowerCase() === key.address;
  } catch {
    return false;
  }
}
