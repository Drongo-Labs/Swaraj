/** Needs a disposable database: SWARAJ_TEST_DATABASE_URL=postgres://… */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import * as db from "@swaraj/database";
import { runOneProofJob } from "@swaraj/proofs";
import { verifyReceiptBundle } from "@swaraj/verify";
import { buildApp } from "../dist/app.js";

const url = process.env.SWARAJ_TEST_DATABASE_URL;
const skip = url ? false : "set SWARAJ_TEST_DATABASE_URL to a disposable database";
const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const EVIDENCE = "0x" + "ab".repeat(32);

function payment(overrides = {}) {
  const now = Date.now();
  return {
    intentId: "intent_near",
    agent: "agent:near",
    action: "PAYMENT",
    resource: { service: "near_transfer" },
    context: { amount: "1000", currency: "NEAR", recipient: "vendor.testnet" },
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `near-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
    ...overrides,
  };
}

async function harness(nearSettler) {
  const applicationId = `app_${randomUUID().slice(0, 8)}`;
  const app = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: url,
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
    ...(nearSettler ? { nearSettler } : {}),
  });
  const now = Date.now();
  const res = await app.inject({
    method: "POST",
    url: `/v1/applications/${applicationId}/mandates`,
    headers,
    payload: {
      mandateId: "mandate_near",
      version: 1,
      agent: "*",
      defaultEffect: "DENY",
      validFrom: now - 1000,
      validUntil: now + 3_600_000,
      rules: [{ ruleId: "permit_near", effect: "PERMIT", action: "PAYMENT", predicates: [] }],
    },
  });
  assert.equal(res.statusCode, 201, res.body);
  const submit = async (action) =>
    (await app.inject({ method: "POST", url: `/v1/applications/${applicationId}/unified-actions`, headers, payload: { action } })).json();
  const receipt = async (id) =>
    (await app.inject({ method: "GET", url: `/v1/applications/${applicationId}/receipts/${id}`, headers })).json();
  return { app, submit, receipt, applicationId };
}

const settler = (result) => {
  const calls = [];
  return { calls, live: true, settle: async (...args) => { calls.push(args); return result; } };
};

test("final evidence reaches proved, and the proof binds that evidence", { skip }, async () => {
  const near = settler({ status: "FINAL", evidenceDigest: EVIDENCE, txHash: "0x01", nearTx: "Hash" });
  const { app, submit, receipt, applicationId } = await harness(near);
  const pool = db.openPool(url);
  const artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-near-"));
  try {
    const res = await submit(payment());
    assert.equal(res.productStatus, "allowed", JSON.stringify(res));
    assert.equal(res.execution.nearTx, "Hash");
    let outcome;
    do outcome = await runOneProofJob(pool, { artifactRoot });
    while (outcome && outcome.receiptId !== res.receiptId);
    assert.ok(outcome, "the proof job ran");
    assert.equal((await receipt(res.receiptId)).productStatus, "proved");
    const bundle = JSON.parse(await readFile(outcome.artifactPath, "utf8"));
    assert.match(bundle.canonicalText, new RegExp(`evidence=${EVIDENCE}`));
    // The worker and the standalone verifier must agree on the statement, byte for byte.
    const exported = (await app.inject({
      method: "GET",
      url: `/v1/applications/${applicationId}/receipts/${res.receiptId}/bundle`,
      headers,
    })).json();
    const verified = await verifyReceiptBundle(exported, { issuer: exported.issuer });
    assert.equal(verified.valid, true, JSON.stringify(verified.checks));
  } finally {
    await rm(artifactRoot, { recursive: true, force: true });
    await pool.close();
    await app.close();
  }
});

test("missing evidence is cant_prove and queues no proof", { skip }, async () => {
  const near = settler({ status: "NOT_PROVABLE", reason: "EVIDENCE_CONFLICT", txHash: "0x01" });
  const { app, submit, receipt } = await harness(near);
  try {
    const res = await submit(payment());
    assert.equal(res.productStatus, "cant_prove", JSON.stringify(res));
    assert.equal(res.execution.reason, "EVIDENCE_CONFLICT");
    assert.equal((await receipt(res.receiptId)).status, "NON_PROVABLE");
  } finally {
    await app.close();
  }
});

test("a replayed action never executes twice", { skip }, async () => {
  const near = settler({ status: "NOT_PROVABLE", reason: "EVIDENCE_PENDING" });
  const { app, submit } = await harness(near);
  try {
    const action = payment();
    const first = await submit(action);
    const second = await submit(action);
    assert.equal(near.calls.length, 1);
    assert.equal(second.replayed, true);
    assert.equal(second.receiptId, first.receiptId);
    const reused = await submit(payment({ idempotencyKey: action.idempotencyKey, context: { ...action.context, amount: "2000" } }));
    assert.equal(reused.error, "idempotency_conflict");
    assert.equal(near.calls.length, 1);
  } finally {
    await app.close();
  }
});

test("fixture NEAR execution can never be reported as proved", { skip }, async () => {
  const saved = { id: process.env.NEAR_ACCOUNT_ID, key: process.env.NEAR_PRIVATE_KEY };
  delete process.env.NEAR_ACCOUNT_ID;
  delete process.env.NEAR_PRIVATE_KEY;
  const { app, submit } = await harness();
  try {
    const res = await submit(payment());
    assert.equal(res.execution.live, false);
    assert.equal(res.productStatus, "cant_prove", JSON.stringify(res));
    assert.equal(res.execution.reason, "EVIDENCE_PENDING");
  } finally {
    if (saved.id !== undefined) process.env.NEAR_ACCOUNT_ID = saved.id;
    if (saved.key !== undefined) process.env.NEAR_PRIVATE_KEY = saved.key;
    await app.close();
  }
});
