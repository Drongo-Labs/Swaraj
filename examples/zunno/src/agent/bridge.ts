import { GovernedAgent, type ActResult, type GovernedActionSpec } from "@swaraj/agent";
import type { GatewayDecision } from "@swaraj/agent";
import { buildIntent, toWire, type ZunnoProposal } from "../actions/intents.js";
import { firstLegalCard, isPlayable } from "../zunno/cards.js";
import type { ZunnoAgentConfig } from "../config.js";

/**
 * Zunno's adapter over the core GovernedAgent (@swaraj/agent, vendored from
 * swaraj-new): the generic propose → gate → ALLOW-executes / BLOCK-fallback
 * loop and its kernel-checked proof (Gate.exec_needs_allow) live in core.
 * What stays here is exactly the app-specific residue:
 *
 * - the proposal vocabulary (STAKE / PLAY_CARD / DRAW_CARD) + intent building
 * - the policy per action class: moves RETRY, stakes ABSTAIN
 * - the UNO fallback picker (first legal card in hand, else draw)
 */

export interface MoveExecutor {
  stake(amountWei: string, recipient: string): Promise<{ txHash: string }>;
  /** Optional NEP-141 wager path (mandate-gated). */
  wager?(amount: string, recipient: string): Promise<{ txHash: string }>;
  playCard(handIndex: number, cardValue: number, chosenColor: number): Promise<{ txHash: string }>;
  drawCard(): Promise<{ txHash: string }>;
}

export type TurnResult =
  | { status: "EXECUTED"; kind: ZunnoProposal["kind"]; txHash: string; decision: GatewayDecision }
  | { status: "ABSTAINED"; reason: "BLOCKED" | "GATEWAY_UNAVAILABLE"; violatedRuleIds: string[] }
  | { status: "FORFEITED"; reason: "BLOCKED" | "GATEWAY_UNAVAILABLE"; violatedRuleIds: string[] };

export interface TurnInput {
  hand: number[];
  topValue: number;
  activeColor: number;
  proposal: ZunnoProposal;
}

export interface AgentDeps {
  config: ZunnoAgentConfig;
  client: { evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision> };
  executor: MoveExecutor;
  /** Compliant-move retries before forfeiting the turn. */
  maxFallbacks?: number;
}

export class ZunnoAgent {
  private readonly agent: GovernedAgent<ZunnoProposal>;

  constructor(private readonly deps: AgentDeps, private readonly policyHash: string) {
    this.agent = new GovernedAgent<ZunnoProposal>({
      client: deps.client,
      executor: {
        execute: (proposal) => this.execute(proposal),
      },
      // Per-action specs are chosen in takeTurn; this default is never reached.
      spec: { policy: "ABSTAIN", toWireAction: () => { throw new Error("no spec"); } },
      ...(deps.maxFallbacks !== undefined ? { maxFallbacks: deps.maxFallbacks } : {}),
    });
  }

  async takeTurn(input: TurnInput): Promise<TurnResult> {
    const result: ActResult = await this.agent.act(input.proposal, this.specFor(input));
    if (result.status === "EXECUTED") {
      return { status: "EXECUTED", kind: input.proposal.kind, txHash: result.txHash, decision: result.decision };
    }
    return result;
  }

  private async execute(proposal: ZunnoProposal): Promise<{ txHash: string }> {
    switch (proposal.kind) {
      case "STAKE":
        return this.deps.executor.stake(proposal.amountWei, this.deps.config.gameAddress);
      case "WAGER":
        if (!this.deps.executor.wager) throw new Error("wager executor not configured");
        return this.deps.executor.wager(proposal.amount, proposal.recipient);
      case "PLAY_CARD":
        return this.deps.executor.playCard(proposal.handIndex, proposal.cardValue, proposal.chosenColor ?? 4);
      case "DRAW_CARD":
        return this.deps.executor.drawCard();
    }
  }

  /** Stakes/wagers ABSTAIN on BLOCK; moves RETRY with the next compliant legal card, else draw. */
  private specFor(input: TurnInput): GovernedActionSpec<ZunnoProposal> {
    const toWireAction = (proposal: ZunnoProposal): unknown =>
      toWire(buildIntent(proposal, this.deps.config, this.policyHash));
    if (input.proposal.kind === "STAKE" || input.proposal.kind === "WAGER") {
      return { policy: "ABSTAIN", toWireAction };
    }
    // Every card refused this turn stays refused, or two forbidden cards retry each other forever.
    const refused = new Set<number>();
    return {
      policy: "RETRY",
      toWireAction,
      fallback: (blocked) => nextCompliantProposal(blocked, input, refused),
    };
  }
}

/** First legal card in hand order (excluding every card refused this turn), else draw. */
function nextCompliantProposal(blocked: ZunnoProposal, input: TurnInput, refused: Set<number>): ZunnoProposal | null {
  if (blocked.kind === "STAKE" || blocked.kind === "WAGER") return null; // stakes/wagers use ABSTAIN
  if (blocked.kind === "PLAY_CARD") refused.add(blocked.cardValue);
  for (const [index, value] of input.hand.entries()) {
    if (refused.has(value)) continue;
    if (isPlayable(value, input.topValue, input.activeColor)) {
      return { kind: "PLAY_CARD", handIndex: index, cardValue: value, chosenColor: 4 };
    }
  }
  if (blocked.kind === "DRAW_CARD") return null; // draw itself was blocked
  return { kind: "DRAW_CARD" };
}

/** Convenience for bootstrapping: first legal card or draw, per the existing bot strategy. */
export function openingProposal(hand: number[], topValue: number, activeColor: number): ZunnoProposal {
  const card = firstLegalCard(hand, topValue, activeColor);
  const index = card === null ? -1 : hand.indexOf(card);
  return card !== null && index >= 0
    ? { kind: "PLAY_CARD", handIndex: index, cardValue: card, chosenColor: 4 }
    : { kind: "DRAW_CARD" };
}
