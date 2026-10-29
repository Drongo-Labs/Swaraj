import { firstLegalCard, isPlayable } from "../zunno/cards.js";
import { buildIntent, type UnifiedIntent, type ZunnoProposal } from "../actions/intents.js";
import type { GatewayDecision, SwarajClient } from "../swaraj/client.js";
import type { ZunnoAgentConfig } from "../config.js";

/**
 * The Swaraj-governed Zunno agent bridge: no move executes without an ALLOW
 * from the gateway. BLOCK never mutates game state — the agent retries with a
 * compliant move, and a blocked stake simply abstains. Fail-closed (gateway
 * down, malformed intent, unknown action type) behaves exactly like BLOCK.
 */

export interface MoveExecutor {
  stake(amountWei: string, recipient: string): Promise<{ txHash: string }>;
  playCard(handIndex: number, cardValue: number, chosenColor: number): Promise<{ txHash: string }>;
  drawCard(): Promise<{ txHash: string }>;
}

export type TurnResult =
  | { status: "EXECUTED"; kind: ZunnoProposal["kind"]; txHash: string; decision: GatewayDecision }
  | { status: "ABSTAINED"; reason: "BLOCKED"; violatedRuleIds: string[] }
  | { status: "FORFEITED"; reason: "BLOCKED" | "GATEWAY_UNAVAILABLE"; violatedRuleIds: string[] };

export interface TurnInput {
  hand: number[];
  topValue: number;
  activeColor: number;
  proposal: ZunnoProposal;
}

export interface AgentDeps {
  config: ZunnoAgentConfig;
  client: Pick<SwarajClient, "evaluateUnifiedAction">;
  executor: MoveExecutor;
  /** Compliant-move retries before forfeiting the turn. */
  maxFallbacks?: number;
}

export class ZunnoAgent {
  private readonly policyHash: string;

  constructor(private readonly deps: AgentDeps, policyHash: string) {
    this.policyHash = policyHash;
  }

  async takeTurn(input: TurnInput): Promise<TurnResult> {
    return this.attempt(input.proposal, input);
  }

  private async attempt(proposal: ZunnoProposal, input: TurnInput): Promise<TurnResult> {
    let decision: GatewayDecision;
    try {
      decision = await this.deps.client.evaluateUnifiedAction(
        buildIntent(proposal, this.deps.config, this.policyHash),
      );
    } catch {
      // Fail closed: gateway unreachable ⇒ BLOCK semantics.
      return this.onBlock(input, { outcome: "BLOCK", violatedRuleIds: ["gateway.unreachable"] });
    }

    if (decision.outcome === "ALLOW") {
      const tx = await this.execute(proposal);
      return { status: "EXECUTED", kind: proposal.kind, txHash: tx.txHash, decision };
    }
    return this.onBlock(input, decision);
  }

  private async execute(proposal: ZunnoProposal): Promise<{ txHash: string }> {
    const { executor, config } = this.deps;
    switch (proposal.kind) {
      case "STAKE":
        return executor.stake(proposal.amountWei, config.gameAddress);
      case "PLAY_CARD":
        return executor.playCard(
          proposal.handIndex,
          proposal.cardValue,
          proposal.chosenColor ?? 4,
        );
      case "DRAW_CARD":
        return executor.drawCard();
    }
  }

  /**
   * BLOCK handling: a blocked stake abstains (money actions are never
   * retried blind). A blocked play falls back to the next compliant move —
   * first legal non-proposed card, else draw — each still gated. Exhausted
   * retries forfeit the turn: the rules engine never sees an unchecked move.
   */
  private async onBlock(input: TurnInput, decision: GatewayDecision): Promise<TurnResult> {
    if (input.proposal.kind === "STAKE") {
      return { status: "ABSTAINED", reason: "BLOCKED", violatedRuleIds: decision.violatedRuleIds };
    }
    const remaining = (this.deps.maxFallbacks ?? 3) - 1;
    if (remaining < 0) {
      return { status: "FORFEITED", reason: "BLOCKED", violatedRuleIds: decision.violatedRuleIds };
    }
    const fallback = this.nextCompliantProposal(input);
    if (!fallback) {
      return { status: "FORFEITED", reason: "BLOCKED", violatedRuleIds: decision.violatedRuleIds };
    }
    const agent = new ZunnoAgent({ ...this.deps, maxFallbacks: remaining }, this.policyHash);
    const result = await agent.attempt(fallback, { ...input, proposal: fallback });
    if (result.status === "FORFEITED") {
      return { ...result, violatedRuleIds: [...decision.violatedRuleIds, ...result.violatedRuleIds] };
    }
    return result;
  }

  /** First legal card in hand order (excluding the blocked one), else draw. */
  private nextCompliantProposal(input: TurnInput): ZunnoProposal | null {
    const blocked = input.proposal.kind === "PLAY_CARD" ? input.proposal.cardValue : null;
    for (const [index, value] of input.hand.entries()) {
      if (value === blocked) continue;
      if (isPlayable(value, input.topValue, input.activeColor)) {
        return { kind: "PLAY_CARD", handIndex: index, cardValue: value, chosenColor: 4 };
      }
    }
    if (input.proposal.kind === "DRAW_CARD") return null; // draw itself was blocked
    return { kind: "DRAW_CARD" };
  }
}

/** Convenience for bootstrapping: first legal card or draw, per the existing bot strategy. */
export function openingProposal(hand: number[], topValue: number, activeColor: number): ZunnoProposal {
  const card = firstLegalCard(hand, topValue, activeColor);
  const index = card === null ? -1 : hand.indexOf(card);
  return card !== null && index >= 0
    ? { kind: "PLAY_CARD", handIndex: index, cardValue: card, chosenColor: 4 }
    : { kind: "DRAW_CARD" };
}
