import { keccak256 } from "viem";
import type { Hex } from "./types.js";

const encoder = new TextEncoder();

/** keyId = keccak256("swaraj.v1.KEY_ID" || 0x00 || address bytes). Derived, so it cannot be chosen independently of the key. */
export function deriveKeyId(address: string): Hex {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) throw new Error("invalid address");
  const tag = encoder.encode("swaraj.v1.KEY_ID");
  const bytes = new Uint8Array(tag.length + 1 + 20);
  bytes.set(tag, 0);
  for (let i = 0; i < 20; i++) bytes[tag.length + 1 + i] = parseInt(address.slice(2 + 2 * i, 4 + 2 * i), 16);
  return keccak256(bytes);
}

export interface KeyEntry {
  keyId: Hex;
  /** Lowercase address. */
  address: Hex;
  /** Inclusive, seconds since epoch. */
  validFrom: number;
  /** Exclusive. Omitted while the key is current. */
  validUntil?: number;
  /** Receipts stamped at or after this are invalid. Omitted unless revoked. */
  revokedAt?: number;
}

const isTime = (n: unknown): n is number => typeof n === "number" && Number.isSafeInteger(n) && n >= 0;

export class KeyRegistry {
  readonly #keys = new Map<string, KeyEntry>();

  constructor(entries: readonly KeyEntry[] = []) {
    for (const entry of entries) this.add(entry);
  }

  add(entry: KeyEntry): void {
    const address = entry.address.toLowerCase() as Hex;
    if (deriveKeyId(address) !== entry.keyId) throw new Error("keyId does not match address");
    if (this.#keys.has(entry.keyId)) throw new Error("key already registered");
    if (!isTime(entry.validFrom)) throw new Error("invalid validFrom");
    if (entry.validUntil !== undefined && (!isTime(entry.validUntil) || entry.validUntil <= entry.validFrom)) throw new Error("invalid validUntil");
    if (entry.revokedAt !== undefined && !isTime(entry.revokedAt)) throw new Error("invalid revokedAt");
    this.#keys.set(entry.keyId, { ...entry, address });
  }

  /** Ends a key's validity window (normal rotation). Can only be set once. */
  retire(keyId: Hex, validUntil: number): void {
    const key = this.#require(keyId);
    if (key.validUntil !== undefined) throw new Error("key already retired");
    if (!isTime(validUntil) || validUntil <= key.validFrom) throw new Error("invalid validUntil");
    key.validUntil = validUntil;
  }

  /** Marks a key compromised from `revokedAt` on. Can only be set once. */
  revoke(keyId: Hex, revokedAt: number): void {
    const key = this.#require(keyId);
    if (key.revokedAt !== undefined) throw new Error("key already revoked");
    if (!isTime(revokedAt)) throw new Error("invalid revokedAt");
    key.revokedAt = revokedAt;
  }

  get(keyId: string): KeyEntry | undefined {
    const key = this.#keys.get(keyId);
    return key && { ...key };
  }

  entries(): KeyEntry[] {
    return [...this.#keys.values()].map((key) => ({ ...key }));
  }

  /** True if `keyId` is known and `at` is inside its window and before any revocation. */
  isValidAt(keyId: string, at: number): boolean {
    const key = this.#keys.get(keyId);
    if (!key) return false;
    if (at < key.validFrom) return false;
    if (key.validUntil !== undefined && at >= key.validUntil) return false;
    if (key.revokedAt !== undefined && at >= key.revokedAt) return false;
    return true;
  }

  #require(keyId: Hex): KeyEntry {
    const key = this.#keys.get(keyId);
    if (!key) throw new Error("unknown key");
    return key;
  }
}
