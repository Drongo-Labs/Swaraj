import { randomUUID } from "node:crypto";
import type { ZunnoAgentConfig } from "../config.js";
import { isWild } from "../zunno/cards.js";

/**
 * Typed-intent builders. Every builder emits the exact shape Swaraj's
 * `POST /v1/applications/:id/unified-actions` consumes: common fields
 * (intentId, agent, policyHash, timestamp, expiry, idempotencyKey, signature)
 * plus the typed resource/context pair for the action.
 *
 * - STAKE maps onto the existing PAYMENT action (amount/currency/recipient)
 *   and works against today's gateway.
 * - PLAY_CARD / DRAW_CARD are the proposed game extension (see extension.ts).
 */

export type ZunnoProposal =
  | { kind: "STAKE"; amountWei: string }
  | { kind: "PLAY_CARD"; handIndex: number; cardValue: number; chosenColor?: number }
  | { kind: "DRAW_CARD" };

export type UnifiedIntent =
  | {
      action: "PAYMENT";
      resource: { service: string };
      context: { amount: string; currency: string; recipient: string };
      common: IntentCommon;
    }
  | {
      action: "PLAY_CARD";
      resource: { game: string };
      context: { handIndex: number; cardValue: number; chosenColor: number };
      common: IntentCommon;
    }
  | { action: "DRAW_CARD"; resource: { game: string }; context: Record<string, never>; common: IntentCommon };

export interface IntentCommon {
  intentId: string;
  agent: string;
  policyHash: string;
  timestamp: number;
  expiry: number;
  idempotencyKey: string;
  signature: string;
}

const freshId = (): string => `zunno${randomUUID().replace(/-/g, "").slice(0, 24)}`;

export function commonFields(config: ZunnoAgentConfig, policyHash: string, now = Date.now()): IntentCommon {
  const intentId = freshId();
  return {
    intentId,
    agent: config.agentId,
    policyHash,
    timestamp: now,
    expiry: now + 60_000,
    idempotencyKey: intentId,
    signature: config.signature,
  };
}

export function buildIntent(
  proposal: ZunnoProposal,
  config: ZunnoAgentConfig,
  policyHash: string,
  now = Date.now(),
): UnifiedIntent {
  const common = commonFields(config, policyHash, now);
  switch (proposal.kind) {
    case "STAKE":
      return {
        action: "PAYMENT",
        resource: { service: "zunno-stake" },
        context: {
          amount: proposal.amountWei,
          currency: "ETH",
          recipient: config.gameAddress,
        },
        common,
      };
    case "PLAY_CARD": {
      // Wilds must declare a chosen color (0–3); non-wilds keep the active color marker (4).
      const chosenColor = isWild(proposal.cardValue)
        ? (proposal.chosenColor ?? 0)
        : (proposal.chosenColor ?? 4);
      return {
        action: "PLAY_CARD",
        resource: { game: config.gameAddress },
        context: {
          handIndex: proposal.handIndex,
          cardValue: proposal.cardValue,
          chosenColor,
        },
        common,
      };
    }
    case "DRAW_CARD":
      return {
        action: "DRAW_CARD",
        resource: { game: config.gameAddress },
        context: {},
        common,
      };
  }
}

/** Flattened wire form: common fields hoisted next to action/resource/context. */
export function toWire(intent: UnifiedIntent): Record<string, unknown> {
  return {
    intentId: intent.common.intentId,
    agent: intent.common.agent,
    policyHash: intent.common.policyHash,
    timestamp: intent.common.timestamp,
    expiry: intent.common.expiry,
    idempotencyKey: intent.common.idempotencyKey,
    signature: intent.common.signature,
    action: intent.action,
    resource: intent.resource,
    context: intent.context,
  };
}
