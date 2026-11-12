import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
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
import { policyDigest, type PolicyDoc } from "@swaraj/smt";
import { reevaluateGround, runOneProofJob, toWirePolicy, type GateJobPayload } from "../dist/index.js";

/** End to end: statement → bundle → optional SP1 proof → attestation → PROVED. */

let pool: PoolHandle;
let artifactRoot: string;
const appId = `app_${randomUUID().slice(0, 8)}`;

const policy: PolicyDoc = {
  policyId: "pol_e2e_demo",
  revision: 5,
  fields: ["amountCents", "limitCents"],
  assumptions: [
    {
      ruleId: "limit.fixed",
      assertion: {
        kind: "compare",
        op: "eq",
        left: { kind: "field", name: "limitCents" },
        right: { kind: "const", value: 100000n },
      },
    },
  ],
  rules: [
    {
      ruleId: "amount.positive",
      assertion: {
        kind: "compare",
        op: "gt",
        left: { kind: "field", name: "amountCents" },
        right: { kind: "const", value: 0n },
      },
    },
    {
      ruleId: "amount.cap",
      assertion: {
        kind: "compare",
        op: "le",
        left: { kind: "field", name: "amountCents" },
        right: { kind: "field", name: "limitCents" },
      },
    },
  ],
};

const action = { values: { amountCents: "25000", limitCents: "100000" } };

test.before(async () => {
  pool = openPool();
  await applyMigrations(pool);
  await pool.raw.query("INSERT INTO applications (app_id, display_name) VALUES ($1, $2)", [
    appId,
    "e2e proof test",
  ]);
  artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-e2e-"));
});

test.after(async () => {
  await pool?.close();
  await rm(artifactRoot, { recursive: true, force: true });
});

async function seedReceipt(): Promise<string> {
  await pool.raw.query("DELETE FROM proof_jobs");
  const suffix = randomUUID().slice(0, 6);
  const digest = policyDigest(policy);
  const decision = await insertDecision(pool, {
    appId,
    intentDigest: digest,
    policyId: policy.policyId,
    policyRevision: policy.revision,
    outcome: "ALLOW",
    violatedRules: [],
    smtScript: "(check-sat)",
  });
  const receipt = await insertReceipt(pool, {
    receiptId: `rcpt_${suffix}`,
    appId,
    intentDigest: digest,
    decisionId: decision.decisionId,
    claim: { kind: "TRADE_EXECUTED" },
  });
  await enqueueProofJob(pool, {
    receiptId: receipt.receiptId,
    payload: {
      policy: toWirePolicy(policy),
      action,
      expected: reevaluateGround(policy, action),
      evidence: { digest: `ev_${suffix}` },
    } satisfies GateJobPayload,
  });
  return receipt.receiptId;
}

