import { z } from "zod";
import { Address, AtomicAmount, HexHash, SafeUint, UnixSeconds, requireStrictlyAscending, parseWith } from "./primitives.js";

export const PolicyStatus = z.enum(["ACTIVE", "PAUSED", "EXPIRED"]);

export const BalanceEntrySchema = z.strictObject({ asset: Address, amount: AtomicAmount });

export const StateSnapshotSchema = z
  .strictObject({
    /** Sorted ascending by `asset`, one entry per asset. */
    balances: z.array(BalanceEntrySchema).max(256),
    reservedBudget: AtomicAmount,
    usedDailyTurnover: AtomicAmount,
    /** Omitted when no action has happened yet. */
    lastActionTime: UnixSeconds.optional(),
    policyStatus: PolicyStatus,
    /** Age in seconds of the newest quote/state input at `timestamp`. */
    freshnessSeconds: SafeUint,
    timestamp: UnixSeconds,
    /** Excluded from its own hash. */
    stateHash: HexHash.optional(),
  })
  .superRefine((state, ctx) =>
    requireStrictlyAscending(state.balances.map((entry) => entry.asset), ctx, ["balances"], "balances (one entry per asset, by asset)"),
  );

export type StateSnapshot = z.infer<typeof StateSnapshotSchema>;
export type StateSnapshotJson = z.input<typeof StateSnapshotSchema>;
export const parseStateSnapshot = (input: unknown): StateSnapshot => parseWith(StateSnapshotSchema, input, "StateSnapshot");
