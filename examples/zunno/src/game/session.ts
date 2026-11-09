import { ZunnoAgent, openingProposal, type AgentDeps, type MoveExecutor } from "../agent/bridge.js";
import { EmbeddedGateway } from "../swaraj/embeddedGateway.js";
import { loadConfig, type ZunnoAgentConfig } from "../config.js";
import type { GatewayDecision } from "../swaraj/client.js";
import type { AgentTable, AgentView } from "./table.js";
import type { ZunnoProposal } from "../actions/intents.js";

/**
 * The agent's side of a match. Every move is a typed intent through the
 * Swaraj mandate gateway before it reaches the rules engine, which it sees
 * only through its own seat (`AgentTable`). Blocked moves go to the game log
 * so the constraint is visible: "Agent tried play_card — BLOCKED by
 * a_forbid_wild_draw_four".
 */

/** Opaque local binding: in local play there is no remote policy registry. */
const LOCAL_POLICY_HASH = `0x${"0".repeat(64)}`;

export class GameSession {
  private readonly agent: ZunnoAgent;

  constructor(
    private readonly config: ZunnoAgentConfig = loadConfig(),
    private readonly table: AgentTable,
    /** Picks a move, e.g. NEAR AI; undefined falls back to the first legal card. */
    private readonly pickMove?: (view: AgentView) => Promise<ZunnoProposal | undefined>,
  ) {
    this.agent = this.createAgent();
  }

  /** The agent keeps acting (each turn fully awaited) until the turn comes back or the game ends. */
  async agentTick(): Promise<void> {
    let guard = 0;
    for (;;) {
      const view = await this.table.view();
      if (view.winner !== null || view.turn !== "agent" || guard++ >= 8) return;
      await this.agent.takeTurn({
        hand: view.hand,
        topValue: view.topValue,
        activeColor: view.activeColor,
        proposal: (await this.pickMove?.(view).catch(() => undefined))
          ?? openingProposal(view.hand, view.topValue, view.activeColor),
      });
    }
  }

  private createAgent(): ZunnoAgent {
    const gateway = new EmbeddedGateway();
    const loggingGateway = {
      evaluateUnifiedAction: async (wireAction: unknown): Promise<GatewayDecision> => {
        const decision = await gateway.evaluateUnifiedAction(wireAction);
        if (decision.outcome === "BLOCK") {
          const wire = wireAction as { action?: string; context?: { name?: string } };
          const what = wire.action === "APP_ACTION"
            ? (wire.context?.name ?? "app_action")
            : (wire.action ?? "action").toLowerCase();
          await this.table.log(`Agent tried ${what} — BLOCKED by ${decision.violatedRuleIds.join(", ")}`, true);
        }
        return decision;
      },
    };
    const executor: MoveExecutor = {
      stake: async () => ({ txHash: "local" }),
      playCard: async (handIndex, cardValue, chosenColor) => {
        const error = await this.table.play(handIndex, chosenColor);
        if (error !== null) throw new Error(`engine rejected agent play: ${error}`);
        return { txHash: `play:${cardValue}` };
      },
      drawCard: async () => {
        if (!(await this.table.draw())) throw new Error("engine rejected agent draw");
        return { txHash: "draw" };
      },
    };
    const deps: AgentDeps = { config: this.config, client: loggingGateway, executor };
    return new ZunnoAgent(deps, LOCAL_POLICY_HASH);
  }
}
