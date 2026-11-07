import type { CanonicalValue } from "./types.js";

const MAX_DEPTH = 64;
const encoder = new TextEncoder();

function compareCodePoints(a: string, b: string): number {
  // UTF-8 byte order is exactly code point order.
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (x[i] !== y[i]) return (x[i] as number) - (y[i] as number);
  }
  return x.length - y.length;
}

function fail(path: string, why: string): never {
  throw new Error(`cannot canonicalize ${path || "(root)"}: ${why}`);
}

function serialize(value: unknown, path: string, depth: number): string {
  if (depth > MAX_DEPTH) fail(path, "nesting too deep");
  switch (typeof value) {
    case "string":
      if (!value.isWellFormed()) fail(path, "string has a lone surrogate");
      return JSON.stringify(value);
    case "number":
      if (!Number.isSafeInteger(value) || Object.is(value, -0)) fail(path, "numbers must be safe integers (use a decimal string for large amounts)");
      return String(value);
    case "boolean":
      return value ? "true" : "false";
    case "object":
      break;
    default:
      return fail(path, `${typeof value} is not allowed`);
  }
  if (value === null) return fail(path, "null is not allowed (omit the field)");
  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (let i = 0; i < value.length; i++) {
      if (!(i in value)) fail(`${path}[${i}]`, "sparse array");
      parts.push(serialize(value[i], `${path}[${i}]`, depth + 1));
    }
    return `[${parts.join(",")}]`;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) fail(path, "only plain objects are allowed (no class instances, Map, Date)");
  if (Object.getOwnPropertySymbols(value).length > 0) fail(path, "symbol keys are not allowed");
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort(compareCodePoints);
  const parts = keys.map((key) => {
    if (!key.isWellFormed()) fail(path, "key has a lone surrogate");
    const descriptor = Object.getOwnPropertyDescriptor(record, key);
    if (!descriptor || !("value" in descriptor)) fail(`${path}.${key}`, "accessor properties are not allowed");
    return `${JSON.stringify(key)}:${serialize(record[key], `${path}.${key}`, depth + 1)}`;
  });
  return `{${parts.join(",")}}`;
}

/**
 * UTF-8 JSON, keys sorted by code point, no whitespace, JSON.stringify escaping.
 * Throws on floats, NaN/Infinity, undefined, null, bigint, unsafe integers and non-plain objects.
 */
export function canonicalize(value: CanonicalValue): Uint8Array {
  return encoder.encode(serialize(value, "", 0));
}

/** Converts `bigint` to a decimal string, recursively. Everything else passes through for `canonicalize` to validate. */
export function toCanonicalValue(value: unknown): CanonicalValue {
  if (typeof value === "bigint") return value.toString(10);
  if (Array.isArray(value)) return value.map(toCanonicalValue);
  if (typeof value === "object" && value !== null) {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return value as CanonicalValue;
    const out: Record<string, CanonicalValue> = {};
    for (const [key, entry] of Object.entries(value)) {
      Object.defineProperty(out, key, { value: toCanonicalValue(entry), enumerable: true, writable: true, configurable: true });
    }
    return out;
  }
  return value as CanonicalValue;
}
