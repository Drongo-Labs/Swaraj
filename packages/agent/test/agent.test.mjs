import assert from "node:assert/strict";
import test from "node:test";
import { GovernedAgent } from "../dist/index.js";

const allow = { outcome: "ALLOW", violatedRuleIds: [] };

/** Wire form: the fake gateway sees { kind, value } proposals directly. */
const spec = (policy, fallback) => ({
  policy,
  toWireAction: (p) => p,
  ...(fallback ? { fallback } : {}),
});

function fakeGateway(byRule, seen = []) {
  return { evaluateUnifiedAction: async (wire) => { seen.push(wire); return byRule(wire); } };
}

test("ALLOW executes through the executor", async () => {
  const log = [];
  const agent = new GovernedAgent({
    client: fakeGateway(() => allow),
    executor: { execute: async (p) => { log.push(p); return { txHash: "0x1" }; } },
    spec: spec("RETRY"),
  });
  const result = await agent.act({ kind: "play", value: 11 });
  assert.equal(result.status, "EXECUTED");
  assert.equal(result.txHash, "0x1");
  assert.deepEqual(log, [{ kind: "play", value: 11 }]);
});

test("ABSTAIN policy never retries or executes on BLOCK", async () => {
  const log = [];
  const agent = new GovernedAgent({
    client: fakeGateway(() => ({ outcome: "BLOCK", violatedRuleIds: ["forbid_over_cap"] })),
    executor: { execute: async (p) => { log.push(p); return { txHash: "0x1" }; } },
    spec: spec("ABSTAIN"),
  });
  const result = await agent.act({ kind: "stake", value: 999 });
  assert.equal(result.status, "ABSTAINED");
  assert.deepEqual(result.violatedRuleIds, ["forbid_over_cap"]);
  assert.deepEqual(log, []);
});

test("RETRY policy falls back to a compliant proposal, still gated", async () => {
  const seen = [];
  const agent = new GovernedAgent({
    client: fakeGateway((w) => (w.value > 104 ? { outcome: "BLOCK", violatedRuleIds: ["forbid_w4"] } : allow), seen),
    executor: { execute: async () => ({ txHash: "0x2" }) },
    spec: spec("RETRY", () => ({ kind: "play", value: 11 })),
    maxFallbacks: 3,
  });
  const result = await agent.act({ kind: "play", value: 108 });
  assert.equal(result.status, "EXECUTED");
  assert.equal(seen.length, 2);
  assert.equal(seen[1].value, 11);
});

test("exhausted retries forfeit; nothing executes without ALLOW", async () => {
  const log = [];
  const agent = new GovernedAgent({
    client: fakeGateway(() => ({ outcome: "BLOCK", violatedRuleIds: ["r1"] })),
    executor: { execute: async (p) => { log.push(p); return { txHash: "0x1" }; } },
    spec: spec("RETRY", () => ({ kind: "play", value: 5 })),
    maxFallbacks: 2,
  });
  const result = await agent.act({ kind: "play", value: 108 });
  assert.equal(result.status, "FORFEITED");
  assert.deepEqual(log, []);
});

test("fallback returning null forfeits (no compliant move left)", async () => {
  const agent = new GovernedAgent({
    client: fakeGateway(() => ({ outcome: "BLOCK", violatedRuleIds: ["r1"] })),
    executor: { execute: async () => ({ txHash: "0x1" }) },
    spec: spec("RETRY", () => null),
  });
  const result = await agent.act({ kind: "play", value: 3 });
  assert.equal(result.status, "FORFEITED");
});

test("fail-closed: unreachable gateway abstains (ABSTAIN) or forfeits (RETRY) — never executes", async () => {
  const log = [];
  const client = { evaluateUnifiedAction: async () => { throw new Error("refused"); } };
  const abstain = new GovernedAgent({ client, executor: { execute: async (p) => { log.push(p); return { txHash: "0x1" }; } }, spec: spec("ABSTAIN") });
  assert.equal((await abstain.act({ kind: "stake", value: 1 })).reason, "GATEWAY_UNAVAILABLE");
  const retry = new GovernedAgent({ client, executor: { execute: async (p) => { log.push(p); return { txHash: "0x1" }; } }, spec: spec("RETRY") });
  assert.equal((await retry.act({ kind: "play", value: 1 })).status, "FORFEITED");
  assert.deepEqual(log, []);
});
