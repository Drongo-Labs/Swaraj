import { z } from "zod";

const UINT256_MAX = (1n << 256n) - 1n;

/** Lowercase `0x` + 64 hex chars. */
export const HexHash = z.string().regex(/^0x[0-9a-f]{64}$/);
/** Lowercase `0x` + 40 hex chars. Checksummed (mixed-case) addresses are rejected. */
export const Address = z.string().regex(/^0x[0-9a-f]{40}$/);
/** 65-byte secp256k1 signature (r || s || v) as lowercase hex. */
export const SignatureHex = z.string().regex(/^0x[0-9a-f]{130}$/);
/** Decimal string, no leading zeros, at most uint256. Parsed to `bigint`. */
export const AtomicAmount = z
  .string()
  .max(78)
  .regex(/^(0|[1-9][0-9]*)$/)
  // zod runs every check even after one fails, so guard the BigInt conversion.
  .refine((value) => /^(0|[1-9][0-9]*)$/.test(value) && BigInt(value) <= UINT256_MAX, "exceeds uint256")
  .transform((value) => BigInt(value));
/** Integer seconds since epoch. */
export const UnixSeconds = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
/** Integer milliseconds since epoch, used by the unified action wire format. */
export const UnixMilliseconds = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
/** Non-negative integer that fits a JSON number safely (counts, seconds, versions). */
export const SafeUint = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const Bps = z.number().int().min(0).max(10_000);
export const BoundedId = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
export const IdempotencyKey = z.string().regex(/^[a-zA-Z0-9_-]{1,128}$/);
export const SemVer = z.string().max(32).regex(/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/);

/** Append only — never renumber or remove. Base MVP + NEAR Phase 2 venues. */
export const Venue = z.enum(["UNISWAP_V3_BASE", "REF_FINANCE_NEAR"]);
/** Append only. */
export const FinalityRule = z.enum(["BASE_CONFIRMATIONS_12", "NEAR_FINALITY"]);

/** Order used for every sorted-set field: plain code point order on ASCII strings. */
export const compareStrings = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** Adds an issue unless `values` is strictly ascending (which also means no duplicates). */
export function requireStrictlyAscending(values: readonly string[], ctx: z.RefinementCtx, path: (string | number)[], what: string): void {
  for (let i = 1; i < values.length; i++) {
    if (compareStrings(values[i - 1] as string, values[i] as string) >= 0) {
      ctx.addIssue({ code: "custom", path: [...path, i], message: `${what} must be sorted ascending with no duplicates` });
      return;
    }
  }
}

/** Parse with an error that lists only field paths and rule messages, never the rejected values. */
export function parseWith<S extends z.ZodType>(schema: S, input: unknown, name: string): z.output<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const problems = result.error.issues.slice(0, 10).map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`);
  throw new Error(`invalid ${name}: ${problems.join("; ")}`);
}
