import { randomUUID } from "node:crypto";
import type { ZunnoAgentConfig } from "../config.js";
import { isWild } from "../zunno/cards.js";
import { playCardParams } from "./appAction.js";

/**
 * Typed-intent builders. Every builder emits the exact shape Swaraj's
 * `POST /v1/applications/:id/unified-actions` consumes.
 *
 * - STAKE maps onto the typed PAYMENT action (amount/currency/recipient).
 * - PLAY_CARD / DRAW_CARD use the generic APP_ACTION: resource {app:"zunno",
 *   target: game}, context {name, params} — atomic decimal params.
 */

export type ZunnoProposal =
  | { kind: "STAKE"; amountWei: string }
  /** NEP-141 / mandate-gated wager (USDC atomic units). */
  | { kind: "WAGER"; amount: string; recipient: string }
  | { kind: "PLAY_CARD"; handIndex: number; cardValue: number; chosenColor?: number; onTurn?: boolean }
  | { kind: "DRAW_CARD"; onTurn?: boolean };

export type UnifiedIntent =
  | {
      action: "PAYMENT";
      resource: { service: string };
      context: { amount: string; currency: string; recipient: string };
      common: IntentCommon;
    }
  | {
      action: "APP_ACTION";
      resource: { app: string; target: string };
      context: { name: "play_card" | "draw_card"; params: Record<string, string | boolean> };
      common: IntentCommon;
    };

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
    case "WAGER":
      return {
        action: "PAYMENT",
        resource: { service: "zunno_wager" },
        context: {
          amount: proposal.amount,
          currency: "USDC",
          recipient: proposal.recipient,
        },
        common,
      };
    case "PLAY_CARD":
      return {
        action: "APP_ACTION",
        resource: { app: "zunno", target: config.gameAddress },
        context: {
          name: "play_card",
          params: {
            ...playCardParams({
              handIndex: proposal.handIndex,
              cardValue: proposal.cardValue,
              // Wilds must declare a chosen color (0–3); non-wilds keep 4.
              chosenColor: isWild(proposal.cardValue) ? (proposal.chosenColor ?? 0) : (proposal.chosenColor ?? 4),
            }),
            onTurn: proposal.onTurn !== false,
          },
        },
        common,
      };
    case "DRAW_CARD":
      return {
        action: "APP_ACTION",
        resource: { app: "zunno", target: config.gameAddress },
        context: {
          name: "draw_card",
          params: { onTurn: proposal.onTurn !== false },
        },
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
