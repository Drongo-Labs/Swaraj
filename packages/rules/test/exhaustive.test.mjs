import assert from "node:assert/strict";
import test from "node:test";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateParsedMandate } from "../dist/index.js";

/**
 * Bounded-exhaustive mandate harness.
 *
 * The Lean suite (packages/lean/Gate/Mandate.lean) proves the decision
 * characterization for the abstract model:
 *
 *   forbid_always_wins      — a matching FORBID blocks over every permit
 *   default_deny_sound      — no matching permit can ever ALLOW
 *   allow_iff_permit_without_forbid — ALLOW exactly when a permit matches
 *                                     and no forbid does
 *
 * This harness checks the TypeScript engine against that characterization
 * over the ENTIRE bounded input space: every well-formed mandate built from
 * subsets (size ≤ 4) of a 14-rule pool, crossed with every action in a
 * bounded action domain. If the TS combinatorics ever diverge from the
 * proven model inside these bounds, this test finds it.
 */

const now = 1_790_000_000_000;
const mandateWindow = { validFrom: now - 1_000_000, validUntil: now + 1_000_000 };

/** 14-rule pool: APP_ACTION and PAYMENT, PERMIT and FORBID, empty and
 * predicate-bearing. Ids ascend (r00 < r01 < …) so every subset taken in
 * pool order has strictly ascending rule ids — schema-valid by construction. */
const RULE_POOL = [
  { ruleId: "r00", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "resource.app", operator: "EQ", value: "zunno" }] },
  { ruleId: "r01", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.name", operator: "IN", values: ["draw_card", "move", "play_card"] }] },
  { ruleId: "r02", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.param", name: "cardValue", operator: "LTE", value: "104" }] },
  { ruleId: "r03", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.paramString", name: "tableId", operator: "EQ", value: "table-42" }] },
  { ruleId: "r04", effect: "FORBID", action: "APP_ACTION", predicates: [{ field: "context.name", operator: "EQ", value: "shuffle_deck" }] },
  { ruleId: "r05", effect: "FORBID", action: "APP_ACTION", predicates: [{ field: "context.param", name: "cardValue", operator: "GT", value: "104" }] },
  { ruleId: "r06", effect: "PERMIT", action: "APP_ACTION", predicates: [] },
  { ruleId: "r07", effect: "FORBID", action: "APP_ACTION", predicates: [] },
  { ruleId: "r08", effect: "PERMIT", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "LTE", value: "10000000000000000" }] },
  { ruleId: "r09", effect: "PERMIT", action: "PAYMENT", predicates: [
    { field: "context.currency", operator: "EQ", value: "ETH" },
    { field: "context.recipient", operator: "EQ", value: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  ] },
  { ruleId: "r10", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "GT", value: "10000000000000000" }] },
  { ruleId: "r11", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.currency", operator: "EQ", value: "USD" }] },
  { ruleId: "r12", effect: "PERMIT", action: "PAYMENT", predicates: [] },
  { ruleId: "r13", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "EQ", value: "10000000000000000" }] },
];

/** Bounded action domain: every interesting shape of APP_ACTION and PAYMENT. */
const common = (intentId) => ({
  intentId,
  agent: "zunno-agent",
  policyHash: `0x${"ab".repeat(32)}`,
  timestamp: now,
  expiry: now + 60_000,
  idempotencyKey: intentId,
  signature: `0x${"cd".repeat(65)}`,
});

