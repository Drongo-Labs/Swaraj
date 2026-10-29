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

const appAction = () => parseUnifiedAction(fixture("unified-action-app"));

test("in-mandate app action is permitted via generic param predicates", () => {
  const mandate = parseAgentMandate(fixture("agent-mandate-app"));
  const result = evaluateParsedMandate(mandate, appAction());
  assert.equal(result.decision, "ALLOW");
  assert.equal(result.reason, "PERMIT_MATCH");
  assert.deepEqual(result.matchedPermitRuleIds, ["permit_game_actions"]);
});

test("forbid wins on a named param: wild draw four is blocked", () => {
  const mandate = parseAgentMandate(fixture("agent-mandate-app"));
  const action = appAction();
  action.context.params.cardValue = 108n;
  const result = evaluateParsedMandate(mandate, action);
  assert.equal(result.decision, "BLOCK");
  assert.equal(result.reason, "FORBID_MATCH");
  assert.deepEqual(result.matchedForbidRuleIds, ["forbid_wild_draw_four"]);
});

test("unknown app or action name is denied by default", () => {
  const mandate = parseAgentMandate(fixture("agent-mandate-app"));
  const wrongApp = appAction();
  wrongApp.resource.app = "chess";
  assert.equal(evaluateParsedMandate(mandate, wrongApp).reason, "DEFAULT_DENY");
  const wrongName = appAction();
  wrongName.context.name = "shuffle_deck";
  assert.equal(evaluateParsedMandate(mandate, wrongName).reason, "DEFAULT_DENY");
});

test("param predicate of the wrong type or absent param fails closed", () => {
  const mandate = parseAgentMandate(fixture("agent-mandate-app"));
  const action = appAction();
  action.context.params.cardValue = "eleven"; // string where the forbid expects an integer param
  assert.equal(evaluateParsedMandate(mandate, action).decision, "ALLOW"); // forbid no longer matches; permit does
  delete action.context.params.cardValue;
  assert.equal(evaluateParsedMandate(mandate, action).reason, "PERMIT_MATCH");
  // Cross-action fields stay impossible: a mandate cannot even be written that
  // addresses amount fields on an APP_ACTION rule (fails closed at the schema).
  assert.throws(() =>
    parseAgentMandate({
      ...fixture("agent-mandate-app"),
      rules: [
        {
          ruleId: "a_forbid_param_on_payment",
          effect: "FORBID",
          action: "APP_ACTION",
          predicates: [{ field: "context.amount", operator: "GT", value: "1" }],
        },
      ],
    }),
  );
});
