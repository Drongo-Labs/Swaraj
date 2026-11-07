import { z } from "zod";
import { Address, AtomicAmount, Bps, FinalityRule, HexHash, SafeUint, UnixSeconds, Venue, compareStrings, requireStrictlyAscending, parseWith } from "./primitives.js";

/**
 * Typed trade limits behind a mandate. The `POLICY_PROFILE` hash domain is pinned by the guest ELF
 * and golden vectors, so it must not change.
 */

export const MandatePolicySchema = z
  .strictObject({
    policyVersion: SafeUint,
    /** Set: sorted ascending, no duplicates. */
    allowedVenues: z.array(Venue).min(1).max(16),
    /** Set: sorted ascending, no duplicates. */
    allowedAssets: z.array(Address).min(1).max(256),
    maxAmountPerAction: AtomicAmount,
    positionCap: AtomicAmount,
    dailyTurnoverCap: AtomicAmount,
    maxSlippageBps: Bps,
    reserveRequirement: AtomicAmount,
    quoteFreshnessSeconds: SafeUint,
    cooldownSeconds: SafeUint,
    finalityRule: FinalityRule,
    policyExpiry: UnixSeconds,
    paused: z.boolean(),
    /** Excluded from its own hash. */
    policyHash: HexHash.optional(),
  })
  .superRefine((policy, ctx) => {
    requireStrictlyAscending(policy.allowedVenues, ctx, ["allowedVenues"], "allowedVenues");
    requireStrictlyAscending(policy.allowedAssets, ctx, ["allowedAssets"], "allowedAssets");
  });

export type MandatePolicy = z.infer<typeof MandatePolicySchema>;
export type MandatePolicyJson = z.input<typeof MandatePolicySchema>;
export const parseMandatePolicy = (input: unknown): MandatePolicy => parseWith(MandatePolicySchema, input, "MandatePolicy");

/** Sorts and de-duplicates the set fields of a raw policy so it canonicalizes uniquely. Run before parsing. */
export function normalizeMandatePolicy<T extends { allowedVenues: string[]; allowedAssets: string[] }>(raw: T): T {
  const set = (values: string[]) => [...new Set(values)].sort(compareStrings);
  return { ...raw, allowedVenues: set(raw.allowedVenues), allowedAssets: set(raw.allowedAssets) };
}