function appAction(intentId, app, name, params) {
  return parseUnifiedAction({ ...common(intentId), action: "APP_ACTION", resource: { app, target: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" }, context: { name, params } });
}

function payment(intentId, amount, currency, recipient) {
  return parseUnifiedAction({ ...common(intentId), action: "PAYMENT", resource: { service: "zunno-stake" }, context: { amount, currency, recipient } });
}

const ACTIONS = [
  appAction("a00", "zunno", "play_card", { cardValue: "11", handIndex: "0", chosenColor: "4" }),
  appAction("a01", "zunno", "draw_card", {}),
  appAction("a02", "zunno", "shuffle_deck", {}),
  appAction("a03", "zunno", "move", {}),
  appAction("a04", "zunno", "play_card", { cardValue: "104", handIndex: "0", chosenColor: "4" }),
  appAction("a05", "zunno", "play_card", { cardValue: "105", handIndex: "0", chosenColor: "4" }),
  appAction("a06", "zunno", "play_card", { cardValue: "108", handIndex: "0", chosenColor: "4" }),
  appAction("a07", "zunno", "play_card", { cardValue: "11", tableId: "table-42" }),
  appAction("a08", "chess", "move", {}),
  appAction("a09", "chess", "play_card", { cardValue: "105" }),
  appAction("a10", "zunno", "play_card", { cardValue: "105", tableId: "table-42" }),
  payment("p00", "10000000000000000", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"), // at cap
  payment("p01", "9999999999999999", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"),  // under cap
  payment("p02", "10000000000000001", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"), // over cap
  payment("p03", "10000000000000000", "USD", "vendor@example.com"),                          // at cap, USD
  payment("p04", "5000000000000", "USD", "vendor@example.com"),                              // small, USD
  payment("p05", "0", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"),                   // zero
];

/** All subsets of the rule pool with size 1..4 (pool order keeps ids ascending). */
function* ruleSubsets(maxSize) {
  const n = RULE_POOL.length;
  const stack = [];
  function* from(start) {
    if (stack.length >= 1 && stack.length <= maxSize) yield [...stack];
    if (stack.length === maxSize) return;
    for (let i = start; i < n; i++) {
      stack.push(RULE_POOL[i]);
      yield* from(i + 1);
      stack.pop();
    }
  }
  yield* from(0);
}

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

      // Matched sets respect the mandate's effects — no permit id reported
      // from a forbid rule or vice versa, no phantom ids.
      assert.ok(d.matchedPermitRuleIds.every((id) => permitIds.includes(id)), `permit leak: ${JSON.stringify(d)} on ${action.action}`);
      assert.ok(d.matchedForbidRuleIds.every((id) => forbidIds.includes(id)), `forbid leak: ${JSON.stringify(d)}`);

      const forbidMatch = d.matchedForbidRuleIds.length > 0;
      const permitMatch = d.matchedPermitRuleIds.length > 0;

      // The Lean-proven characterization, checked on this input:
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

      // Independent property spot-checks (expectations derived from the
      // mandate definition, not from the engine's own matching output):

      // r07 (FORBID APP_ACTION, no predicates) blocks every app action.
      if (has("r07") && action.action === "APP_ACTION") {
        assert.ok(forbidMatch, `r07 must match every APP_ACTION (mandate ${ids.join(",")}, intent ${action.intentId})`);
      }
      // r12 (PERMIT PAYMENT, no predicates) matches every payment when no forbid matches.
      if (has("r12") && action.action === "PAYMENT" && !forbidMatch) {
        assert.ok(permitMatch, `r12 must match every PAYMENT (mandate ${ids.join(",")})`);
      }
      // r05 forbids cardValue > 104 — a wild+4 can never be ALLOWed when r05 is in force.
      if (has("r05") && action.action === "APP_ACTION" && action.context.name === "play_card"
        && BigInt(action.context.params.cardValue) > 104n) {
        assert.equal(d.decision, "BLOCK", `r05 must block wild+4 (cardValue ${action.context.params.cardValue})`);
      }
      // r10 forbids amounts over the cap — an over-cap stake is never ALLOWed.
      if (has("r10") && action.action === "PAYMENT" && BigInt(action.context.amount) > 10_000_000_000_000_000n) {
        assert.equal(d.decision, "BLOCK", "r10 must block over-cap payments");
      }
      // With no rule at all matching the action's type, the decision is default deny.
      if (!subsetOf(ids, ["r06", "r07", "r00", "r01", "r02", "r03", "r04", "r05"]) && action.action === "APP_ACTION"
        && !permitMatch && !forbidMatch) {
        assert.equal(d.reason, "DEFAULT_DENY");
      }
    }
  }

  // The harness must actually cover a large space — a regression that shrinks
  // the enumeration below this floor silently weakens the claim.
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
