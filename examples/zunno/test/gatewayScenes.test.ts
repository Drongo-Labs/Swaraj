import { test } from "node:test";
import assert from "node:assert/strict";
import { EmbeddedGateway } from "../src/swaraj/embeddedGateway.js";
import { buildIntent, toWire } from "../src/actions/intents.js";
import { loadConfig } from "../src/config.js";

const policyHash = `0x${"11".repeat(32)}`;
const config = loadConfig();

test("embedded gateway: on-turn play ALLOW; off-turn BLOCK names forbid_off_turn", async () => {
  const gateway = new EmbeddedGateway();
  const onTurn = await gateway.evaluateUnifiedAction(
    toWire(buildIntent({ kind: "PLAY_CARD", handIndex: 0, cardValue: 11, onTurn: true }, config, policyHash)),
  );
  assert.equal(onTurn.outcome, "ALLOW");

  const offTurn = await gateway.evaluateUnifiedAction(
    toWire(buildIntent({ kind: "PLAY_CARD", handIndex: 0, cardValue: 11, onTurn: false }, config, policyHash)),
  );
  assert.equal(offTurn.outcome, "BLOCK");
  assert.ok(offTurn.violatedRuleIds.includes("forbid_off_turn"), JSON.stringify(offTurn));
});

test("embedded gateway: wager in-cap ALLOW; over-cap BLOCK names forbid_wager_over_cap", async () => {
  const gateway = new EmbeddedGateway();
  const escrow = "swaraj-wager.testnet";
  const ok = await gateway.evaluateUnifiedAction(
    toWire(buildIntent({ kind: "WAGER", amount: "1000000", recipient: escrow }, config, policyHash)),
  );
  assert.equal(ok.outcome, "ALLOW");

  const over = await gateway.evaluateUnifiedAction(
    toWire(buildIntent({ kind: "WAGER", amount: "5000001", recipient: escrow }, config, policyHash)),
  );
  assert.equal(over.outcome, "BLOCK");
  assert.ok(over.violatedRuleIds.includes("forbid_wager_over_cap"), JSON.stringify(over));
});
