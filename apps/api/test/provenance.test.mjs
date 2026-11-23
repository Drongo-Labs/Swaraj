import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { buildApp } from "../dist/app.js";

const token = "development-test-token-at-least-32-characters";
const approverToken = "approver-test-token-at-least-32-characters";
const agent = { authorization: `Bearer ${token}` };
const owner = { authorization: `Bearer ${approverToken}` };

// Untrusted-input rule: a payment over 10 that follows outside content waits for a human.
const mandate = () => ({
  mandateId: "mandate_provenance",
  version: 1,
  agent: "*",
  defaultEffect: "DENY",
  validFrom: Date.now() - 1000,
  validUntil: Date.now() + 3_600_000,
  rules: [
    { ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] },
    {
      ruleId: "review_tainted",
      effect: "REQUIRE_APPROVAL",
      action: "PAYMENT",
      predicates: [
        { field: "context.amount", operator: "GT", value: "10" },
        { field: "provenance.untrusted", operator: "EQ", value: true },
      ],
    },
  ],
});

const payment = (amount, provenance) => {
  const now = Date.now();
  return {
    intentId: "intent_provenance",
    agent: "agent:treasury",
    action: "PAYMENT",
    resource: { service: "near_transfer" },
    context: { amount, currency: "NEAR", recipient: "vendor.testnet" },
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `prov-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
    ...(provenance === undefined ? {} : { provenance }),
  };
};

async function harness() {
  const app = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: "",
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
    approverToken,
  });
  const base = `/v1/applications/app_${randomUUID().slice(0, 8)}`;
  const created = await app.inject({ method: "POST", url: `${base}/mandates`, headers: owner, payload: mandate() });
  assert.equal(created.statusCode, 201, created.body);
  const submit = async (action) =>
    (await app.inject({ method: "POST", url: `${base}/unified-actions`, headers: agent, payload: { action } })).json();
  const call = async (method, path, headers = agent, payload) =>
    app.inject({ method, url: `${base}${path}`, headers, ...(payload ? { payload } : {}) });
  return { app, submit, call };
}

test("the same payment is allowed when clean and held for approval after untrusted input", async () => {
  const { app, submit, call } = await harness();
  try {
    assert.equal((await submit(payment("50", { untrusted: false }))).decision, "ALLOW");

    const marked = await call("POST", "/provenance/untrusted", agent, { source: "web/fetch_url" });
    assert.equal(marked.statusCode, 200);
    assert.deepEqual((await call("GET", "/provenance")).json().sources, ["web/fetch_url"]);

    assert.equal((await submit(payment("50", { untrusted: true }))).decision, "NEEDS_APPROVAL");
    assert.equal((await submit(payment("5", { untrusted: true }))).decision, "ALLOW");
  } finally {
    await app.close();
  }
});

test("claiming clean after untrusted input is blocked, and so is a missing label", async () => {
  const { app, submit, call } = await harness();
  try {
    const unlabeled = await submit(payment("50"));
    assert.equal(unlabeled.decision, "BLOCK");
    assert.match(JSON.stringify(unlabeled), /MISSING_PROVENANCE/);

    await call("POST", "/provenance/untrusted", agent, { source: "mail/read_inbox" });
    const lie = await submit(payment("50", { untrusted: false }));
    assert.equal(lie.decision, "BLOCK");
    assert.match(JSON.stringify(lie), /PROVENANCE_MISMATCH/);
  } finally {
    await app.close();
  }
});

test("only the owner can clear the record, and clearing restores clean decisions", async () => {
  const { app, submit, call } = await harness();
  try {
    await call("POST", "/provenance/untrusted", agent, { source: "web/fetch_url" });
    assert.equal((await call("POST", "/provenance/clear", agent)).statusCode, 401);
    assert.equal((await call("POST", "/provenance/clear", owner)).statusCode, 200);
    assert.equal((await call("GET", "/provenance")).json().untrusted, false);
    assert.equal((await submit(payment("50", { untrusted: false }))).decision, "ALLOW");
  } finally {
    await app.close();
  }
});
