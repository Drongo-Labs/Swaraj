import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import {
  advanceReceipt,
  applyMigrations,
  claimIdempotencyKey,
  enqueueProofJob,
  failProofJob,
  finishProofJob,
  findDecisionByIntent,
  findReceipt,
  findReceiptByIdempotencyKey,
  insertDecision,
  insertProofArtifact,
  insertReceipt,
  IllegalReceiptTransition,
  leaseNextProofJob,
  listMigrations,
  listReceiptEvents,
  openPool,
  pingDatabase,
  type PoolHandle,
} from "../dist/index.js";

let pool: PoolHandle;
const appId = `app_${randomUUID().slice(0, 8)}`;

test.before(async () => {
  pool = openPool();
  assert.equal(await pingDatabase(pool), true);
  await applyMigrations(pool);
  await pool.raw.query("INSERT INTO applications (app_id, display_name) VALUES ($1, $2)", [
    appId,
    "test app",
  ]);
});

test.after(async () => {
  await pool?.close();
});

async function seedReceipt(receiptId: string, intentDigest: string) {
  const decision = await insertDecision(pool, {
    appId,
    intentDigest,
    policyId: "pol_test",
    policyRevision: 1,
    outcome: "ALLOW",
    violatedRules: [],
    smtScript: "(check-sat)",
  });
  return insertReceipt(pool, {
    receiptId,
    appId,
    intentDigest,
    decisionId: decision.decisionId,
    claim: { kind: "TRADE_EXECUTED" },
  });
}

test("migrations are idempotent and self-registered", async () => {
  await applyMigrations(pool);
  const applied = await listMigrations(pool);
  assert.equal(applied.length, 4);
  assert.deepEqual(
    applied.map((m) => m.label),
    ["core", "receipt-lifecycle", "proof-queue", "sp1-proof-kind"],
  );
});

test("decision round-trips and is addressable by intent", async () => {
  const intent = `intent_${randomUUID().slice(0, 8)}`;
  const stored = await insertDecision(pool, {
    appId,
    intentDigest: intent,
    policyId: "pol_x",
    policyRevision: 4,
    outcome: "BLOCK",
    violatedRules: ["amount.cap"],
    smtScript: "(declare-const x Int)",
  });
  const found = await findDecisionByIntent(pool, appId, intent);
  assert.equal(found?.decisionId, stored.decisionId);
  assert.deepEqual(found?.violatedRules, ["amount.cap"]);
  assert.equal(found?.outcome, "BLOCK");
});

test("receipt lifecycle: legal advance writes an event, illegal ones are rejected by the DB", async () => {
  const receipt = await seedReceipt(`rcpt_legal_${randomUUID().slice(0, 6)}`, `d_${randomUUID().slice(0, 8)}`);
  assert.equal(receipt.state, "PENDING");

  const proved = await advanceReceipt(pool, receipt.receiptId, "PROVED", {
    proofRef: "zkv:stmt_1",
    note: "zkVerify finalized",
  });
  assert.equal(proved.state, "PROVED");
  assert.equal(proved.proofRef, "zkv:stmt_1");

  const events = await listReceiptEvents(pool, receipt.receiptId);
  assert.equal(events.length, 1);
  assert.equal(events[0]?.fromState, "PENDING");
  assert.equal(events[0]?.toState, "PROVED");

  // PROVED -> PROVED is a no-op, the trigger rejects it.
  await assert.rejects(
    advanceReceipt(pool, receipt.receiptId, "PROVED"),
    IllegalReceiptTransition,
  );
  // PROVED cannot go back to PENDING or to NON_PROVABLE.
  await assert.rejects(
    advanceReceipt(pool, receipt.receiptId, "NON_PROVABLE"),
    IllegalReceiptTransition,
  );
  // PROVED -> INVALIDATED models a reorg.
  const invalidated = await advanceReceipt(pool, receipt.receiptId, "INVALIDATED", { note: "reorg" });
  assert.equal(invalidated.state, "INVALIDATED");
  // Terminal: nothing further is legal.
  await assert.rejects(
    advanceReceipt(pool, receipt.receiptId, "PROVED"),
    IllegalReceiptTransition,
  );
});

test("NON_PROVABLE is terminal too", async () => {
  const receipt = await seedReceipt(`rcpt_np_${randomUUID().slice(0, 6)}`, `d_${randomUUID().slice(0, 8)}`);
  await advanceReceipt(pool, receipt.receiptId, "NON_PROVABLE", { note: "proof failed" });
  await assert.rejects(
    advanceReceipt(pool, receipt.receiptId, "PROVED"),
    IllegalReceiptTransition,
  );
});

test("idempotency: second claim with the same key returns false and the original receipt is found", async () => {
  const receipt = await seedReceipt(`rcpt_idem_${randomUUID().slice(0, 6)}`, `d_${randomUUID().slice(0, 8)}`);
  const key = `idem_${randomUUID().slice(0, 8)}`;

  assert.equal(await claimIdempotencyKey(pool, { appId, idemKey: key, intentDigest: receipt.intentDigest, receiptId: receipt.receiptId }), true);
  assert.equal(await claimIdempotencyKey(pool, { appId, idemKey: key, intentDigest: receipt.intentDigest, receiptId: receipt.receiptId }), false);

  const found = await findReceiptByIdempotencyKey(pool, appId, key);
  assert.equal(found?.receiptId, receipt.receiptId);
});

test("proof queue: lease, complete, retry-then-fail, artifacts", async () => {
  // The lease picks the globally oldest queued job; clear leftovers from
  // earlier runs so this test observes only its own jobs.
  await pool.raw.query("DELETE FROM proof_jobs");

  const receipt = await seedReceipt(`rcpt_q_${randomUUID().slice(0, 6)}`, `d_${randomUUID().slice(0, 8)}`);
  const job = await enqueueProofJob(pool, { receiptId: receipt.receiptId, payload: { input: 1 }, maxAttempts: 2 });
  assert.equal(job.phase, "QUEUED");

  const leased = await leaseNextProofJob(pool);
  assert.ok(leased);
  assert.equal(leased.jobId, job.jobId);
  assert.equal(leased.phase, "LEASED");
  assert.equal(leased.attempts, 1);

  // Nothing else is leaseable while the only job is held.
  assert.equal(await leaseNextProofJob(pool), undefined);

  await insertProofArtifact(pool, {
    jobId: leased.jobId,
    receiptId: receipt.receiptId,
    kind: "VERIFICATION_BUNDLE",
    content: { bundle: "demo" },
  });
  await finishProofJob(pool, leased.jobId);
  assert.equal((await findReceipt(pool, receipt.receiptId))?.state, "PENDING");

  // Retry path: exhausting attempts parks the job as FAILED.
  const retryJob = await enqueueProofJob(pool, { receiptId: receipt.receiptId, payload: {}, maxAttempts: 1 });
  const leasedRetry = await leaseNextProofJob(pool);
  assert.ok(leasedRetry);
  assert.equal(leasedRetry.jobId, retryJob.jobId);
  const phaseAfterFail = await failProofJob(pool, leasedRetry.jobId, "worker crashed");
  assert.equal(phaseAfterFail, "FAILED");
  assert.equal(await leaseNextProofJob(pool), undefined);
});
