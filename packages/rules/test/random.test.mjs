import assert from "node:assert/strict";
import test from "node:test";
import { parseAgentMandate, parseUnifiedAction } from "@swaraj/schemas";
import { evaluateParsedMandate, ruleMatches } from "../dist/index.js";

/**
 * Random mandates and actions checked against the decision the Lean suite
 * proves (Gate/Mandate.lean): ALLOW exactly when a permit matches and no
 * forbid does. A failure prints the seed; set SWARAJ_RANDOM_SEED to replay it.
 */

const seed = Number(process.env.SWARAJ_RANDOM_SEED ?? Date.now() % 2147483647);
const CASES = Number(process.env.SWARAJ_RANDOM_CASES ?? 20000);
const now = 1_790_000_000_000;

// ponytail: mulberry32, a seeded PRNG so failures replay; quality only needs to be test-grade.
let state = seed;
function random() {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (items) => items[Math.floor(random() * items.length)];
const upTo = (n) => Math.floor(random() * n);

const SERVICES = ["stripe", "near_transfer", "near_ft_transfer"];
const CURRENCIES = ["USD", "NEAR", "USDC"];
const RECIPIENTS = ["vendor.near", "evil.near", "acct_1"];
const VENUES = ["REF_FINANCE_NEAR", "UNISWAP_V3_BASE"];
const AMOUNTS = ["0", "1", "99", "100", "101", "340282366920938463463374607431768211456"];

function paymentPredicate() {
  return pick([
    () => ({ field: "context.amount", operator: pick(["EQ", "LT", "LTE", "GT", "GTE"]), value: pick(AMOUNTS) }),
    () => ({ field: "resource.service", operator: "EQ", value: pick(SERVICES) }),
    () => ({ field: "context.currency", operator: "IN", values: [...new Set([pick(CURRENCIES), pick(CURRENCIES)])].sort() }),
    () => ({ field: "context.recipient", operator: "EQ", value: pick(RECIPIENTS) }),
    () => ({ field: "agent", operator: "EQ", value: pick(["agent:a", "agent:b"]) }),
    () => ({ field: "timestamp", operator: pick(["LT", "GTE"]), value: now + upTo(3) }),
  ])();
}

function tradePredicate() {
  return pick([
    () => ({ field: "context.amount", operator: pick(["LT", "GT"]), value: pick(AMOUNTS) }),
    () => ({ field: "resource.venue", operator: "IN", values: [...new Set([pick(VENUES), pick(VENUES)])].sort() }),
    () => ({ field: "context.slippageBps", operator: pick(["LTE", "GT"]), value: upTo(100) }),
  ])();
}

function randomMandate() {
  const rules = Array.from({ length: upTo(7) }, (_, i) => {
    const action = pick(["PAYMENT", "SPOT_TRADE"]);
    const make = action === "PAYMENT" ? paymentPredicate : tradePredicate;
    return {
      ruleId: `r${String(i).padStart(2, "0")}`,
      effect: pick(["PERMIT", "FORBID"]),
      action,
      predicates: Array.from({ length: upTo(3) }, make),
    };
  });
  return parseAgentMandate({ mandateId: "random", version: 1, agent: "*", defaultEffect: "DENY", validFrom: now - 10, validUntil: now + 10, rules });
}

function randomAction(i) {
  const shared = {
    intentId: `random_${i}`,
    agent: pick(["agent:a", "agent:b"]),
    policyHash: `0x${"ab".repeat(32)}`,
    timestamp: now + upTo(3),
    expiry: now + 60_000,
    idempotencyKey: `random_${i}`,
    signature: `0x${"cd".repeat(65)}`,
  };
  return parseUnifiedAction(random() < 0.5
    ? { ...shared, action: "PAYMENT", resource: { service: pick(SERVICES) }, context: { amount: pick(AMOUNTS), currency: pick(CURRENCIES), recipient: pick(RECIPIENTS) } }
    : { ...shared, action: "SPOT_TRADE", resource: { venue: pick(VENUES) }, context: { amount: pick(AMOUNTS), assetIn: "usdc", assetOut: "wnear", slippageBps: upTo(100) } });
}

test(`random mandates match the Lean-proved decision (seed ${seed})`, () => {
  let allowed = 0;
  for (let i = 0; i < CASES; i += 1) {
    const mandate = randomMandate();
    const action = randomAction(i);
    const decision = evaluateParsedMandate(mandate, action);
    const matching = mandate.rules.filter((rule) => ruleMatches(action, rule));
    const anyForbid = matching.some((rule) => rule.effect === "FORBID");
    const anyPermit = matching.some((rule) => rule.effect === "PERMIT");
    const context = `seed ${seed}, case ${i}`;
    assert.equal(decision.decision === "ALLOW", anyPermit && !anyForbid, context);
    assert.equal(decision.reason, anyForbid ? "FORBID_MATCH" : anyPermit ? "PERMIT_MATCH" : "DEFAULT_DENY", context);
    if (decision.decision === "ALLOW") allowed += 1;
  }
  // A generator that only ever blocks would prove nothing.
  assert.ok(allowed > CASES / 50, `only ${allowed} of ${CASES} cases allowed`);
});
