import assert from "node:assert/strict";
import test from "node:test";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateParsedMandate, z3VerdictsForAction, crossCheckMandateDecision } from "../dist/index.js";
import { RULE_POOL, ACTION_WIRES, ruleSubsets, mandateWindow } from "./helpers.mjs";

/**
 * Z3 dual-engine cross-check over the bounded space: every decision the
 * predicate engine makes must be independently confirmed by Z3 (the same
 * SMT machinery the gateway uses), via one incremental session per action.
 * Any disagreement — or solver failure — fails this test.
 */

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
