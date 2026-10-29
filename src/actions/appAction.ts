/**
 * Zunno actions use Swaraj's generic APP_ACTION (swaraj-new
 * `packages/schemas`, feature/app-action): any application namespaces its
 * actions through one schema-stable type.
 *
 *   resource: { app: "zunno", target: <game contract> }
 *   context:  { name: "play_card" | "draw_card", params: {...} }
 *
 * Params are atomic decimal strings (integers), canonicalized by the schema
 * regardless of key order. The old per-game-type extension draft is retired.
 */

import { z } from "zod";

export const ZUNNO_APP = "zunno";

export const ZunnoAppActionName = z.enum(["play_card", "draw_card"]);

export const PlayCardParamsSchema = z.strictObject({
  handIndex: z.string().regex(/^(0|[1-9][0-9]*)$/),
  cardValue: z.string().regex(/^(0|[1-9][0-9]*)$/),
  /** 0–3 chosen color, 4 = keep active color (non-wilds). */
  chosenColor: z.string().regex(/^(0|[1-9][0-9]*)$/),
});

export type PlayCardParams = z.infer<typeof PlayCardParamsSchema>;

export function playCardParams(input: { handIndex: number; cardValue: number; chosenColor: number }): PlayCardParams {
  return {
    handIndex: String(input.handIndex),
    cardValue: String(input.cardValue),
    chosenColor: String(input.chosenColor),
  };
}

export function drawCardParams(): Record<string, never> {
  return {};
}
