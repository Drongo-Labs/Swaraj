import assert from "node:assert/strict";
import test from "node:test";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateParsedMandate } from "../dist/index.js";
import { RULE_POOL, ACTION_WIRES, ruleSubsets, mandateWindow } from "./helpers.mjs";

/** Checks the TS engine against the Lean characterization over the whole bounded space. */

const ACTIONS = ACTION_WIRES.map((wire, i) => parseUnifiedAction({ ...wire, intentId: `ex_${i}`, idempotencyKey: `ex_${i}` }));

const subsetOf = (ids, superset) => ids.every((id) => superset.includes(id));

test("bounded-exhaustive: TS decision combinatorics match the Lean characterization over the full bounded space", () => {
  let cases = 0;
  let allows = 0;
  let forbids = 0;
  let denies = 0;

  for (const rules of ruleSubsets(4)) {
    const mandate = parseAgentMandate({
      mandateId: "m_exhaustive",
      version: 1,
      agent: "*",
      defaultEffect: "DENY",
      ...mandateWindow,
      rules,
    });
    const permitIds = rules.filter((r) => r.effect === "PERMIT").map((r) => r.ruleId);
    const forbidIds = rules.filter((r) => r.effect === "FORBID").map((r) => r.ruleId);
    const ids = rules.map((r) => r.ruleId);
    const has = (id) => ids.includes(id);

    for (const action of ACTIONS) {
      const d = evaluateParsedMandate(mandate, action);
      cases++;

      assert.ok(d.matchedPermitRuleIds.every((id) => permitIds.includes(id)), `permit leak: ${JSON.stringify(d)}`);
      assert.ok(d.matchedForbidRuleIds.every((id) => forbidIds.includes(id)), `forbid leak: ${JSON.stringify(d)}`);

      const forbidMatch = d.matchedForbidRuleIds.length > 0;
      const permitMatch = d.matchedPermitRuleIds.length > 0;

      if (forbidMatch) {
        forbids++;
        assert.equal(d.decision, "BLOCK", "forbid always wins");
        assert.equal(d.reason, "FORBID_MATCH");
        assert.deepEqual([...d.matchedRuleIds].sort(), [...d.matchedForbidRuleIds].sort());
      } else if (permitMatch) {
        allows++;
        assert.equal(d.decision, "ALLOW", "permit without forbid allows");
        assert.equal(d.reason, "PERMIT_MATCH");
        assert.deepEqual([...d.matchedRuleIds].sort(), [...d.matchedPermitRuleIds].sort());
      } else {
        denies++;
        assert.equal(d.decision, "BLOCK", "default deny");
        assert.equal(d.reason, "DEFAULT_DENY");
        assert.deepEqual(d.matchedRuleIds, []);
      }

      // Independent property checks (expectations derived from the mandate
      // definition, not the engine's own matching output):
      if (has("r07") && action.action === "APP_ACTION") {
        assert.ok(forbidMatch, `r07 must match every APP_ACTION (mandate ${ids.join(",")})`);
      }
      if (has("r12") && action.action === "PAYMENT" && !forbidMatch) {
        assert.ok(permitMatch, `r12 must match every PAYMENT (mandate ${ids.join(",")})`);
      }
      if (has("r05") && action.action === "APP_ACTION" && action.context.name === "play_card"
        && BigInt(action.context.params.cardValue) > 104n) {
        assert.equal(d.decision, "BLOCK", "r05 must block wild+4");
      }
      if (has("r10") && action.action === "PAYMENT" && BigInt(action.context.amount) > 10_000_000_000_000_000n) {
        assert.equal(d.decision, "BLOCK", "r10 must block over-cap payments");
      }
      if (!subsetOf(ids, ["r06", "r07", "r00", "r01", "r02", "r03", "r04", "r05"]) && action.action === "APP_ACTION"
        && !permitMatch && !forbidMatch) {
        assert.equal(d.reason, "DEFAULT_DENY");
      }
    }
  }

  assert.ok(cases >= 20_000, `enumeration too small: ${cases}`);
  assert.ok(allows > 1_000 && forbids > 1_000 && denies > 1_000, `unbalanced enumeration: ${allows}/${forbids}/${denies}`);
  console.log(`bounded-exhaustive: ${cases} cases (${allows} ALLOW, ${forbids} FORBID_MATCH, ${denies} DEFAULT_DENY) across ${ACTIONS.length} actions`);
});

test("bounded-exhaustive: empty rule set always default-denies", () => {
  const mandate = parseAgentMandate({
    mandateId: "m_empty",
    version: 1,
    agent: "*",
    defaultEffect: "DENY",
    ...mandateWindow,
    rules: [],
  });
  for (const action of ACTIONS) {
    const d = evaluateParsedMandate(mandate, action);
    assert.equal(d.decision, "BLOCK");
    assert.equal(d.reason, "DEFAULT_DENY");
  }
});
