import { keccak256 } from "viem";
import { ObjectType } from "@swaraj/schemas";
import { canonicalize, toCanonicalValue } from "./canonical.js";
import type { CanonicalValue, Hex } from "./types.js";

const encoder = new TextEncoder();
const OBJECT_TYPES: readonly string[] = Object.values(ObjectType);

/** Fields removed from an object before hashing it, because they contain (or depend on) its own hash. One table, one place. */
export const SELF_FIELDS: Readonly<Record<ObjectType, readonly string[]>> = {
  ACTION_INTENT: ["intentHash"],
  POLICY_PROFILE: ["policyHash"],
  STATE_SNAPSHOT: ["stateHash"],
  EVIDENCE_BUNDLE: ["evidenceRoot"],
  RECEIPT: ["signature", "receiptHash"],
};

function assertType(type: string): asserts type is ObjectType {
  if (!OBJECT_TYPES.includes(type)) throw new Error(`unknown object type: ${String(type)}`);
}

export function domainTag(type: ObjectType): string {
  assertType(type);
  return `swaraj.v1.${type}`;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/** Returns a copy of the top-level object without the fields that would reference its own hash. */
export function stripSelfFields(type: ObjectType, obj: unknown): CanonicalValue {
  assertType(type);
  const value = toCanonicalValue(obj);
  if (typeof value !== "object" || Array.isArray(value)) throw new Error(`${type} must be an object`);
  const omit = SELF_FIELDS[type];
  const out: Record<string, CanonicalValue> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!omit.includes(key)) Object.defineProperty(out, key, { value: entry, enumerable: true, writable: true, configurable: true });
  }
  return out;
}

/** keccak256( "swaraj.v1." + type || 0x00 || canonicalBytes(obj without self fields) ). `bigint`s are converted to decimal strings. */
export function hashObject(type: ObjectType, obj: unknown): Hex {
  const bytes = canonicalize(stripSelfFields(type, obj));
  return keccak256(concat(encoder.encode(domainTag(type)), new Uint8Array([0]), bytes));
}

export function verifyObjectHash(type: ObjectType, obj: unknown, claimedHash: string): boolean {
  try {
    return hashObject(type, obj) === claimedHash.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Order-defined commitment to a list, used for the evidence root. Every item is hashed with hashObject(type, item), then
 *   root = keccak256( "swaraj.v1." + type + ".list" || 0x00 || uint32_be(count) || leaf_1 || ... || leaf_n )
 * where each leaf is the raw 32-byte hash. Order matters; callers sort first (Evidence Bundle: by itemId).
 * The ".list" tag keeps this domain separate from hashObject for the same type.
 */
export function hashList(type: ObjectType, items: readonly unknown[]): Hex {
  const leaves = items.map((item) => hexBytes(hashObject(type, item)));
  const count = new Uint8Array(4);
  new DataView(count.buffer).setUint32(0, items.length, false);
  return keccak256(concat(encoder.encode(`${domainTag(type)}.list`), new Uint8Array([0]), count, ...leaves));
}

function hexBytes(hex: Hex): Uint8Array {
  const out = new Uint8Array((hex.length - 2) / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(2 + 2 * i, 4 + 2 * i), 16);
  return out;
}
