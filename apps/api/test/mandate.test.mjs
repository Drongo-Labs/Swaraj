import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import {
  createMandatePolicyGate,
  agentMandateFromPolicyProfile,
  DEMO_POLICY,
  DEMO_STATE,
  DEMO_ALLOW_INTENT,
  DEMO_BLOCK_INTENT,
} from "../dist/pipeline/index.js";

const signer = new LocalKeySigner("0x" + "11".repeat(32));

/** Spy base gateway: records calls, returns a fixed ALLOW decision. */
function spyBase(decision = "ALLOW") {
  const calls = [];
  const baseDecision = {
    intentHash: "0x" + "a".repeat(64),
    policyHash: "0x" + "b".repeat(64),
    stateHash: "0x" + "c".repeat(64),
    policyVersion: 1,
    decision,
    solverStatus: decision === "BLOCK" ? "unsat" : "sat",
    violatedRuleIds: decision === "BLOCK" ? [7] : [],
    violations: decision === "BLOCK" ? [{ ruleId: 7, reason: "amount exceeds the per-action limit" }] : [],
  };
  return {
    calls,
    async check(input) {
      calls.push(input);
      return { ...baseDecision };
    },
  };
}

function gate(base) {
  return createMandatePolicyGate({ base, signer });
}

test("oversized trade is blocked by the mandate FORBID rule on top of the SMT decision", async () => {
  const base = spyBase("BLOCK");
  const decision = await gate(base).check({
    intent: { ...DEMO_BLOCK_INTENT },
    policy: { ...DEMO_POLICY },
    state: { ...DEMO_STATE },
  });
  assert.equal(decision.decision, "BLOCK");
  assert.match(decision.violations[0].reason, /MANDATE:FORBID_MATCH/);
  assert.match(decision.violations[0].reason, /forbid_trade_amount/);
  // SMT decision fields (solverStatus, rule ids, decision log anchor) are preserved.
  assert.equal(decision.solverStatus, "unsat");
  assert.deepEqual(decision.violatedRuleIds, [7]);
  assert.equal(decision.violations.length, 2, "mandate reason + SMT reason");
  assert.equal(base.calls.length, 1);
});

test("compliant trade is permitted by the mandate and keeps the SMT ALLOW", async () => {
  const base = spyBase("ALLOW");
  const decision = await gate(base).check({
    intent: { ...DEMO_ALLOW_INTENT },
    policy: { ...DEMO_POLICY },
    state: { ...DEMO_STATE },
  });
  assert.equal(decision.decision, "ALLOW");
  assert.deepEqual(decision.violations, []);
  assert.equal(base.calls.length, 1);
});

test("unknown venue has no matching permit: default deny, layered on the SMT decision", async () => {
  const base = spyBase("ALLOW");
  const decision = await gate(base).check({
    intent: { ...DEMO_ALLOW_INTENT, venue: "SUSPICIOUS_CEX" },
    policy: { ...DEMO_POLICY },
    state: { ...DEMO_STATE },
  });
  assert.equal(decision.decision, "BLOCK");
  assert.match(decision.violations[0].reason, /MANDATE:DEFAULT_DENY/);
  // SMT said ALLOW; the mandate is what blocked — solverStatus stays honest.
  assert.equal(decision.solverStatus, "sat");
  assert.deepEqual(decision.violatedRuleIds, []);
});

test("malformed intent cannot be represented as a unified action: fail closed", async () => {
  const base = spyBase("ALLOW");
  const decision = await gate(base).check({
    intent: { nonsense: true },
    policy: { ...DEMO_POLICY },
    state: { ...DEMO_STATE },
  });
  assert.equal(decision.decision, "BLOCK");
  assert.match(decision.violations[0].reason, /MANDATE:INVALID_ACTION/);
});

test("malformed policy yields a mandate with no permits: default deny", async () => {
  const base = spyBase("ALLOW");
  const decision = await gate(base).check({
    intent: { ...DEMO_ALLOW_INTENT },
    policy: { paused: "yes" },
    state: { ...DEMO_STATE },
  });
  assert.equal(decision.decision, "BLOCK");
  assert.match(decision.violations[0].reason, /MANDATE:DEFAULT_DENY|MANDATE:INVALID_MANDATE/);
});

test("mandate BLOCK preserves the base gateway's decision hashes and id", async () => {
  const base = spyBase("ALLOW");
  base.check = async (input) => {
    base.calls.push(input);
    return {
      intentHash: "0x" + "a".repeat(64),
      policyHash: "0x" + "b".repeat(64),
      stateHash: "0x" + "c".repeat(64),
      policyVersion: 1,
      decision: "ALLOW",
      solverStatus: "sat",
      violatedRuleIds: [],
      violations: [],
      decisionId: "decision-42",
    };
  };
  const decision = await gate(base).check({
    intent: { ...DEMO_BLOCK_INTENT },
    policy: { ...DEMO_POLICY },
    state: { ...DEMO_STATE },
  });
  assert.equal(decision.intentHash, "0x" + "a".repeat(64));
  assert.equal(decision.policyHash, "0x" + "b".repeat(64));
  assert.equal(decision.stateHash, "0x" + "c".repeat(64));
  assert.equal(decision.decisionId, "decision-42");
});

test("derived mandate mirrors the policy profile caps", () => {
  const mandate = agentMandateFromPolicyProfile({ ...DEMO_POLICY });
  assert.equal(mandate.defaultEffect, "DENY");
  const ruleIds = mandate.rules.map((rule) => rule.ruleId);
  assert.deepEqual(ruleIds, [...ruleIds].sort(), "rule ids must be ascending");
  const forbidAmount = mandate.rules.find((rule) => rule.ruleId === "forbid_trade_amount");
  assert.equal(forbidAmount.predicates[0].value, DEMO_POLICY.maxAmountPerAction);
  const permit = mandate.rules.find((rule) => rule.ruleId === "permit_trade_venue");
  assert.deepEqual(permit.predicates[0].values, [...DEMO_POLICY.allowedVenues]);
});
