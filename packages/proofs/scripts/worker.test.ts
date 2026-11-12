import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  advanceReceipt,
  applyMigrations,
  enqueueProofJob,
  findReceipt,
  insertDecision,
  insertReceipt,
  openPool,
  type PoolHandle,
} from "@swaraj/database";
import { reevaluateGround, runOneProofJob, toWirePolicy, type GateJobPayload } from "../dist/index.js";
import type { PolicyDoc } from "@swaraj/smt";

let pool: PoolHandle;
let artifactRoot: string;
const appId = `app_${randomUUID().slice(0, 8)}`;

const policy: PolicyDoc = {
  policyId: "pol_worker_demo",
  revision: 1,
  fields: ["amountCents", "limitCents"],
  assumptions: [
    { ruleId: "limit.fixed", assertion: { kind: "compare", op: "eq", left: { kind: "field", name: "limitCents" }, right: { kind: "const", value: 100000n } } },
  ],
  rules: [
    { ruleId: "amount.positive", assertion: { kind: "compare", op: "gt", left: { kind: "field", name: "amountCents" }, right: { kind: "const", value: 0n } } },
    { ruleId: "amount.cap", assertion: { kind: "compare", op: "le", left: { kind: "field", name: "amountCents" }, right: { kind: "field", name: "limitCents" } } },
  ],
};

const action = { values: { amountCents: "25000", limitCents: "100000" } };

test.before(async () => {
  pool = openPool();
  await applyMigrations(pool);
  await pool.raw.query("INSERT INTO applications (app_id, display_name) VALUES ($1, $2)", [appId, "proof worker test"]);
  artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-worker-"));
});

test.after(async () => {
  await pool?.close();
  await rm(artifactRoot, { recursive: true, force: true });
});

async function seedProvableReceipt(): Promise<string> {
  const suffix = randomUUID().slice(0, 6);
  const intentDigest = `intent_${suffix}`;
  const decision = await insertDecision(pool, {
    appId,
    intentDigest,
    policyId: policy.policyId,
    policyRevision: policy.revision,
    outcome: "ALLOW",
    violatedRules: [],
    smtScript: "(check-sat)",
  });
  const receipt = await insertReceipt(pool, {
    receiptId: `rcpt_${suffix}`,
    appId,
    intentDigest,
    decisionId: decision.decisionId,
    claim: { kind: "TRADE_EXECUTED" },
  });
  return receipt.receiptId;
}

test("worker without a ZK prover records the statement but marks the receipt NON_PROVABLE", async () => {
  await pool.raw.query("DELETE FROM proof_jobs");
  const receiptId = await seedProvableReceipt();
  await enqueueProofJob(pool, {
    receiptId,
    payload: { policy: toWirePolicy(policy), action, expected: reevaluateGround(policy, action) } satisfies GateJobPayload,
  });
  const outcome = await runOneProofJob(pool, { artifactRoot });
  assert.ok(outcome, "worker processed the job");
  assert.equal(outcome.proved, false);
  assert.equal((await findReceipt(pool, receiptId))?.state, "NON_PROVABLE");
});

test("worker proves a job end to end: artifact, sink reference, PROVED receipt, DONE job", async () => {
  // The lease takes the globally oldest queued job; clear stale rows first.
  await pool.raw.query("DELETE FROM proof_jobs");
  const receiptId = await seedProvableReceipt();
  await enqueueProofJob(pool, {
    receiptId,
    payload: { policy: toWirePolicy(policy), action, expected: reevaluateGround(policy, action) } satisfies GateJobPayload,
  });

  // Stands in for a sink that verifies a real proof (the NEAR receipts contract).
  const verifyingSink = { submit: async () => ({ ref: `zkv_test_${"0".repeat(32)}`, sink: "test" }) };
  const outcome = await runOneProofJob(pool, { artifactRoot, sink: verifyingSink });
  assert.ok(outcome, "worker processed the job");
  assert.equal(outcome.receiptId, receiptId);
  assert.equal(outcome.proved, true);
  assert.match(outcome.statementId, /^stmt_[0-9a-f]{64}$/);
  assert.match(outcome.proofRef, /^zkv_test_[0-9a-f]{32}$/);
  assert.ok(outcome.artifactPath.includes(receiptId));

  const receipt = await findReceipt(pool, receiptId);
  assert.equal(receipt?.state, "PROVED");
  assert.equal(receipt?.proofRef, outcome.proofRef);

  const jobs = await pool.raw.query<{ phase: string }>(
    "SELECT phase FROM proof_jobs WHERE receipt_id = $1",
    [receiptId],
  );
  assert.equal(jobs.rows[0]?.phase, "DONE");
});

test("worker refuses a parity mismatch and leaves the receipt PENDING", async () => {
  await pool.raw.query("DELETE FROM proof_jobs");
  const receiptId = await seedProvableReceipt();
  await enqueueProofJob(pool, {
    receiptId,
    // The recorded decision claims a violated rule the re-evaluation will not reproduce.
    payload: {
      policy: toWirePolicy(policy),
      action,
      expected: { outcome: "BLOCK", violatedRuleIds: ["amount.cap"] },
    } satisfies GateJobPayload,
  });

  const outcome = await runOneProofJob(pool, { artifactRoot });
  assert.equal(outcome, undefined);

  const receipt = await findReceipt(pool, receiptId);
  assert.equal(receipt?.state, "PENDING");

  const job = await pool.raw.query<{ phase: string; last_error: string }>(
    "SELECT phase, last_error FROM proof_jobs WHERE receipt_id = $1",
    [receiptId],
  );
  assert.equal(job.rows[0]?.phase, "QUEUED");
  assert.match(job.rows[0]?.last_error ?? "", /parity failure/);
});

test("worker on a NON_PROVABLE receipt cannot advance it further", async () => {
  await pool.raw.query("DELETE FROM proof_jobs");
  const receiptId = await seedProvableReceipt();
  await advanceReceipt(pool, receiptId, "NON_PROVABLE", { note: "evidence rejected" });
  await enqueueProofJob(pool, {
    receiptId,
    payload: { policy: toWirePolicy(policy), action, expected: reevaluateGround(policy, action) } satisfies GateJobPayload,
  });

  const outcome = await runOneProofJob(pool, { artifactRoot });
  assert.equal(outcome, undefined);
  assert.equal((await findReceipt(pool, receiptId))?.state, "NON_PROVABLE");
});
