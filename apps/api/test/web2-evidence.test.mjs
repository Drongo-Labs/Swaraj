/** Needs a disposable database: SWARAJ_TEST_DATABASE_URL=postgres://… */
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import * as db from "@swaraj/database";
import { runOneProofJob } from "@swaraj/proofs";
import { buildApp } from "../dist/app.js";

const url = process.env.SWARAJ_TEST_DATABASE_URL;
const skip = url ? false : "set SWARAJ_TEST_DATABASE_URL to a disposable database";
const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const stripeSecret = "whsec_test";
const githubSecret = "github_test";

function common() {
  const now = Date.now();
  return {
    intentId: "intent_web2",
    agent: "agent:web2",
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `web2-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
  };
}
const payment = () => ({ ...common(), action: "PAYMENT", resource: { service: "stripe" }, context: { amount: "500", currency: "USD", recipient: "acct_vendor" } });
const SHA = "a".repeat(40);
const deploy = () => ({ ...common(), action: "DEPLOY", resource: { repo: "org/app" }, context: { branch: "main", commitHash: SHA, environment: "PRODUCTION" } });

const stripeEvent = (receiptId, amount = 500) => JSON.stringify({
  type: "payment_intent.succeeded",
  data: { object: { amount, currency: "usd", transfer_data: { destination: "acct_vendor" }, metadata: { swaraj_receipt_id: receiptId } } },
});
const githubEvent = (receiptId, state = "success") => JSON.stringify({
  deployment_status: { state },
  deployment: { sha: SHA, environment: "production", payload: { swaraj_receipt_id: receiptId } },
  repository: { full_name: "org/app" },
});

async function harness() {
  process.env.STRIPE_WEBHOOK_SECRET = stripeSecret;
  process.env.GITHUB_WEBHOOK_SECRET = githubSecret;
  const applicationId = `app_${randomUUID().slice(0, 8)}`;
  const app = await buildApp(token, { pipelineMode: "mock", databaseUrl: url, signer: new LocalKeySigner("0x" + "11".repeat(32)) });
  delete process.env.STRIPE_WEBHOOK_SECRET;
  delete process.env.GITHUB_WEBHOOK_SECRET;
  const base = `/v1/applications/${applicationId}`;
  const mandate = await app.inject({
    method: "POST",
    url: `${base}/mandates`,
    headers,
    payload: {
      mandateId: "mandate_web2", version: 1, agent: "*", defaultEffect: "DENY",
      validFrom: Date.now() - 1000, validUntil: Date.now() + 3_600_000,
      rules: [
        { ruleId: "permit_deploy", effect: "PERMIT", action: "DEPLOY", predicates: [] },
        { ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] },
      ],
    },
  });
  assert.equal(mandate.statusCode, 201, mandate.body);
  const submit = async (action) =>
    (await app.inject({ method: "POST", url: `${base}/unified-actions`, headers, payload: { action } })).json();
  const receipt = async (id) =>
    (await app.inject({ method: "GET", url: `${base}/receipts/${id}`, headers })).json();
  const hook = (path, body, signature) =>
    app.inject({ method: "POST", url: `/v1/webhooks/${path}`, headers: { "content-type": "application/json", ...signature }, payload: body });
  const stripe = (body, key = stripeSecret, t = Math.floor(Date.now() / 1000)) =>
    hook("stripe", body, { "stripe-signature": `t=${t},v1=${createHmac("sha256", key).update(`${t}.${body}`).digest("hex")}` });
  const github = (body, key = githubSecret) =>
    hook("github", body, { "x-hub-signature-256": `sha256=${createHmac("sha256", key).update(body).digest("hex")}` });
  return { app, submit, receipt, stripe, github };
}

async function proveUntil(pool, artifactRoot, receiptId) {
  let outcome;
  do outcome = await runOneProofJob(pool, { artifactRoot });
  while (outcome && outcome.receiptId !== receiptId);
  return outcome;
}

test("a Stripe payment stays pending until a signed matching record proves it", { skip }, async () => {
  const { app, submit, receipt, stripe } = await harness();
  const pool = db.openPool(url);
  const artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-web2-"));
  try {
    const { receiptId } = await submit(payment());
    assert.equal((await receipt(receiptId)).status, "PENDING");

    assert.equal((await stripe(stripeEvent(receiptId), "wrong-secret")).statusCode, 401);
    assert.equal((await receipt(receiptId)).status, "PENDING");

    assert.equal((await stripe(stripeEvent(receiptId))).statusCode, 200);
    const outcome = await proveUntil(pool, artifactRoot, receiptId);
    assert.ok(outcome, "the proof job ran");
    assert.equal((await receipt(receiptId)).productStatus, "proved");
  } finally {
    await rm(artifactRoot, { recursive: true, force: true });
    await pool.close();
    await app.close();
  }
});

test("a signed record for a different amount ends at cant_prove", { skip }, async () => {
  const { app, submit, receipt, stripe } = await harness();
  try {
    const { receiptId } = await submit(payment());
    await stripe(stripeEvent(receiptId, 999));
    assert.equal((await receipt(receiptId)).productStatus, "cant_prove");
  } finally {
    await app.close();
  }
});

test("a redelivered webhook settles nothing twice", { skip }, async () => {
  const { app, submit, stripe } = await harness();
  const pool = db.openPool(url);
  try {
    const { receiptId } = await submit(payment());
    await stripe(stripeEvent(receiptId));
    await stripe(stripeEvent(receiptId));
    const jobs = await pool.raw.query("SELECT count(*)::int AS n FROM proof_jobs WHERE receipt_id = $1", [receiptId]);
    assert.equal(jobs.rows[0].n, 1);
  } finally {
    await pool.raw.query("DELETE FROM proof_jobs WHERE phase = 'QUEUED'");
    await pool.close();
    await app.close();
  }
});

test("a GitHub deployment settles a deploy and a failed one cannot", { skip }, async () => {
  const { app, submit, receipt, github } = await harness();
  const pool = db.openPool(url);
  try {
    const failed = await submit(deploy());
    await github(githubEvent(failed.receiptId, "in_progress"));
    assert.equal((await receipt(failed.receiptId)).status, "PENDING");
    await github(githubEvent(failed.receiptId, "failure"));
    assert.equal((await receipt(failed.receiptId)).productStatus, "cant_prove");

    const good = await submit(deploy());
    assert.equal((await github(githubEvent(good.receiptId), "wrong-secret")).statusCode, 401);
    assert.equal((await github(githubEvent(good.receiptId))).statusCode, 200);
    const jobs = await pool.raw.query("SELECT count(*)::int AS n FROM proof_jobs WHERE receipt_id = $1", [good.receiptId]);
    assert.equal(jobs.rows[0].n, 1);
  } finally {
    await pool.raw.query("DELETE FROM proof_jobs WHERE phase = 'QUEUED'");
    await pool.close();
    await app.close();
  }
});
