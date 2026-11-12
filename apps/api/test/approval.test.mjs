/** Execution cases need a disposable database: SWARAJ_TEST_DATABASE_URL=postgres://… */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import * as db from "@swaraj/database";
import { runOneProofJob } from "@swaraj/proofs";
import { verifyReceiptBundle } from "@swaraj/verify";
import { buildApp } from "../dist/app.js";

// Stands in for a sink that verifies a real proof (NEAR receipts contract): the
// local sink alone never marks a receipt PROVED.
const verifyingSink = { submit: async (bundle) => ({ ref: `zkv_test_${bundle.statementId.slice(5, 21)}`, sink: "test" }) };

const url = process.env.SWARAJ_TEST_DATABASE_URL;
const needsDb = url ? false : "set SWARAJ_TEST_DATABASE_URL to a disposable database";
const token = "development-test-token-at-least-32-characters";
const approverToken = "approver-test-token-at-least-32-characters";
const agent = { authorization: `Bearer ${token}` };
const human = { authorization: `Bearer ${approverToken}` };

const mandateBody = (reviewOver = "100", version = 1) => ({
  mandateId: "mandate_review",
  version,
  agent: "*",
  defaultEffect: "DENY",
  validFrom: Date.now() - 1000,
  validUntil: Date.now() + 3_600_000,
  rules: [
    { ruleId: "forbid_huge", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "GT", value: "1000" }] },
    { ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] },
    { ruleId: "review_large", effect: "REQUIRE_APPROVAL", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "GT", value: reviewOver }] },
  ],
});

function payment(amount, overrides = {}) {
  const now = Date.now();
  return {
    intentId: "intent_review",
    agent: "agent:treasury",
    action: "PAYMENT",
    resource: { service: "near_transfer" },
    context: { amount, currency: "NEAR", recipient: "vendor.testnet" },
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `review-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
    ...overrides,
  };
}

async function harness(options = {}) {
  const applicationId = `app_${randomUUID().slice(0, 8)}`;
  const calls = [];
  const app = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: options.databaseUrl ?? "",
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
    approverToken: options.approverToken ?? approverToken,
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
  const setMandate = async (...args) =>
    assert.equal((await app.inject({ method: "POST", url: `${base}/mandates`, headers: (options.approverToken ?? approverToken) ? human : agent, payload: mandateBody(...args) })).statusCode, 201);
  await setMandate();
  const submit = async (action) => {
    const res = await app.inject({ method: "POST", url: `${base}/unified-actions`, headers: agent, payload: { action } });
    return { code: res.statusCode, ...res.json() };
  };
  const decide = async (approvalId, decision, headers = human) => {
    const res = await app.inject({
      method: "POST",
      url: `${base}/approvals/${approvalId}/decision`,
      headers,
      payload: { decision, approver: "alice@example.com" },
    });
    return { code: res.statusCode, ...res.json() };
  };
  return { app, base, calls, setMandate, submit, decide };
}

test("a matching approval rule pauses the action and nothing executes", async () => {
  const { app, calls, submit } = await harness();
  try {
    const paused = await submit(payment("500"));
    assert.equal(paused.code, 202);
    assert.equal(paused.decision, "NEEDS_APPROVAL");
    assert.equal(paused.productStatus, "needs_approval");
    assert.equal(calls.length, 0);
    assert.equal((await submit(payment("50"))).decision, "ALLOW");
    assert.equal((await submit(payment("5000"))).decision, "BLOCK");
  } finally {
    await app.close();
  }
});

test("the agent's own token cannot approve", async () => {
  const { app, calls, submit, decide } = await harness();
  try {
    const { approvalId } = await submit(payment("500"));
    assert.equal((await decide(approvalId, "APPROVE", agent)).code, 401);
    assert.equal((await decide(approvalId, "APPROVE", {})).code, 401);
    assert.equal(calls.length, 0);
  } finally {
    await app.close();
  }
});

test("with no approver token configured nothing can be approved", async () => {
  const saved = process.env.SWARAJ_APPROVER_TOKEN;
  delete process.env.SWARAJ_APPROVER_TOKEN;
  const { app, calls, submit, decide } = await harness({ approverToken: "" });
  try {
    const { approvalId } = await submit(payment("500"));
    assert.equal((await decide(approvalId, "APPROVE", agent)).code, 403);
    assert.equal(calls.length, 0);
  } finally {
    if (saved !== undefined) process.env.SWARAJ_APPROVER_TOKEN = saved;
    await app.close();
  }
});

test("the approver token must differ from the agent token", async () => {
  await assert.rejects(buildApp(token, { pipelineMode: "mock", databaseUrl: "", approverToken: token }), /must differ/);
});

test("a rejection blocks the action and cannot be reversed", async () => {
  const { app, calls, submit, decide } = await harness();
  try {
    const { approvalId } = await submit(payment("500"));
    assert.equal((await decide(approvalId, "REJECT")).productStatus, "blocked");
    const again = await decide(approvalId, "APPROVE");
    assert.equal(again.code, 409);
    assert.equal(again.status, "REJECTED");
    assert.equal(calls.length, 0);
  } finally {
    await app.close();
  }
});

test("an approval dies when the mandate changes or the action expires", async () => {
  const { app, calls, setMandate, submit, decide } = await harness();
  try {
    const changed = await submit(payment("500"));
    await setMandate("200", 2);
    assert.equal((await decide(changed.approvalId, "APPROVE")).error, "mandate_changed");

    const stale = await submit(payment("500", { expiry: Date.now() + 40 }));
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal((await decide(stale.approvalId, "APPROVE")).error, "approval_expired");
    assert.equal(calls.length, 0);
  } finally {
    await app.close();
  }
});

test("an approved action executes once and its bundle names the approver", { skip: needsDb }, async () => {
  const { app, base, calls, submit, decide } = await harness({ databaseUrl: url });
  const pool = db.openPool(url);
  const artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-approval-"));
  try {
    const action = payment("500");
    const { approvalId } = await submit(action);
    const approved = await decide(approvalId, "APPROVE");
    assert.equal(approved.decision, "ALLOW", JSON.stringify(approved));
    assert.equal(approved.approvedBy, "alice@example.com");
    assert.equal(calls.length, 1);
    assert.equal((await decide(approvalId, "APPROVE")).code, 409);
    assert.equal(calls.length, 1);

    let outcome;
    // Jobs left by other tests can fail, so keep leasing until this receipt's job runs.
    for (let i = 0; i < 25 && outcome?.receiptId !== approved.receiptId; i += 1) {
      outcome = await runOneProofJob(pool, { artifactRoot, sink: verifyingSink });
    }
    assert.equal(outcome?.receiptId, approved.receiptId, "the proof job ran");
    const bundle = (await app.inject({ method: "GET", url: `${base}/receipts/${approved.receiptId}/bundle`, headers: agent })).json();
    assert.equal(bundle.approvedBy, "alice@example.com");
    assert.match(bundle.statementText, /decision=NEEDS_APPROVAL/);
    const verified = await verifyReceiptBundle(bundle, { issuer: bundle.issuer });
    assert.equal(verified.valid, true, JSON.stringify(verified.checks));
    assert.equal((await verifyReceiptBundle({ ...bundle, approvedBy: undefined }, { issuer: bundle.issuer })).valid, false);
  } finally {
    await rm(artifactRoot, { recursive: true, force: true });
    await pool.close();
    await app.close();
  }
});
