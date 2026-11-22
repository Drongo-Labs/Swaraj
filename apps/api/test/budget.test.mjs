/** Per-agent PAYMENT/REFUND budgets (Ayush SHARED_BUDGETS_PLAN). */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { buildApp } from "../dist/app.js";

const token = "development-test-token-at-least-32-characters";
const approverToken = "approver-test-token-at-least-32-characters";
const agent = { authorization: `Bearer ${token}` };
const human = { authorization: `Bearer ${approverToken}` };

const mandateBody = (budgets, version = 1, { approvalOver } = {}) => ({
  mandateId: "mandate_budget",
  version,
  agent: "*",
  defaultEffect: "DENY",
  validFrom: Date.now() - 1000,
  validUntil: Date.now() + 3_600_000,
  rules: [
    { ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] },
    ...(approvalOver
      ? [
          {
            ruleId: "review_large",
            effect: "REQUIRE_APPROVAL",
            action: "PAYMENT",
            predicates: [{ field: "context.amount", operator: "GT", value: approvalOver }],
          },
        ]
      : []),
  ],
  ...(budgets ? { budgets } : {}),
});

function payment(amount, overrides = {}) {
  const now = Date.now();
  return {
    intentId: "intent_budget",
    agent: "agent:treasury",
    action: "PAYMENT",
    resource: { service: "near_transfer" },
    context: { amount, currency: "USDC", recipient: "vendor.testnet" },
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `budget-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
    ...overrides,
  };
}

async function harness(options = {}) {
  const applicationId = `app_${randomUUID().slice(0, 8)}`;
  const calls = [];
  let clock = options.clockMs ?? Date.now();
  const app = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: "",
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
    approverToken,
    nowMs: () => clock,
    settler: {
      live: true,
      handles: () => true,
      settle: async (...args) => {
        calls.push(args);
        return { status: "FINAL", evidenceDigest: "0x" + "cd".repeat(32), txHash: "0x01" };
      },
    },
  });
  const base = `/v1/applications/${applicationId}`;
  const setMandate = async (budgets, version, extras) =>
    assert.equal(
      (
        await app.inject({
          method: "POST",
          url: `${base}/mandates`,
          headers: agent,
          payload: mandateBody(budgets, version, extras),
        })
      ).statusCode,
      201,
    );
  const daily = [
    { budgetId: "daily_usdc", action: "PAYMENT", currency: "USDC", window: "DAILY", limit: "100" },
  ];
  await setMandate(options.budgets === null ? undefined : (options.budgets ?? daily), 1, {
    approvalOver: options.approvalOver,
  });
  const submit = async (action) => {
    const res = await app.inject({ method: "POST", url: `${base}/unified-actions`, headers: agent, payload: { action } });
    return { code: res.statusCode, ...res.json() };
  };
  const decide = async (approvalId, decision) => {
    const res = await app.inject({
      method: "POST",
      url: `${base}/approvals/${approvalId}/decision`,
      headers: human,
      payload: { decision, approver: "alice@example.com" },
    });
    return { code: res.statusCode, ...res.json() };
  };
  const setClock = (ms) => {
    clock = ms;
  };
  return { app, base, calls, setMandate, submit, decide, setClock, daily };
}

test("under the cap → ALLOW; over the cap → BLOCK naming the budget", async () => {
  const { app, submit } = await harness();
  try {
    const ok = await submit(payment("40"));
    assert.equal(ok.decision, "ALLOW");
    const blocked = await submit(payment("70"));
    assert.equal(blocked.decision, "BLOCK");
    assert.equal(blocked.mandate?.reason, "BUDGET_EXCEEDED");
    assert.match(blocked.violations?.[0]?.reason ?? "", /BUDGET_EXCEEDED \(daily_usdc\)/);
    assert.equal(blocked.violations?.[0]?.budget?.budgetId, "daily_usdc");
    assert.equal(blocked.violations?.[0]?.budget?.used, "40");
    assert.equal(blocked.violations?.[0]?.budget?.requested, "70");
  } finally {
    await app.close();
  }
});

test("two concurrent payments for the last slot → exactly one ALLOW", async () => {
  const { app, submit } = await harness({
    budgets: [{ budgetId: "daily_usdc", action: "PAYMENT", currency: "USDC", window: "DAILY", limit: "100" }],
  });
  try {
    const [a, b] = await Promise.all([submit(payment("100")), submit(payment("100"))]);
    const decisions = [a.decision, b.decision].sort();
    assert.deepEqual(decisions, ["ALLOW", "BLOCK"]);
  } finally {
    await app.close();
  }
});

test("replay of an ALLOWed payment → not charged twice", async () => {
  const { app, submit } = await harness();
  try {
    const key = `budget-replay-${randomUUID()}`;
    const first = await submit(payment("60", { idempotencyKey: key }));
    assert.equal(first.decision, "ALLOW");
    const replay = await submit(payment("60", { idempotencyKey: key }));
    assert.equal(replay.decision, "ALLOW");
    const next = await submit(payment("50"));
    assert.equal(next.decision, "BLOCK");
    assert.equal(next.mandate?.reason, "BUDGET_EXCEEDED");
  } finally {
    await app.close();
  }
});

test("approval granted after the budget is used up → BLOCK", async () => {
  const { app, submit, decide } = await harness({ approvalOver: "80" });
  try {
    const paused = await submit(payment("90"));
    assert.equal(paused.decision, "NEEDS_APPROVAL");
    assert.equal((await submit(payment("40"))).decision, "ALLOW");
    const decided = await decide(paused.approvalId, "APPROVE");
    assert.equal(decided.decision, "BLOCK");
    assert.equal(decided.mandate?.reason, "BUDGET_EXCEEDED");
  } finally {
    await app.close();
  }
});

test("window rollover (injected clock) → fresh budget", async () => {
  const start = Date.UTC(2026, 10, 22, 12, 0, 0); // 2026-11-22 noon UTC
  const { app, submit, setClock } = await harness({ clockMs: start });
  try {
    assert.equal((await submit(payment("100"))).decision, "ALLOW");
    assert.equal((await submit(payment("1"))).decision, "BLOCK");
    setClock(Date.UTC(2026, 10, 23, 0, 0, 1)); // next UTC day
    assert.equal((await submit(payment("100"))).decision, "ALLOW");
  } finally {
    await app.close();
  }
});

test("mandate with no budgets → behavior unchanged", async () => {
  const { app, submit, calls } = await harness({ budgets: null });
  try {
    // Under the approval threshold so PERMIT applies; no budget to stop large spends.
    const ok = await submit(payment("50"));
    assert.equal(ok.decision, "ALLOW");
    assert.equal(calls.length, 1);
    const again = await submit(payment("70"));
    assert.equal(again.decision, "ALLOW");
    assert.equal(calls.length, 2);
  } finally {
    await app.close();
  }
});

test("GET /budgets returns used, remaining, resetsAt", async () => {
  const { app, base, submit } = await harness();
  try {
    assert.equal((await submit(payment("25"))).decision, "ALLOW");
    const res = await app.inject({ method: "GET", url: `${base}/budgets`, headers: agent });
    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.equal(body.budgets.length, 1);
    assert.equal(body.budgets[0].budgetId, "daily_usdc");
    assert.equal(body.budgets[0].used, "25");
    assert.equal(body.budgets[0].remaining, "75");
    assert.match(body.budgets[0].resetsAt, /T00:00:00Z$/);
  } finally {
    await app.close();
  }
});
