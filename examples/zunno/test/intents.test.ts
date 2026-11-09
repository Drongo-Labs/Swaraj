import { test } from "node:test";
import assert from "node:assert/strict";
import { buildIntent, toWire, type ZunnoProposal } from "../src/actions/intents.js";
import type { ZunnoAgentConfig } from "../src/config.js";

const config: ZunnoAgentConfig = {
  swarajApiUrl: "http://localhost:3000",
  applicationId: "zunno",
  agentId: "zunno-agent",
  gameAddress: "0x82b2cce9a52c7e56838a5c46833067f9eb006911",
  buyInCapWei: "10000000000000000",
  signature: `0x${"ab".repeat(65)}`,
};
const policyHash = `0x${"c0".repeat(32)}`;
const now = 1_770_000_000_000;

test("STAKE builds a valid PAYMENT intent bound to the game contract", () => {
  const intent = buildIntent({ kind: "STAKE", amountWei: "100000000000000" }, config, policyHash, now);
  assert.equal(intent.action, "PAYMENT");
  assert.deepEqual(intent.resource, { service: "zunno-stake" });
  assert.deepEqual(intent.context, {
    amount: "100000000000000",
    currency: "ETH",
    recipient: config.gameAddress,
  });
});

test("common fields: fresh unique ids, 60s expiry, signature passthrough", () => {
  const a = buildIntent({ kind: "STAKE", amountWei: "1" }, config, policyHash, now);
  const b = buildIntent({ kind: "STAKE", amountWei: "1" }, config, policyHash, now);
  assert.notEqual(a.common.intentId, b.common.intentId);
  assert.equal(a.common.expiry, now + 60_000);
  assert.equal(a.common.idempotencyKey, a.common.intentId);
  assert.match(a.common.intentId, /^[a-zA-Z0-9_-]{1,64}$/);
  assert.equal(a.common.agent, "zunno-agent");
});

test("PLAY_CARD builds a generic APP_ACTION with atomic decimal params", () => {
  const wild = buildIntent(
    { kind: "PLAY_CARD", handIndex: 0, cardValue: 101, chosenColor: 2 },
    config, policyHash, now,
  );
  if (wild.action !== "APP_ACTION") throw new Error("unreachable");
  assert.deepEqual(wild.resource, { app: "zunno", target: config.gameAddress });
  assert.equal(wild.context.name, "play_card");
  assert.deepEqual(wild.context.params, { handIndex: "0", cardValue: "101", chosenColor: "2", onTurn: true });

  const plain = buildIntent({ kind: "PLAY_CARD", handIndex: 0, cardValue: 11 }, config, policyHash, now);
  if (plain.action !== "APP_ACTION") throw new Error("unreachable");
  assert.deepEqual(plain.context.params, { handIndex: "0", cardValue: "11", chosenColor: "4", onTurn: true });
});

test("DRAW_CARD and wire flattening", () => {
  const draw = buildIntent({ kind: "DRAW_CARD" } satisfies ZunnoProposal, config, policyHash, now);
  if (draw.action !== "APP_ACTION") throw new Error("unreachable");
  assert.equal(draw.context.name, "draw_card");
  assert.deepEqual(draw.context.params, { onTurn: true });
  const wire = toWire(draw);
  assert.equal(wire.action, "APP_ACTION");
  assert.equal(wire.intentId, draw.common.intentId);
  assert.equal(wire.policyHash, policyHash);
  assert.deepEqual(wire.resource, { app: "zunno", target: config.gameAddress });
});
