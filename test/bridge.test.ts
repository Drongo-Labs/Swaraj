import { test } from "node:test";
import assert from "node:assert/strict";
import { ZunnoAgent, type MoveExecutor, type TurnInput } from "../src/agent/bridge.js";
import type { GatewayDecision } from "../src/swaraj/client.js";
import type { ZunnoAgentConfig } from "../src/config.js";

const config: ZunnoAgentConfig = {
  swarajApiUrl: "http://localhost:3000",
  applicationId: "zunno",
  agentId: "zunno-agent",
  gameAddress: "0x82b2cce9a52c7e56838a5c46833067f9eb006911",
  buyInCapWei: "10000000000000000",
  signature: `0x${"00".repeat(65)}`,
};
const policyHash = `0x${"11".repeat(32)}`;

/** Fake gateway: BLOCKs by rule fn, otherwise ALLOW. */
function fakeGateway(byRule: (action: string, context: Record<string, unknown>) => GatewayDecision) {
  const seen: Array<{ action: string; context: Record<string, unknown> }> = [];
  return {
    seen,
    async evaluateUnifiedAction(intent: { action: string; context: Record<string, unknown> }) {
      seen.push({ action: intent.action, context: intent.context });
      return byRule(intent.action, intent.context);
    },
  };
}

function fakeExecutor(log: string[]): MoveExecutor {
  return {
    async stake(amountWei: string) {
      log.push(`stake:${amountWei}`);
      return { txHash: "0xstake" };
    },
    async playCard(_i: number, cardValue: number, _c: number) {
      log.push(`play:${cardValue}`);
      return { txHash: "0xplay" };
    },
    async drawCard() {
      log.push("draw");
      return { txHash: "0xdraw" };
    },
  };
}

const allow: GatewayDecision = { outcome: "ALLOW", violatedRuleIds: [] };

function turn(hand: number[], proposal: TurnInput["proposal"]): TurnInput {
  return { hand, topValue: 5, activeColor: 0, proposal };
}

test("ALLOW: stake within cap executes through the executor", async () => {
  const gw = fakeGateway(() => allow);
  const log: string[] = [];
  const agent = new ZunnoAgent({ config, client: gw, executor: fakeExecutor(log) }, policyHash);
  const result = await agent.takeTurn(turn([], { kind: "STAKE", amountWei: "100000000000000" }));
  assert.equal(result.status, "EXECUTED");
  assert.deepEqual(log, ["stake:100000000000000"]);
  assert.equal(gw.seen[0]?.action, "PAYMENT");
});

test("BLOCK: over-cap stake abstains — never retried, never executed", async () => {
  const gw = fakeGateway(() => ({ outcome: "BLOCK", violatedRuleIds: ["forbid-stake-over-cap"] }));
  const log: string[] = [];
  const agent = new ZunnoAgent({ config, client: gw, executor: fakeExecutor(log) }, policyHash);
  const result = await agent.takeTurn(turn([], { kind: "STAKE", amountWei: "999000000000000000" }));
  assert.equal(result.status, "ABSTAINED");
  assert.deepEqual(log, []);
  if (result.status === "ABSTAINED") {
    assert.deepEqual(result.violatedRuleIds, ["forbid-stake-over-cap"]);
  }
});

test("BLOCK: forbidden play falls back to the next compliant legal card, gated again", async () => {
  // Wild Draw Four (108) forbidden; hand also holds a legal red 5 (11).
  const gw = fakeGateway((action, context) =>
    action === "PLAY_CARD" && (context.cardValue as number) > 104
      ? { outcome: "BLOCK", violatedRuleIds: ["forbid-wild-draw-four"] }
      : allow,
  );
  const log: string[] = [];
  const agent = new ZunnoAgent({ config, client: gw, executor: fakeExecutor(log) }, policyHash);
  const result = await agent.takeTurn(turn([108, 11], { kind: "PLAY_CARD", handIndex: 0, cardValue: 108, chosenColor: 1 }));
  assert.equal(result.status, "EXECUTED");
  assert.deepEqual(log, ["play:11"]);
  assert.equal(gw.seen.length, 2); // both moves were gated
  assert.equal(gw.seen[1]?.context.cardValue, 11);
});

test("BLOCK: no compliant card left → falls back to draw (gated)", async () => {
  const gw = fakeGateway((action) => (action === "PLAY_CARD"
    ? { outcome: "BLOCK", violatedRuleIds: ["r1"] }
    : allow));
  const log: string[] = [];
  const agent = new ZunnoAgent({ config, client: gw, executor: fakeExecutor(log) }, policyHash);
  const result = await agent.takeTurn(turn([3], { kind: "PLAY_CARD", handIndex: 0, cardValue: 3 }));
  assert.equal(result.status, "EXECUTED");
  assert.deepEqual(log, ["draw"]);
  assert.equal(gw.seen.at(-1)?.action, "DRAW_CARD");
});

test("fail-closed: gateway unreachable forfeits rather than executing unchecked", async () => {
  const log: string[] = [];
  const client = {
    async evaluateUnifiedAction() {
      throw new Error("connection refused");
    },
  };
  const agent = new ZunnoAgent({ config, client, executor: fakeExecutor(log) }, policyHash);
  const result = await agent.takeTurn(turn([11], { kind: "PLAY_CARD", handIndex: 0, cardValue: 11 }));
  assert.equal(result.status, "FORFEITED");
  assert.deepEqual(log, []);
});

test("fail-closed: unknown action type (pre-extension) BLOCKs by schema", async () => {
  // Today's real gateway returns 400 for PLAY_CARD/DRAW_CARD — the client maps that to BLOCK.
  const gw = fakeGateway((action) =>
    action === "PAYMENT" ? allow : { outcome: "BLOCK", violatedRuleIds: ["schema.invalid"] },
  );
  const log: string[] = [];
  const agent = new ZunnoAgent({ config, client: gw, executor: fakeExecutor(log) }, policyHash);
  const result = await agent.takeTurn(turn([11], { kind: "PLAY_CARD", handIndex: 0, cardValue: 11 }));
  // Play blocked by schema → fallback draw is *also* unknown pre-extension → forfeited.
  assert.equal(result.status, "FORFEITED");
  assert.deepEqual(log, []); // nothing executed without an ALLOW
});
