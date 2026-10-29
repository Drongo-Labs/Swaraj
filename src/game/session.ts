import { UnoEngine } from "./engine.js";
import { ZunnoAgent, openingProposal, type AgentDeps, type MoveExecutor } from "../agent/bridge.js";
import { EmbeddedGateway } from "../swaraj/embeddedGateway.js";
import { loadConfig, type ZunnoAgentConfig } from "../config.js";
import type { GatewayDecision } from "../swaraj/client.js";
import type { UnifiedIntent } from "../actions/intents.js";

/**
 * One match: the human plays through normal legality; the agent's every move
 * is a typed intent through the Swaraj mandate gateway before it touches the
 * engine. Blocked moves are written to the game log so the constraint is
 * visible: "Agent tried play_card — BLOCKED by a_forbid_wild_draw_four".
 */

/** Opaque local binding: in local play there is no remote policy registry. */
const LOCAL_POLICY_HASH = `0x${"0".repeat(64)}`;

export class GameSession {
  private engine: UnoEngine;
  private agent: ZunnoAgent;

  constructor(private readonly config: ZunnoAgentConfig = loadConfig(), engine?: UnoEngine) {
    this.engine = engine ?? new UnoEngine();
    this.agent = this.createAgent(this.engine);
  }

  newGame(): void {
    this.engine = new UnoEngine();
    this.agent = this.createAgent(this.engine);
  }

  state() {
    return this.engine.publicView("human");
  }

  async humanPlay(handIndex: number, chosenColor?: number): Promise<string | null> {
    const error = this.engine.play("human", handIndex, chosenColor);
    if (error === null) await this.agentTurns();
    return error;
  }

  async humanDraw(): Promise<string | null> {
    const ok = this.engine.draw("human");
    if (!ok) return "Cannot draw right now.";
    await this.agentTurns();
    return null;
  }

  /** The agent keeps acting (each turn fully awaited) until the turn comes back or the game ends. */
  private async agentTurns(): Promise<void> {
    let guard = 0;
    while (this.engine.state.winner === null && this.engine.state.turn === "agent" && guard++ < 8) {
      const hand = this.engine.hand("agent");
      const proposal = openingProposal(hand, this.engine.topValue, this.engine.state.activeColor);
      await this.agent.takeTurn({
        hand,
        topValue: this.engine.topValue,
        activeColor: this.engine.state.activeColor,
        proposal,
      });
    }
  }

  /** Visible test/engine hook. */
  engineRef(): UnoEngine {
    return this.engine;
  }

  /** Run the agent's turn loop once (public for tests; play mode calls it after human moves). */
  async agentTick(): Promise<void> {
    await this.agentTurns();
  }

  private createAgent(engine: UnoEngine): ZunnoAgent {
    const gateway = new EmbeddedGateway();
    const loggingGateway = {
      evaluateUnifiedAction: async (intent: UnifiedIntent): Promise<GatewayDecision> => {
        const decision = await gateway.evaluateUnifiedAction(intent);
        if (decision.outcome === "BLOCK") {
          const what = intent.action === "APP_ACTION" ? intent.context.name : intent.action.toLowerCase();
          engine.log("agent", `Agent tried ${what} — BLOCKED by ${decision.violatedRuleIds.join(", ")}`, true);
        }
        return decision;
      },
    };
    const executor: MoveExecutor = {
      stake: async () => ({ txHash: "local" }),
      playCard: async (handIndex, cardValue, chosenColor) => {
        const error = engine.play("agent", handIndex, chosenColor);
        if (error !== null) throw new Error(`engine rejected agent play: ${error}`);
        return { txHash: `play:${cardValue}` };
      },
      drawCard: async () => {
        if (!engine.draw("agent")) throw new Error("engine rejected agent draw");
        return { txHash: "draw" };
      },
    };
    const deps: AgentDeps = { config: this.config, client: loggingGateway, executor };
    return new ZunnoAgent(deps, LOCAL_POLICY_HASH);
  }
}
