import { ZunnoAgent, openingProposal, type AgentDeps, type MoveExecutor } from "../agent/bridge.js";
import { createGateway } from "../swaraj/gateway.js";
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
  private refusedPosition: string | undefined;

  constructor(
    private readonly config: ZunnoAgentConfig = loadConfig(),
    private readonly table: AgentTable,
    /** Picks a move, e.g. NEAR AI; undefined falls back to the first legal card. */
    private readonly pickMove?: (view: AgentView) => Promise<ZunnoProposal | undefined>,
    /** Mandate policy hash from live registration; local demo uses LOCAL_POLICY_HASH. */
    private readonly policyHash: string = LOCAL_POLICY_HASH,
  ) {
    this.agent = this.createAgent();
  }

  /** The agent keeps acting (each turn fully awaited) until the turn comes back or the game ends. */
  async agentTick(): Promise<void> {
    let guard = 0;
    for (;;) {
      const view = await this.table.view();
      if (view.winner !== null || view.turn !== "agent" || guard++ >= 8) return;
      // A turn the mandate refused outright (even the draw) is not retried until the table changes:
      // every retry is another decision, receipt and proof.
      const position = JSON.stringify([view.hand, view.topValue, view.activeColor]);
      if (position === this.refusedPosition) return;
      const result = await this.agent.takeTurn({
        hand: view.hand,
        topValue: view.topValue,
        activeColor: view.activeColor,
        proposal: (await this.pickMove?.(view).catch(() => undefined))
          ?? openingProposal(view.hand, view.topValue, view.activeColor),
      });
      if (result.status !== "EXECUTED") this.refusedPosition = position;
    }
  }

  /**
   * Tells the table when a decision's proof settles on NEAR, so the page can show it.
   * ponytail: one poll loop per receipt; poll the whole queue in one request if games get long.
   */
  private async watchProof(
    status: (receiptId: string) => Promise<{ status: string; reference?: string }>,
    receiptId: string,
    label: string,
  ): Promise<void> {
    for (let attempt = 0; attempt < 1440; attempt++) { // 6 hours at 15s
      await new Promise((resolve) => setTimeout(resolve, 15_000));
      const receipt = await status(receiptId).catch(() => undefined);
      if (!receipt || receipt.status === "PENDING") continue;
      const short = receiptId.slice(0, 8);
      await this.table.log(
        receipt.status === "PROVED"
          ? `Proved on NEAR: ${label} · receipt ${short}${receipt.reference ? ` · ${receipt.reference.split(":")[1] ?? ""}` : ""}`
          : `Proof ended ${receipt.status}: ${label} · receipt ${short}`,
        false,
      ).catch(() => undefined);
      return;
    }
  }

  private createAgent(): ZunnoAgent {
    const gateway = createGateway(this.config);
    const loggingGateway = {
      evaluateUnifiedAction: async (wireAction: unknown): Promise<GatewayDecision> => {
        const decision = await gateway.evaluateUnifiedAction(wireAction);
        const wire = wireAction as { action?: string; context?: { name?: string } };
        const what = wire.action === "APP_ACTION"
          ? (wire.context?.name ?? "app_action")
          : (wire.action ?? "action").toLowerCase();
        if (decision.receiptId && gateway.receiptStatus) {
          void this.watchProof(gateway.receiptStatus.bind(gateway), decision.receiptId, `${decision.outcome} ${what}`);
        }
        if (decision.outcome === "BLOCK") {
          const rules = decision.violatedRuleIds.join(", ") || "default_deny";
          await this.table.log(`Agent tried ${what} — BLOCKED by ${rules}`, true);
        }
        return decision;
      },
    };
    const executor: MoveExecutor = {
      stake: async () => ({ txHash: "local" }),
      wager: async (amount, recipient) => ({ txHash: `wager:${amount}:${recipient}` }),
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
    // 8 wilds is the most forbidden cards a hand can hold; the draw after them is one more.
    const deps: AgentDeps = { config: this.config, client: loggingGateway, executor, maxFallbacks: 9 };
    return new ZunnoAgent(deps, this.policyHash);
  }
}
