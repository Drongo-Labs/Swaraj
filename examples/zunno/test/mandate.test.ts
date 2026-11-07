import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AgentMandateWireSchema } from "../src/swaraj/mandateSchema.js";

const here = dirname(fileURLToPath(import.meta.url));

function loadMandate(): unknown {
  return JSON.parse(readFileSync(join(here, "..", "mandate", "zunno-mandate.json"), "utf-8"));
}

test("mandate fixture is well-formed against the real Agent Mandate wire shape", () => {
  const parsed = AgentMandateWireSchema.parse(loadMandate());
  assert.equal(parsed.mandateId, "zunno_mandate_v1");
  assert.equal(parsed.defaultEffect, "DENY");
  assert.equal(parsed.agent, "zunno-agent");
  assert.ok(parsed.rules.length >= 4);
  const actions = new Set(parsed.rules.map((rule) => rule.action));
  assert.deepEqual([...actions].sort(), ["APP_ACTION", "PAYMENT"]);
});

test("game actions are permitted by app+name, wild draw four forbidden by param", () => {
  const mandate = AgentMandateWireSchema.parse(loadMandate());
  const permit = mandate.rules.find((rule) => rule.ruleId === "a_permit_game_actions");
  const forbid = mandate.rules.find((rule) => rule.ruleId === "a_forbid_wild_draw_four");
  assert.ok(permit && forbid);
  assert.equal(permit.action, "APP_ACTION");
  const app = permit.predicates.find((p) => p.field === "resource.app" && "value" in p);
  const names = permit.predicates.find((p) => p.field === "context.name" && "values" in p);
  assert.ok(app && "value" in app && app.value === "zunno");
  assert.ok(names && "values" in names && names.values.includes("play_card") && names.values.includes("draw_card"));
  const param = forbid.predicates.find((p) => p.field === "context.param");
  assert.ok(param && "name" in param && param.name === "cardValue" && param.value === "104");
});

test("stake rules pin ETH, the game contract, and a cap", () => {
  const mandate = AgentMandateWireSchema.parse(loadMandate());
  const permit = mandate.rules.find((rule) => rule.ruleId === "permit_stake_eth_in_cap");
  const forbid = mandate.rules.find((rule) => rule.ruleId === "forbid_stake_over_cap");
  assert.ok(permit && forbid);
  const currency = permit.predicates.find((p) => p.field === "context.currency" && "value" in p);
  const recipient = permit.predicates.find((p) => p.field === "context.recipient" && "value" in p);
  const cap = permit.predicates.find((p) => p.field === "context.amount" && "value" in p);
  assert.ok(currency && "value" in currency && currency.value === "ETH");
  assert.ok(recipient && "value" in recipient && recipient.value === "0x82b2cce9a52c7e56838a5c46833067f9eb006911");
  assert.ok(cap && "value" in cap && cap.value === "10000000000000000");
});
