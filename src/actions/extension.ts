import { z } from "zod";

/**
 * Proposed extension of Swaraj's UnifiedActionType with Zunno game moves.
 *
 * Swaraj today (packages/schemas/src/unifiedAction.ts) ships SPOT_TRADE,
 * PAYMENT, DEPLOY, DELETE, REFUND, and its mandate predicate vocabulary is
 * scoped per action (fieldsByAction in agentMandate.ts). Game moves need two
 * new variants with typed resource/context pairs, plus matching mandate fields:
 *
 *   PLAY_CARD  resource: { game }            context: { handIndex, cardValue, chosenColor }
 *   DRAW_CARD  resource: { game }            context: {}
 *
 * Until swaraj-new merges that schema change, these intents are rejected by
 * the real gateway (fail-closed default deny) and the agent falls back /
 * forfeits. The schemas below mirror Swaraj's conventions so they can be
 * lifted into packages/schemas with minimal edits.
 */

export const ZunnoGameActionType = z.enum(["PLAY_CARD", "DRAW_CARD"]);

export const PlayCardContextSchema = z.strictObject({
  handIndex: z.number().int().nonnegative(),
  cardValue: z.number().int().min(1).max(108),
  /** 0–3 chosen color, 4 = keep for non-wilds. */
  chosenColor: z.number().int().min(0).max(4),
});

export const DrawCardContextSchema = z.strictObject({});

export const GameResourceSchema = z.strictObject({
  game: z.string().min(1).max(256),
});

export const ZunnoActionSchema = z.union([
  z.strictObject({
    action: z.literal("PLAY_CARD"),
    resource: GameResourceSchema,
    context: PlayCardContextSchema,
  }),
  z.strictObject({
    action: z.literal("DRAW_CARD"),
    resource: GameResourceSchema,
    context: DrawCardContextSchema,
  }),
]);

export type ZunnoGameAction = z.infer<typeof ZunnoActionSchema>;
