/**
 * Phase 8/9 end to end against a real, disposable Postgres (WIPES the proof/receipt tables):
 *
 *   SWARAJ_TEST_DATABASE_URL=postgres://… pnpm --filter @swaraj/api test
 *
 * Real: API, SMT gateway, decision log, receipt store/engine, proof_inputs, both queues, both workers,
 * gates, JS public-value derivation and zkVerify recovery logic. Simulated: the SP1 host (it emits an
 * artifact with the guest's public values) and the zkVerify chain (a fake polkadot API).
 */
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { EventEmitter } from "node:events";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { deriveKeyId, KeyRegistry, LocalKeySigner, verifyReceiptSignature } from "@swaraj/crypto";
import * as db from "@swaraj/database";
import * as receipts from "@swaraj/receipts";
import { runDecisionProofWorkerOnce } from "@swaraj/proofs/decision-proof-worker";
import { runProofWorkerOnce } from "@swaraj/proofs/proof-worker";
import { deriveGuestOutput } from "@swaraj/proofs/public-values";
import { createWorkerDependencies, proveAndEnqueue } from "@swaraj/proofs/worker-adapter";
import { createZkVerifyClient, SP1_PALLET } from "@swaraj/proofs/zkverify";
import { buildApp } from "../dist/app.js";
import { DEMO_STATE } from "../dist/pipeline/index.js";

const url = process.env.SWARAJ_TEST_DATABASE_URL;
const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const SIGNER_KEY = "0x" + "11".repeat(32);
const IMAGE_ID = `0x${"d".repeat(64)}`;
const hex32 = () => `0x${randomBytes(32).toString("hex")}`;

/** Stand-in for the SP1 host: the artifact carries exactly the public values the guest would commit. */
function simulatedSp1Host() {
  return {
    async prove(bundleFile, outDir) {
      const bundle = JSON.parse(await readFile(bundleFile, "utf8"));
      const out = deriveGuestOutput(bundle);
      const scope = out.decisionAllow && out.claimType === "TRADE_EXECUTED" && bundle.receiptBinding ? "TRADE_RECEIPT_V1"
        : !out.decisionAllow && out.violatedRuleIds.length > 0 ? "BLOCK_DECISION_V1" : "POLICY_DECISION_V1";
      const artifact = {
        schemaVersion: 1, proofSystem: "SP1-5.x", claimScope: scope, proof: "0x0102", imageId: IMAGE_ID, pubInputs: out.publicValues,
        localVerified: true, publicDecision: out.decisionAllow ? "ALLOW" : "BLOCK", violatedRuleIds: out.violatedRuleIds,
        claimType: out.claimType, ...(bundle.receiptBinding ? { receiptId: bundle.receiptBinding.receiptId } : {}),
        sp1ProofFile: "swaraj-verification-proof.bin", sp1ProofSha256: "a".repeat(64),
      };
      const file = join(outDir, "zkverify-proof.json");
      await writeFile(file, JSON.stringify(artifact, null, 2));
      return file;
    },
    async verify(file) {
      const artifact = JSON.parse(await readFile(file, "utf8"));
      return { verified: true, imageId: artifact.imageId, publicValues: artifact.pubInputs };
    },
  };
}

/** Fake zkVerify chain: records each submitted extrinsic; finality is advanced by the test. */
function simulatedChain() {
  const blocks = new Map();
  const chain = { finalizedNumber: 0, height: 0, submissions: 0 };
  const FINAL_HEAD = hex32();
  const phase = (i) => ({ isApplyExtrinsic: true, asApplyExtrinsic: { toNumber: () => i } });
  const ev = (section, method, ...data) => ({ section, method, data: data.map((d) => ({ toString: () => String(d) })) });
  chain.api = {
    rpc: { chain: {
      getHeader: async (hash) => ({ number: { toNumber: () => (hash === FINAL_HEAD ? chain.finalizedNumber : blocks.get(hash).number) } }),
      getFinalizedHead: async () => FINAL_HEAD,
      getBlockHash: async (n) => ({ toHex: () => [...blocks].find(([, b]) => b.number === n)[0] }),
      getBlock: async (hash) => ({ block: { extrinsics: [blocks.get(hash).extrinsic] } }),
    } },
    at: async (hash) => ({ query: { system: { events: async () => [{ phase: phase(0), event: ev(SP1_PALLET, "ProofVerified", blocks.get(hash).statement) }] } } }),
  };
  chain.session = {
    api: chain.api,
    verify: () => ({ sp1: () => ({ execute: ({ proofData }) => {
      chain.submissions += 1;
      const txHash = hex32();
      const blockHash = hex32();
      chain.height += 1;
      blocks.set(blockHash, {
        number: chain.height,
        statement: hex32(),
        extrinsic: { hash: { toHex: () => txHash }, method: { section: SP1_PALLET, method: "submitProof", args: [{ toJSON: () => ({ vk: proofData.vk }) }, {}, { toHex: () => proofData.publicSignals }] } },
      });
      const events = new EventEmitter();
      const transactionResult = new Promise((resolve) => setImmediate(() => {
        events.emit("includedInBlock", { txHash, blockHash });
        resolve({ txHash, blockHash });
      }));
      return { events, transactionResult };
    } }) }),
  };
  return chain;
}

