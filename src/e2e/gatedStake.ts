import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadConfig } from "../config.js";
import { SwarajClient } from "../swaraj/client.js";
import { AgentMandateWireSchema } from "../swaraj/mandateSchema.js";
import { ZunnoAgent, type TurnResult } from "../agent/bridge.js";
import { ViemMoveExecutor } from "../executor/viemExecutor.js";
import { buildIntent, toWire } from "../actions/intents.js";

/**
 * End-to-end against a live Swaraj API:
 *   1. register the Zunno Agent Mandate (fixture) and capture its policyHash
 *   2. in-cap stake    → expect ALLOW → executor (dry-run joinGame calldata)
 *   3. over-cap stake → expect BLOCK → abstain, rule named
 *   4. play_card      → expect ALLOW (APP_ACTION through the real gateway)
 *   5. draw_card      → expect ALLOW
 *   6. shuffle_deck   → expect BLOCK (default deny on an unknown action)
 *
 * Executor runs dry-run unless ZUNNO_BOT_PRIVATE_KEY + ZUNNO_E2E_LIVE=1.
 */
const here = dirname(fileURLToPath(import.meta.url));

const ETH = 10n ** 18n;

function describe(result: TurnResult): string {
  switch (result.status) {
    case "EXECUTED":
      return `EXECUTED (${result.kind}) tx=${result.txHash}`;
    case "ABSTAINED":
      return `ABSTAINED — blocked by ${result.violatedRuleIds.join(", ") || "?"}`;
    case "FORFEITED":
      return `FORFEITED (${result.reason}) — ${result.violatedRuleIds.join(", ")}`;
  }
}

async function main(): Promise<number> {
  const config = loadConfig();
  const token = process.env.SWARAJ_DEV_TOKEN;
  if (!token || token.length < 32) {
    console.error("SWARAJ_DEV_TOKEN (>= 32 chars) is required");
    return 2;
  }
  const gameId = BigInt(process.env.ZUNNO_GAME_ID ?? "1");
  const live = process.env.ZUNNO_E2E_LIVE === "1" && process.env.ZUNNO_BOT_PRIVATE_KEY;

  const mandateJson = JSON.parse(
    readFileSync(join(here, "..", "..", "mandate", "zunno-mandate.json"), "utf-8"),
  );
  const mandate = AgentMandateWireSchema.parse(mandateJson);

  const client = new SwarajClient(config.swarajApiUrl, config.applicationId, token);
  const registered = await client.registerMandate(mandate);
  console.log(`mandate registered: ${registered.mandateId} v${registered.version} ` +
    `(${registered.ruleCount} rules) policyHash=${registered.policyHash}`);

  const executor = new ViemMoveExecutor({
    contractAddress: config.gameAddress as `0x${string}`,
    gameId,
    ...(process.env.ZUNNO_BOT_PRIVATE_KEY ? { privateKey: process.env.ZUNNO_BOT_PRIVATE_KEY as `0x${string}` } : {}),
    ...(process.env.ZUNNO_RPC_URL ? { rpcUrl: process.env.ZUNNO_RPC_URL } : {}),
    dryRun: !live,
  });
  const agent = new ZunnoAgent({ config, client, executor }, registered.policyHash);

  const failures: string[] = [];
  const expect = (label: string, condition: boolean, detail: string): void => {
    console.log(`${condition ? "  ✔" : "  ✖"} ${label}: ${detail}`);
    if (!condition) failures.push(label);
  };

  console.log("\n1. stake within cap (0.005 ETH)");
  const inCap = await agent.takeTurn({
    hand: [], topValue: 0, activeColor: 0,
    proposal: { kind: "STAKE", amountWei: (5n * ETH / 1000n).toString() },
  });
  expect("in-cap stake executes", inCap.status === "EXECUTED", describe(inCap));

  console.log("\n2. stake over cap (0.05 ETH) — the demo beat");
  const overCap = await agent.takeTurn({
    hand: [], topValue: 0, activeColor: 0,
    proposal: { kind: "STAKE", amountWei: (5n * ETH / 100n).toString() },
  });
  expect("over-cap stake abstains", overCap.status === "ABSTAINED", describe(overCap));
  if (overCap.status === "ABSTAINED") {
    expect("forbid rule named",
      overCap.violatedRuleIds.includes("forbid_stake_over_cap"),
      overCap.violatedRuleIds.join(", "));
  }

  console.log("\n3. play_card (generic APP_ACTION)");
  const play = await agent.takeTurn({
    hand: [11], topValue: 5, activeColor: 0,
    proposal: { kind: "PLAY_CARD", handIndex: 0, cardValue: 11 },
  });
  expect("play_card allowed and executed", play.status === "EXECUTED", describe(play));

  console.log("\n4. draw_card");
  const draw = await agent.takeTurn({
    hand: [3], topValue: 5, activeColor: 1,
    proposal: { kind: "DRAW_CARD" },
  });
  expect("draw_card allowed and executed", draw.status === "EXECUTED", describe(draw));

  console.log("\n5. unknown action name (shuffle_deck) — default deny");
  const drawIntent = buildIntent({ kind: "DRAW_CARD" }, config, registered.policyHash);
  const rawShuffle = {
    ...toWire(drawIntent),
    context: { name: "shuffle_deck", params: {} },
  };
  const shuffleDecision = await clientRaw(rawShuffle, config, token);
  expect("unknown action denied",
    shuffleDecision.outcome === "BLOCK" && shuffleDecision.violatedRuleIds.length === 0,
    `${shuffleDecision.outcome} ${shuffleDecision.violatedRuleIds.join(", ")}`);

  console.log(`\n${failures.length === 0 ? "ALL CHECKS PASSED" : `FAILURES: ${failures.join("; ")}`}`);
  return failures.length === 0 ? 0 : 1;
}

/** Direct raw submission (bypasses the bridge) for the default-deny check. */
async function clientRaw(raw: Record<string, unknown>, config: ReturnType<typeof loadConfig>, token: string) {
  const response = await fetch(
    `${config.swarajApiUrl.replace(/\/$/, "")}/v1/applications/${config.applicationId}/unified-actions`,
    {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: raw }),
    },
  );
  const json = (await response.json()) as {
    decision?: string;
    mandate?: { reason?: string; matchedRuleIds?: string[] };
  };
  return {
    outcome: json.decision === "ALLOW" ? ("ALLOW" as const) : ("BLOCK" as const),
    violatedRuleIds: json.mandate?.matchedRuleIds ?? [],
  };
}

process.exitCode = await main();
