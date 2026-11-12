import assert from "node:assert/strict";
import test from "node:test";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateParsedMandate, z3VerdictsForAction, crossCheckMandateDecision } from "../dist/index.js";
import { RULE_POOL, ACTION_WIRES, ruleSubsets, mandateWindow, appAction, payment, now } from "./helpers.mjs";

/** Every bounded decision must be confirmed by Z3. Disagreement or solver failure fails the test. */

const ACTIONS = ACTION_WIRES.map((wire, i) => parseUnifiedAction({ ...wire, intentId: `z3_${i}`, idempotencyKey: `z3_${i}` }));
const MANDATES = [...ruleSubsets(3)].map((rules, i) => parseAgentMandate({
  mandateId: `m_z3_${i}`,
  version: 1,
  agent: "*",
  defaultEffect: "DENY",
  ...mandateWindow,
  rules,
}));

test("z3 cross-check: predicate engine and Z3 agree on the full bounded space (subsets ≤ 3)", async () => {
  let cases = 0;
  let allows = 0;
  for (const action of ACTIONS) {
    const verdicts = await z3VerdictsForAction(action, MANDATES);
    for (const [i, mandate] of MANDATES.entries()) {
      const decision = evaluateParsedMandate(mandate, action);
      cases++;
      assert.equal(
        verdicts[i],
        decision.decision,
        `engines disagree on ${mandate.rules.map((r) => r.ruleId).join(",")} × ${action.intentId}`,
      );
      if (verdicts[i] === "ALLOW") allows++;
    }
  }
  assert.ok(cases >= 7_000, `enumeration too small: ${cases}`);
  console.log(`z3 cross-check: ${cases} dual-engine cases, ${allows} ALLOW, all agree`);
});

test("z3 cross-check: the forbidden Wild+4 is BLOCK by both engines", async () => {
  const mandate = parseAgentMandate({
    mandateId: "m_w4",
    version: 1,
    agent: "*",
    defaultEffect: "DENY",
    ...mandateWindow,
    rules: [RULE_POOL[1], RULE_POOL[5]],
  });
  const wildFour = parseUnifiedAction(ACTION_WIRES[5]);
  const { decision, z3, agree } = await crossCheckMandateDecision(mandate, wildFour);
  assert.ok(agree);
  assert.equal(decision.decision, "BLOCK");
  assert.equal(z3, "BLOCK");
});

test("z3 cross-check: bool params, resource.service, typed params, window and subject agree with the engine", async () => {
  const mandate = (rules, extra = {}) => parseAgentMandate({
    mandateId: "m_fields", version: 1, agent: "*", defaultEffect: "DENY", ...mandateWindow, rules, ...extra,
  });
  const onTurnPermit = { ruleId: "p_on_turn", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.paramBool", name: "onTurn", operator: "EQ", value: true }] };
  const wagerPermit = { ruleId: "p_wager", effect: "PERMIT", action: "PAYMENT", predicates: [{ field: "resource.service", operator: "EQ", value: "zunno-stake" }] };
  const numPermit = { ruleId: "p_num", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.param", name: "onTurn", operator: "EQ", value: "1" }] };
  const onTurn = parseUnifiedAction(appAction("b0", "zunno", "play_card", { onTurn: true }));
  const offTurn = parseUnifiedAction(appAction("b1", "zunno", "play_card", { onTurn: false }));
  const pay = parseUnifiedAction(payment("b2", "1", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"));
  const cases = [
    [mandate([onTurnPermit]), onTurn, "ALLOW"],
    [mandate([onTurnPermit]), offTurn, "BLOCK"],
    [mandate([wagerPermit]), pay, "ALLOW"],
    [mandate([numPermit]), onTurn, "BLOCK"], // a bool param never matches a numeric predicate
    [mandate([onTurnPermit], { agent: "someone-else" }), onTurn, "BLOCK"],
    [mandate([onTurnPermit], { validFrom: now + 1_000, validUntil: now + 2_000 }), onTurn, "BLOCK"],
  ];
  for (const [m, action, expected] of cases) {
    const { decision, z3, agree } = await crossCheckMandateDecision(m, action);
    assert.equal(decision.decision, expected, action.intentId);
    assert.ok(agree, `${action.intentId}: engine ${decision.decision}, z3 ${z3}`);
  }
});