test("Phase 8/9: API → proof inputs → prover → zkVerify recovery → PROVED, on Postgres", { skip: !url && "set SWARAJ_TEST_DATABASE_URL to a disposable database" }, async () => {
  const pool = db.createDatabase(url);
  const artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-proofs-"));
  const savedFinality = process.env.SWARAJ_EVIDENCE_FINALITY;
  try {
    await pool.query("TRUNCATE proof_jobs, decision_proof_jobs, proof_inputs, decision_receipts, receipt_jobs, receipts, actions, authorization_decisions CASCADE");

    // 1. API: a FINAL trade and a policy BLOCK, persisted to Postgres.
    process.env.SWARAJ_EVIDENCE_FINALITY = "FINAL";
    const app = await buildApp(token, { pipelineMode: "mock", databaseUrl: url, signer: new LocalKeySigner(SIGNER_KEY) });
    let receiptId;
    let decisionReceiptId;
    try {
      const allowed = (await app.inject({ method: "POST", url: "/v1/applications/app_demo/actions", headers, payload: { action: "trade.spot", input: {}, idempotencyKey: "pg-allow" } })).json();
      assert.deepEqual(allowed.proof, { status: "AWAITING_PROOF", claimScope: "TRADE_RECEIPT_V1" }, JSON.stringify(allowed));
      receiptId = allowed.receiptId;
      const blocked = (await app.inject({ method: "POST", url: "/v1/applications/app_demo/actions", headers, payload: { action: "trade.block", input: {}, idempotencyKey: "pg-block" } })).json();
      assert.equal(blocked.decisionReceipt.status, "PENDING", JSON.stringify(blocked));
      decisionReceiptId = blocked.decisionReceipt.id;
      const view = (await app.inject({ url: `/v1/applications/app_demo/receipts/${receiptId}`, headers })).json();
      assert.equal(view.proof.status, "AWAITING_PROOF");
      // An unprovable BLOCK is persisted as NON_PROVABLE (audit trail) and never offered to the prover.
      const invalid = (await app.inject({ method: "POST", url: "/v1/applications/app_demo/actions", headers, payload: { action: "trade.spot", input: { state: { ...DEMO_STATE, policyStatus: "PAUSED" } }, idempotencyKey: "pg-invalid" } })).json();
      assert.equal(invalid.decisionReceipt.status, "NON_PROVABLE", JSON.stringify(invalid));
      const stored = (await pool.query("SELECT status, reason_code, solver_status FROM decision_receipts WHERE id=$1", [invalid.decisionReceipt.id])).rows[0];
      assert.deepEqual(stored, { status: "NON_PROVABLE", reason_code: "OPERATIONAL_FAILURE", solver_status: "invalid" });
    } finally {
      await app.close();
    }

    // proof_inputs is append-only.
    await assert.rejects(() => pool.query("UPDATE proof_inputs SET bundle_sha256 = bundle_sha256"), /append-only/);

    // 2. Prover: both stored bundles are proved and enqueued exactly once.
    const chain = simulatedChain();
    const zkVerify = createZkVerifyClient({ openSession: () => chain.session });
    const deps = createWorkerDependencies({
      pool, db, receipts, signer: new LocalKeySigner(SIGNER_KEY), host: simulatedSp1Host(), zkVerify,
      vkeys: { v1: IMAGE_ID }, artifactRoot, finalityPollSeconds: 1,
    });
    const awaiting = await deps.prover.proofInputs.listAwaitingProof(10);
    assert.deepEqual(awaiting.map((r) => r.subjectKind).sort(), ["DECISION_RECEIPT", "TRADE_RECEIPT"]);
    for (const record of awaiting) await proveAndEnqueue(record, { ...deps.prover, vkeyVersion: "v1" });
    assert.equal((await deps.prover.proofInputs.listAwaitingProof(10)).length, 0);

    // 3. Trade worker: submission is included but not final → INCLUDED with the block hash persisted.
    assert.equal((await runProofWorkerOnce(deps.trade)).status, "AWAITING_FINALITY");
    let job = await deps.trade.queue.getByReceipt("app_demo", receiptId);
    assert.equal(job.state, "INCLUDED");
    assert.match(job.zkverifyBlockHash, /^0x[0-9a-f]{64}$/);
    assert.equal((await runProofWorkerOnce(deps.trade)).status, "IDLE", "polling waits for the backoff");

    // 4. Finality arrives; a fresh worker (as after a crash) recovers the same extrinsic without resubmitting.
    chain.finalizedNumber = chain.height;
    await pool.query("UPDATE proof_jobs SET next_attempt_at = now()");
    const proved = await runProofWorkerOnce(deps.trade);
    assert.equal(proved.status, "PROVED");
    assert.equal(chain.submissions, 1);
    const row = (await pool.query("SELECT status, proof_reference, signed_receipt FROM receipts WHERE application_id='app_demo' AND id=$1", [receiptId])).rows[0];
    assert.equal(row.status, "PROVED");
    assert.equal(row.proof_reference, job.zkverifyTxHash);
    assert.equal(row.signed_receipt.proof.programVkeyHash, IMAGE_ID);
    // The PROVED receipt is re-signed by the worker's key and still verifies.
    const address = new LocalKeySigner(SIGNER_KEY).address;
    const registry = new KeyRegistry([{ keyId: deriveKeyId(address), address, validFrom: 0 }]);
    assert.equal(await verifyReceiptSignature(row.signed_receipt, registry), true);
    job = await deps.trade.queue.getByReceipt("app_demo", receiptId);
    assert.equal(job.state, "FINALIZED");

    // 5. Decision worker: same lifecycle for the BLOCK Decision Receipt.
    assert.equal((await runDecisionProofWorkerOnce(deps.decision)).status, "AWAITING_FINALITY");
    chain.finalizedNumber = chain.height;
    await pool.query("UPDATE decision_proof_jobs SET next_attempt_at = now()");
    assert.equal((await runDecisionProofWorkerOnce(deps.decision)).status, "PROVED");
    const decision = await deps.decision.decisionReceipts.get(decisionReceiptId);
    assert.equal(decision.status, "PROVED");
    assert.equal(decision.proofMetadata.decision, "BLOCK");
    assert.deepEqual(decision.proofMetadata.violatedRuleIds, decision.violatedRuleIds);
    assert.equal(chain.submissions, 2);

    // A PENDING (provable) Decision Receipt still requires rules and a sat/unsat solver status.
    await assert.rejects(() => pool.query(
      `INSERT INTO decision_receipts (id,decision_log_entry_hash,intent_hash,policy_hash,state_hash,decision,violated_rule_ids,reference_time,verifier_version,solver_status)
       VALUES (gen_random_uuid(),$1,$2,$2,$2,'BLOCK','[]'::jsonb,0,'0.1.0','timeout')`, [hex32(), `0x${"a".repeat(64)}`]), /provable_check/);
    // A signed attestation is stored with the PROVED Decision Receipt.
    assert.equal(decision.proofMetadata.signedDecisionReceipt.id, decisionReceiptId);

    // 6. Queue semantics: an INCLUDED job is never abandoned for attempts; a deterministic rejection is terminal.
    const extra = await deps.trade.queue.enqueue({ applicationId: "app_demo", receiptId, artifactPath: "x/zkverify-proof.json", artifactSha256: "f".repeat(64), vkeyVersion: "v1" });
    await pool.query("UPDATE proof_jobs SET state='SUBMITTING', attempts=99 WHERE id=$1", [extra.id]);
    await deps.trade.queue.markIncluded(extra.id, { network: "zkVerify-Volta", txHash: hex32(), blockHash: hex32() });
    assert.equal((await deps.trade.queue.fail(extra.id, "rpc unavailable", 5)).state, "INCLUDED");
    assert.equal((await deps.trade.queue.fail(extra.id, "public inputs mismatch", 5, true)).state, "NON_PROVABLE");
  } finally {
    if (savedFinality === undefined) delete process.env.SWARAJ_EVIDENCE_FINALITY; else process.env.SWARAJ_EVIDENCE_FINALITY = savedFinality;
    await rm(artifactRoot, { recursive: true, force: true });
    await pool.end();
  }
});
