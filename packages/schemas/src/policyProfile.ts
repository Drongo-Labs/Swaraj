import { z } from "zod";
import { Address, AtomicAmount, Bps, FinalityRule, HexHash, SafeUint, UnixSeconds, Venue, compareStrings, requireStrictlyAscending, parseWith } from "./primitives.js";

export const PolicyProfileSchema = z
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

export type PolicyProfile = z.infer<typeof PolicyProfileSchema>;
export type PolicyProfileJson = z.input<typeof PolicyProfileSchema>;
export const parsePolicyProfile = (input: unknown): PolicyProfile => parseWith(PolicyProfileSchema, input, "PolicyProfile");

/** Sorts and de-duplicates the set fields of a raw policy so it canonicalizes uniquely. Run before parsing. */
export function normalizePolicyProfile<T extends { allowedVenues: string[]; allowedAssets: string[] }>(raw: T): T {
  const set = (values: string[]) => [...new Set(values)].sort(compareStrings);
  return { ...raw, allowedVenues: set(raw.allowedVenues), allowedAssets: set(raw.allowedAssets) };
}
