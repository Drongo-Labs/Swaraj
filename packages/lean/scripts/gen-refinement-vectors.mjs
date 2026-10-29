#!/usr/bin/env node
/**
 * Generates the mandate refinement vectors: enumerates the bounded space
 * (every well-formed mandate from subsets of the 14-rule pool, size <= 3,
 * crossed with the bounded action domain), evaluates EVERY case with the
 * REAL TypeScript engine (@swaraj/rules evaluateParsedMandate), and emits
 * the space + expectations. The sync script (sync-refinement.mjs) turns
 * this into Gate/Refinement.lean, where the Lean kernel checks
 * Gate.decideConcrete against every recorded outcome — the machine-checked
 * Lean <=> TS correspondence over the entire bounded space.
 *
 * Run: node scripts/gen-refinement-vectors.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAgentMandate, parseUnifiedAction } from "../../schemas/dist/index.js";
import { evaluateParsedMandate } from "../../rules/dist/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "..", "..", "proofs", "vectors");

const now = 1_790_000_000_000;
const mandateWindow = { validFrom: now - 1_000_000, validUntil: now + 1_000_000 };

/** CPred encodings mirror Gate.CPred exactly. */
const RULE_POOL = [
  { ruleId: "r00", effect: "PERMIT", action: "APP_ACTION", preds: [{ k: "appEq", v: "zunno" }] },
  { ruleId: "r01", effect: "PERMIT", action: "APP_ACTION", preds: [{ k: "nameIn", vs: ["draw_card", "move", "play_card"] }] },
  { ruleId: "r02", effect: "PERMIT", action: "APP_ACTION", preds: [{ k: "paramLte", n: "cardValue", v: 104 }] },
  { ruleId: "r03", effect: "PERMIT", action: "APP_ACTION", preds: [{ k: "paramStringEq", n: "tableId", v: "table-42" }] },
  { ruleId: "r04", effect: "FORBID", action: "APP_ACTION", preds: [{ k: "nameEq", v: "shuffle_deck" }] },
  { ruleId: "r05", effect: "FORBID", action: "APP_ACTION", preds: [{ k: "paramGt", n: "cardValue", v: 104 }] },
  { ruleId: "r06", effect: "PERMIT", action: "APP_ACTION", preds: [] },
  { ruleId: "r07", effect: "FORBID", action: "APP_ACTION", preds: [] },
  { ruleId: "r08", effect: "PERMIT", action: "PAYMENT", preds: [{ k: "amountLte", v: 10000000000000000 }] },
  {
    ruleId: "r09", effect: "PERMIT", action: "PAYMENT",
    preds: [{ k: "currencyEq", v: "ETH" }, { k: "recipientEq", v: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" }],
  },
  { ruleId: "r10", effect: "FORBID", action: "PAYMENT", preds: [{ k: "amountGt", v: 10000000000000000 }] },
  { ruleId: "r11", effect: "FORBID", action: "PAYMENT", preds: [{ k: "currencyEq", v: "USD" }] },
  { ruleId: "r12", effect: "PERMIT", action: "PAYMENT", preds: [] },
  { ruleId: "r13", effect: "FORBID", action: "PAYMENT", preds: [{ k: "amountEq", v: 10000000000000000 }] },
];

/** Wire-form predicates for schema parsing (same space as exhaustive.test.mjs). */
function wirePredicate(p) {
  switch (p.k) {
    case "appEq": return { field: "resource.app", operator: "EQ", value: p.v };
    case "nameEq": return { field: "context.name", operator: "EQ", value: p.v };
    case "nameIn": return { field: "context.name", operator: "IN", values: p.vs };
    case "paramLte": return { field: "context.param", name: p.n, operator: "LTE", value: String(p.v) };
    case "paramGt": return { field: "context.param", name: p.n, operator: "GT", value: String(p.v) };
    case "paramStringEq": return { field: "context.paramString", name: p.n, operator: "EQ", value: p.v };
    case "amountLte": return { field: "context.amount", operator: "LTE", value: String(p.v) };
    case "amountGt": return { field: "context.amount", operator: "GT", value: String(p.v) };
    case "amountEq": return { field: "context.amount", operator: "EQ", value: String(p.v) };
    case "currencyEq": return { field: "context.currency", operator: "EQ", value: p.v };
    case "recipientEq": return { field: "context.recipient", operator: "EQ", value: p.v };
  }
}

const ACTIONS = [
  { kind: true,  app: "zunno", name: "play_card",   params: { cardValue: "11", handIndex: "0", chosenColor: "4" }, sparams: {} },
  { kind: true,  app: "zunno", name: "draw_card",   params: {}, sparams: {} },
  { kind: true,  app: "zunno", name: "shuffle_deck", params: {}, sparams: {} },
  { kind: true,  app: "zunno", name: "move",        params: {}, sparams: {} },
  { kind: true,  app: "zunno", name: "play_card",   params: { cardValue: "104", handIndex: "0", chosenColor: "4" }, sparams: {} },
  { kind: true,  app: "zunno", name: "play_card",   params: { cardValue: "105", handIndex: "0", chosenColor: "4" }, sparams: {} },
  { kind: true,  app: "zunno", name: "play_card",   params: { cardValue: "108", handIndex: "0", chosenColor: "4" }, sparams: {} },
  { kind: true,  app: "zunno", name: "play_card",   params: { cardValue: "11" }, sparams: { tableId: "table-42" } },
  { kind: true,  app: "chess", name: "move",        params: {}, sparams: {} },
  { kind: true,  app: "chess", name: "play_card",   params: { cardValue: "105" }, sparams: {} },
  { kind: true,  app: "zunno", name: "play_card",   params: { cardValue: "105" }, sparams: { tableId: "table-42" } },
  { kind: false, amount: "10000000000000000", currency: "ETH", recipient: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  { kind: false, amount: "9999999999999999",  currency: "ETH", recipient: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  { kind: false, amount: "10000000000000001", currency: "ETH", recipient: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  { kind: false, amount: "10000000000000000", currency: "USD", recipient: "vendor@example.com" },
  { kind: false, amount: "5000000000000",     currency: "USD", recipient: "vendor@example.com" },
  { kind: false, amount: "0",                 currency: "ETH", recipient: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
];

function wireAction(a, i) {
  const common = {
    intentId: `refinement_${i}`,
    agent: "zunno-agent",
    policyHash: `0x${"ab".repeat(32)}`,
    timestamp: now,
    expiry: now + 60_000,
    idempotencyKey: `refinement_${i}`,
    signature: `0x${"cd".repeat(65)}`,
  };
  return a.kind
    ? { ...common, action: "APP_ACTION", resource: { app: a.app, target: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" }, context: { name: a.name, params: a.params } }
    : { ...common, action: "PAYMENT", resource: { service: "zunno-stake" }, context: { amount: a.amount, currency: a.currency, recipient: a.recipient } };
}

function* subsets(n, maxSize) {
  const stack = [];
  function* from(start) {
    if (stack.length >= 1 && stack.length <= maxSize) yield [...stack];
    if (stack.length === maxSize) return;
    for (let i = start; i < n; i++) {
      stack.push(i);
      yield* from(i + 1);
      stack.pop();
    }
  }
  yield* from(0);
}

const mandates = [...subsets(RULE_POOL.length, 3)];
const cases = [];
const parsedActions = ACTIONS.map((a, i) => parseUnifiedAction(wireAction(a, i)));

for (const [mIdx, ruleIdxs] of mandates.entries()) {
  const mandate = parseAgentMandate({
    mandateId: "m_refinement",
    version: 1,
    agent: "*",
    defaultEffect: "DENY",
    ...mandateWindow,
    rules: ruleIdxs.map((i) => ({
      ruleId: RULE_POOL[i].ruleId,
      effect: RULE_POOL[i].effect,
      action: RULE_POOL[i].action,
      predicates: RULE_POOL[i].preds.map(wirePredicate),
    })),
  });
  for (const [aIdx, action] of parsedActions.entries()) {
    const decision = evaluateParsedMandate(mandate, action);
    cases.push([mIdx, aIdx, decision.decision === "ALLOW" ? "allow" : "block"]);
  }
}

const file = {
  domain: "swaraj/mandate-refinement-vectors/v1",
  rules: RULE_POOL,
  actions: ACTIONS,
  mandates,
  cases,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "mandate-refinement.json"), JSON.stringify(file));
console.log(`mandate-refinement.json: ${mandates.length} mandates x ${ACTIONS.length} actions = ${cases.length} cases`);