test("e2e: action → statement → bundle → local attestation → NON_PROVABLE (no ZK prover), all artifacts on disk and in the ledger", async () => {
  const receiptId = await seedReceipt();

  const outcome = await runOneProofJob(pool, { artifactRoot });
  assert.ok(outcome, "worker processed the job");
  assert.equal(outcome.receiptId, receiptId);

  // The local sink only hashes the statement, so without a ZK proof the receipt is not PROVED.
  assert.equal(outcome.proved, false);
  const receipt = await findReceipt(pool, receiptId);
  assert.equal(receipt?.state, "NON_PROVABLE");
  assert.match(outcome.proofRef, /^zkv_local_[0-9a-f]{32}$/);

  // Artifact ledger: bundle and attestation rows for this job.
  const ledger = await pool.raw.query<{ kind: string; content: unknown }>(
    `SELECT kind, content FROM proof_artifacts WHERE receipt_id = $1 ORDER BY artifact_id`,
    [receiptId],
  );
  const kinds = ledger.rows.map((row) => row.kind);
  assert.deepEqual(kinds, ["VERIFICATION_BUNDLE", "ZKVERIFY_ATTESTATION"]);

  const bundleRow = ledger.rows[0]?.content as { statementId: string; evidenceDigest?: string };
  assert.equal(bundleRow.statementId, outcome.statementId);
  assert.ok(bundleRow.evidenceDigest?.startsWith("ev_"));

  const attestationRow = ledger.rows[1]?.content as { ref: string; sink: string; statementId: string };
  assert.equal(attestationRow.ref, outcome.proofRef);
  assert.equal(attestationRow.sink, "local");
  assert.equal(attestationRow.statementId, outcome.statementId);

  // On disk: the bundle JSON with the canonical statement text.
  const receiptDir = join(artifactRoot, receiptId);
  const files = await readdir(receiptDir);
  assert.deepEqual(files, [`${outcome.statementId}.json`]);
  const stored = JSON.parse(await readFile(join(receiptDir, files[0]!), "utf8")) as {
    statementId: string;
    canonicalText: string;
    evidenceDigest: string;
  };
  assert.equal(stored.statementId, outcome.statementId);
  assert.ok(stored.canonicalText.startsWith("swaraj/statement/v1"));
  assert.ok(stored.canonicalText.includes("outcome=ALLOW"));
  assert.ok(stored.canonicalText.includes(`digest=${policyDigest(policy)}`));

  // The receipt's event log recorded the promotion.
  const events = await pool.raw.query<{ to_state: string; note: string }>(
    "SELECT to_state, note FROM receipt_events WHERE receipt_id = $1 ORDER BY seq",
    [receiptId],
  );
  assert.equal(events.rows[0]?.to_state, "NON_PROVABLE");
  assert.match(events.rows[0]?.note ?? "", /statement .*not proved/);
});

test("e2e: an evidence-less job produces a bundle without an evidence digest", async () => {
  const receiptId = await seedReceipt();
  await pool.raw.query("UPDATE proof_jobs SET payload = payload - 'evidence' WHERE receipt_id = $1", [receiptId]);

  const outcome = await runOneProofJob(pool, { artifactRoot });
  assert.ok(outcome);
  const stored = JSON.parse(await readFile(outcome.artifactPath, "utf8")) as { evidenceDigest?: string };
  assert.equal(stored.evidenceDigest, undefined);
  assert.equal((await findReceipt(pool, receiptId))?.state, "NON_PROVABLE");
});

test("e2e: SP1 guest proof artifacts generate when the toolchain is configured", async (t) => {
  const elfPath = process.env.SWARAJ_SP1_ELF;
  const hostBin = process.env.SWARAJ_SP1_HOST_BIN;
  if (elfPath === undefined || hostBin === undefined) {
    t.skip(`SWARAJ_SP1_ELF / SWARAJ_SP1_HOST_BIN not configured (build:sp1 + host build required)`);
    return;
  }

  const receiptId = await seedReceipt();
  const outcome = await runOneProofJob(pool, { artifactRoot, sp1: { elfPath, hostBin } });
  assert.ok(outcome, "worker processed the job");

  const proofPath = join(artifactRoot, receiptId, `${outcome.statementId}.sp1.bin`);
  const proofStats = await stat(proofPath);
  assert.ok(proofStats.size > 0, "SP1 proof file exists and is non-empty");

  const ledger = await pool.raw.query<{ kind: string }>(
    "SELECT kind FROM proof_artifacts WHERE receipt_id = $1 ORDER BY artifact_id",
    [receiptId],
  );
  assert.deepEqual(ledger.rows.map((row) => row.kind), [
    "VERIFICATION_BUNDLE",
    "SP1_PROOF",
    "ZKVERIFY_ATTESTATION",
  ]);
  assert.equal((await findReceipt(pool, receiptId))?.state, "PROVED");
});

test("e2e: a promoted receipt cannot be advanced again", async () => {
  const receiptId = await seedReceipt();
  const outcome = await runOneProofJob(pool, { artifactRoot });
  assert.ok(outcome);
  await assert.rejects(advanceReceipt(pool, receiptId, "PROVED"));
});
