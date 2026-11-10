/**
 * Nov 9: Zunno moves + NEAR wager through the real Swaraj gateway.
 *
 *   1. Register mandate
 *   2. play_card on-turn → ALLOW
 *   3. play_card off-turn → BLOCK forbid_off_turn
 *   4. wager within cap → ALLOW
 *   5. wager over cap → BLOCK forbid_wager_over_cap (rule named)
 *
 * Requires ZUNNO_GATEWAY=live, SWARAJ_DEV_TOKEN, and a running API.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../config.js";
import { SwarajClient } from "../swaraj/client.js";
import { AgentMandateWireSchema } from "../swaraj/mandateSchema.js";
import { ZunnoAgent } from "../agent/bridge.js";
import { buildIntent, toWire } from "../actions/intents.js";

const here = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<number> {
  process.env.ZUNNO_GATEWAY = "live";
  const token = process.env.SWARAJ_DEV_TOKEN;
  if (!token || token.length < 32) {
    console.error("SWARAJ_DEV_TOKEN (>= 32 chars) is required");
    return 2;
  }
  const config = loadConfig();
  const mandate = AgentMandateWireSchema.parse(
    JSON.parse(readFileSync(join(here, "..", "..", "mandate", "zunno-mandate.json"), "utf8")),
  );
  const client = new SwarajClient(config.swarajApiUrl, config.applicationId, token);
  const registered = await client.registerMandate(mandate);
  console.log(`mandate ${registered.mandateId} v${registered.version} hash=${registered.policyHash}`);

  const escrow = process.env.ZUNNO_WAGER_ESCROW ?? "swaraj-wager-proof-11110149.testnet";
  const agent = new ZunnoAgent(
    {
      config,
      client,
      executor: {
        stake: async () => ({ txHash: "noop" }),
        wager: async (amount, recipient) => ({ txHash: `wager:${amount}@${recipient}` }),
        playCard: async () => ({ txHash: "play" }),
        drawCard: async () => ({ txHash: "draw" }),
      },
    },
    registered.policyHash,
  );

  const failures: string[] = [];
  const check = (label: string, ok: boolean, detail: string) => {
    console.log(`${ok ? "✔" : "✖"} ${label}: ${detail}`);
    if (!ok) failures.push(label);
  };

  const onTurn = await agent.takeTurn({
    hand: [1],
    topValue: 1,
    activeColor: 0,
    proposal: { kind: "PLAY_CARD", handIndex: 0, cardValue: 1, onTurn: true },
  });
  check("on-turn play ALLOW", onTurn.status === "EXECUTED", JSON.stringify(onTurn));

  // Off-turn: evaluate wire directly so RETRY cannot mask the forbid.
  const offWire = toWire(
    buildIntent(
      { kind: "PLAY_CARD", handIndex: 0, cardValue: 1, onTurn: false },
      config,
      registered.policyHash,
    ),
  );
  const offDecision = await client.evaluateUnifiedAction(offWire);
  check(
    "off-turn play BLOCK",
    offDecision.outcome === "BLOCK" && offDecision.violatedRuleIds.includes("forbid_off_turn"),
    JSON.stringify(offDecision),
  );

  const inCap = await agent.takeTurn({
    hand: [],
    topValue: 0,
    activeColor: 0,
    proposal: { kind: "WAGER", amount: "1000000", recipient: escrow },
  });
  check("wager in-cap ALLOW", inCap.status === "EXECUTED", JSON.stringify(inCap));

  const over = await agent.takeTurn({
    hand: [],
    topValue: 0,
    activeColor: 0,
    proposal: { kind: "WAGER", amount: "5000001", recipient: escrow },
  });
  check(
    "wager over-cap BLOCK",
    over.status === "ABSTAINED"
      && over.violatedRuleIds.includes("forbid_wager_over_cap"),
    JSON.stringify(over),
  );

  if (failures.length > 0) {
    console.error(`FAILED: ${failures.join(", ")}`);
    return 1;
  }
  console.log("All gateway wager / turn-discipline scenes passed.");
  return 0;
}

process.exit(await main());
