import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AgentMandateWireSchema } from "../src/swaraj/mandateSchema.js";

const here = dirname(fileURLToPath(import.meta.url));

function loadMandate(name: string): unknown {
  return JSON.parse(readFileSync(join(here, "..", "mandate", name), "utf-8"));
}

test("shipped mandate fixture is well-formed (today's gateway: PAYMENT only)", () => {
  const parsed = AgentMandateWireSchema.parse(loadMandate("zunno-mandate.json"));
  assert.equal(parsed.mandateId, "zunno-mandate");
  assert.ok(parsed.rules.length >= 2);
  const actions = new Set(parsed.rules.map((rule) => rule.action));
  assert.deepEqual([...actions], ["PAYMENT"]);
});

test("mandate pins the stake: ETH only, game contract recipient, cap on amount", () => {
  const mandate = AgentMandateWireSchema.parse(loadMandate("zunno-mandate.json"));
  const permit = mandate.rules.find((rule) => rule.effect === "PERMIT");
  const forbid = mandate.rules.find((rule) => rule.effect === "FORBID");
  assert.ok(permit && forbid);
  const currency = permit.predicates.find((p) => p.field === "context.currency");
  const recipient = permit.predicates.find((p) => p.field === "context.recipient");
  const cap = permit.predicates.find((p) => p.field === "context.amount");
  assert.ok(currency && currency.value === "ETH");
  assert.ok(recipient && recipient.value === "0x82b2cce9a52c7e56838a5c46833067f9eb006911");
  assert.ok(cap && cap.value === "10000000000000000");
});

test("post-extension fixture adds gated game actions", () => {
  const mandate = AgentMandateWireSchema.parse(loadMandate("zunno-mandate.post-extension.json"));
  const actions = new Set(mandate.rules.map((rule) => rule.action));
  assert.deepEqual([...actions].sort(), ["DRAW_CARD", "PAYMENT", "PLAY_CARD"]);
  const forbidWild = mandate.rules.find((rule) => rule.ruleId === "forbid-wild-draw-four");
  assert.ok(forbidWild);
});
