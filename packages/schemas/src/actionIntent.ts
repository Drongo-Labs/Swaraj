import { z } from "zod";
import { Address, AtomicAmount, Bps, HexHash, IdempotencyKey, BoundedId, SafeUint, UnixSeconds, Venue, parseWith } from "./primitives.js";

export const ActionType = z.enum(["SPOT_TRADE"]);

export const ActionIntentSchema = z
  .strictObject({
    intentId: BoundedId,
    actionType: ActionType,
    venue: Venue,
    /** Opaque commitment to the account, never a raw account identifier. */
    accountRef: HexHash,
    assetIn: Address,
    assetOut: Address,
    /** Amount of `assetIn` in atomic units. */
    amount: AtomicAmount,
    maxSlippageBps: Bps,
    /** Integer limit price: atomic `assetOut` per 1e18 atomic `assetIn`. */
    limitPrice: AtomicAmount,
    expiry: UnixSeconds,
    idempotencyKey: IdempotencyKey,
    policyVersion: SafeUint,
    /** Excluded from its own hash. */
    intentHash: HexHash.optional(),
  })
  .refine((intent) => intent.assetIn !== intent.assetOut, { path: ["assetOut"], message: "assetIn and assetOut must differ" });

export type ActionIntent = z.infer<typeof ActionIntentSchema>;
export type ActionIntentJson = z.input<typeof ActionIntentSchema>;
export const parseActionIntent = (input: unknown): ActionIntent => parseWith(ActionIntentSchema, input, "ActionIntent");
