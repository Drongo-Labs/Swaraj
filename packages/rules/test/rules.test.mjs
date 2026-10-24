import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateMandate, evaluateParsedMandate } from "../dist/index.js";

const fixture = (name) => JSON.parse(readFileSync(new URL(`../../schemas/fixtures/valid/${name}.json`, import.meta.url), "utf8"));
const mandate = () => parseAgentMandate(fixture("agent-mandate"));
const trade = () => parseUnifiedAction(fixture("unified-action-trade"));
const payment = () => parseUnifiedAction(fixture("unified-action-payment"));

test("matching permit allows an in-mandate trade", () => {
  const result = evaluateParsedMandate(mandate(), trade());
  assert.deepEqual(result, {
    decision: "ALLOW",
    reason: "PERMIT_MATCH",
    matchedRuleIds: ["permit_trade"],
    matchedPermitRuleIds: ["permit_trade"],
    matchedForbidRuleIds: [],
  });
});

test("oversized trade is blocked by default deny when its permit no longer matches", () => {
  const action = trade();
  action.context.amount = 600000000n;
  const result = evaluateParsedMandate(mandate(), action);
  assert.equal(result.decision, "BLOCK");
  assert.equal(result.reason, "DEFAULT_DENY");
  assert.deepEqual(result.matchedRuleIds, []);
});

test("forbid always wins when a broad permit also matches", () => {
  const action = payment();
  action.context.amount = 6000000n;
  const result = evaluateParsedMandate(mandate(), action);
  assert.equal(result.decision, "BLOCK");
  assert.equal(result.reason, "FORBID_MATCH");
  assert.deepEqual(result.matchedForbidRuleIds, ["forbid_large_payment"]);
  assert.deepEqual(result.matchedPermitRuleIds, ["permit_payment"]);
  assert.deepEqual(result.matchedRuleIds, ["forbid_large_payment"]);
});

test("valid but unmatched actions are denied by default", () => {
  const action = payment();
  action.context.currency = "EUR";
  const result = evaluateParsedMandate(mandate(), action);
  assert.equal(result.reason, "DEFAULT_DENY");
});

test("inactive, wrong-subject, and malformed inputs fail closed", () => {
  const action = trade();
  const inactive = { ...mandate(), validUntil: action.timestamp };
  assert.equal(evaluateParsedMandate(inactive, action).reason, "MANDATE_INACTIVE");
  assert.equal(evaluateParsedMandate({ ...mandate(), agent: "agent:other" }, action).reason, "SUBJECT_MISMATCH");
  assert.equal(evaluateMandate({}, fixture("unified-action-trade")).reason, "INVALID_MANDATE");
  assert.equal(evaluateMandate(fixture("agent-mandate"), {}).reason, "INVALID_ACTION");
});
