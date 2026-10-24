import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  AgentMandateSchema,
  UnifiedActionSchema,
  deserializeUnifiedAction,
  normalizeAgentMandate,
  parseAgentMandate,
  parseUnifiedAction,
  serializeUnifiedAction,
  unifiedActionSigningPayload,
} from "../dist/index.js";

const fixture = (name) => JSON.parse(readFileSync(new URL(`../fixtures/valid/${name}.json`, import.meta.url), "utf8"));

test("unified trade and payment actions parse to typed atomic amounts", () => {
  const trade = parseUnifiedAction(fixture("unified-action-trade"));
  const payment = parseUnifiedAction(fixture("unified-action-payment"));
  assert.equal(trade.action, "SPOT_TRADE");
  assert.equal(trade.context.amount, 10000000n);
  assert.equal(payment.action, "PAYMENT");
  assert.equal(payment.context.amount, 2500000n);
});

test("unified action rejects non-atomic amounts, mismatched shapes, expiry, and unknown keys", () => {
  const trade = fixture("unified-action-trade");
  assert.equal(UnifiedActionSchema.safeParse({ ...trade, context: { ...trade.context, amount: 1.5 } }).success, false);
  assert.equal(UnifiedActionSchema.safeParse({ ...trade, context: { amount: "1", currency: "USD", recipient: "x" } }).success, false);
  assert.equal(UnifiedActionSchema.safeParse({ ...trade, expiry: trade.timestamp }).success, false);
  assert.equal(UnifiedActionSchema.safeParse({ ...trade, extra: true }).success, false);
});

test("serialization is canonical, reversible, and signs no signature field", () => {
  const parsed = parseUnifiedAction(fixture("unified-action-payment"));
  const reordered = parseUnifiedAction({
    signature: parsed.signature,
    expiry: parsed.expiry,
    timestamp: parsed.timestamp,
    policyHash: parsed.policyHash,
    idempotencyKey: parsed.idempotencyKey,
    context: { recipient: parsed.context.recipient, amount: parsed.context.amount.toString(), currency: parsed.context.currency },
    resource: { service: parsed.resource.service },
    action: parsed.action,
    agent: parsed.agent,
    intentId: parsed.intentId,
  });
  assert.equal(serializeUnifiedAction(parsed), serializeUnifiedAction(reordered));
  assert.deepEqual(deserializeUnifiedAction(serializeUnifiedAction(parsed)), parsed);
  assert.equal(unifiedActionSigningPayload(parsed).includes("signature"), false);
});

test("Agent Mandate requires default deny, sorted unique rules, and action-correct fields", () => {
  const raw = fixture("agent-mandate");
  const mandate = parseAgentMandate(raw);
  assert.equal(mandate.defaultEffect, "DENY");
  assert.equal(mandate.rules[0].predicates[0].value, 5000000n);
  assert.equal(AgentMandateSchema.safeParse({ ...raw, defaultEffect: "ALLOW" }).success, false);
  assert.equal(AgentMandateSchema.safeParse({ ...raw, rules: [...raw.rules].reverse() }).success, false);
  const wrongField = structuredClone(raw);
  wrongField.rules[1].predicates = [{ field: "resource.venue", operator: "EQ", value: "x" }];
  assert.equal(AgentMandateSchema.safeParse(wrongField).success, false);
});

test("mandate normalizer sorts rules without mutating input", () => {
  const raw = fixture("agent-mandate");
  const reversed = { ...raw, rules: [...raw.rules].reverse() };
  const normalized = normalizeAgentMandate(reversed);
  assert.notDeepEqual(normalized.rules, reversed.rules);
  assert.ok(AgentMandateSchema.safeParse(normalized).success);
});
