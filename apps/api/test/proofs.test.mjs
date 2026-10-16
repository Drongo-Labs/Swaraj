import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore } from "@swaraj/receipts";
import { deriveGuestOutput } from "@swaraj/proofs/public-values";
import { preflightTradeProof } from "@swaraj/proofs/receipt-gate";
import { preflightDecisionProof } from "@swaraj/proofs/decision-receipt-gate";
import { buildApp } from "../dist/app.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const IMAGE_ID = `0x${"d".repeat(64)}`;

async function withApp(env, fn) {
  const saved = Object.fromEntries(Object.keys(env).map((k) => [k, process.env[k]]));
  Object.assign(process.env, env);
  const app = await buildApp(token, { pipelineMode: "mock", receiptStore: createMemoryReceiptStore(), signer: new LocalKeySigner("0x" + "11".repeat(32)) });
  try {
    await fn(app);
  } finally {
    await app.close();
    for (const [k, v] of Object.entries(saved)) if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
}
const act = (app, action, key) => app.inject({ method: "POST", url: "/v1/applications/app_demo/actions", headers, payload: { action, input: {}, idempotencyKey: key } });

test("ALLOW over FINAL evidence records a receipt-bound bundle that passes the Phase 8 gate preflight", async () => {
  await withApp({ SWARAJ_EVIDENCE_FINALITY: "FINAL" }, async (app) => {
    const created = await act(app, "trade.spot", "phase8-final");
    assert.equal(created.statusCode, 200, created.body);
    assert.deepEqual(created.json().proof, { status: "AWAITING_PROOF", claimScope: "TRADE_RECEIPT_V1" });
    const receiptId = created.json().receiptId;

    const view = (await app.inject({ url: `/v1/applications/app_demo/receipts/${receiptId}`, headers })).json();
    assert.equal(view.status, "PENDING");
    assert.equal(view.proof.status, "AWAITING_PROOF");
    assert.equal(view.assumptions.claimScope, "TRADE_RECEIPT_V1");

    const { guestBundle } = (await app.inject({ url: `/v1/applications/app_demo/receipts/${receiptId}/guest-bundle`, headers })).json();
    assert.deepEqual(guestBundle.receiptBinding, { receiptId, createdAt: view.signedReceipt.createdAt });
    const output = deriveGuestOutput(guestBundle);
    assert.equal(output.decisionAllow, true);
    assert.equal(output.claimType, "TRADE_EXECUTED");
    // The SP1 artifact for this bundle would carry exactly these public values; the gate must accept them for this receipt.
    const receipt = { status: view.status, claimType: view.claim, intentHash: view.intentHash, policyHash: view.policyHash, evidenceRoot: view.evidenceRoot, signedReceipt: view.signedReceipt };
    const artifact = { localVerified: true, claimScope: "TRADE_RECEIPT_V1", proof: "0x01", imageId: IMAGE_ID, pubInputs: output.publicValues, receiptId };
    const parsed = preflightTradeProof({ receipt, artifact, expectedPublicInputs: output.publicValues, expectedImageId: IMAGE_ID });
    assert.equal(parsed.intentHash, created.json().intentHash);
  });
});

test("ALLOW with finality still pending is reported as not provable yet", async () => {
  await withApp({ SWARAJ_EVIDENCE_FINALITY: "" }, async (app) => {
    const created = await act(app, "trade.spot", "phase8-pending");
    assert.equal(created.json().status, "PENDING");
    assert.equal(created.json().proof.status, "NOT_PROVABLE");
    assert.deepEqual(created.json().proof.guestRuleIds, [14]);
    const view = (await app.inject({ url: `/v1/applications/app_demo/receipts/${created.json().receiptId}`, headers })).json();
    assert.equal(view.proof.status, "NOT_QUEUED");
  });
});

test("a provable BLOCK creates a PENDING Decision Receipt bound to the decision log", async () => {
  await withApp({}, async (app) => {
    const blocked = await act(app, "trade.block", "phase9-block");
    assert.equal(blocked.statusCode, 200, blocked.body);
    const { decisionReceipt, decisionId } = blocked.json();
    assert.ok(decisionId);
    assert.equal(decisionReceipt.status, "PENDING");
    assert.ok(decisionReceipt.violatedRuleIds.length > 0);
    assert.equal(decisionReceipt.violatedRuleIds.includes(14), false);

    const view = (await app.inject({ url: `/v1/applications/app_demo/decision-receipts/${decisionReceipt.id}`, headers })).json();
    assert.equal(view.status, "PENDING");
    assert.equal(view.proof.claimScope, "BLOCK_DECISION_V1");
    assert.equal(view.proof.status, "AWAITING_PROOF");
    assert.match(view.decisionLogEntryHash, /^0x[0-9a-f]{64}$/);
    assert.equal(view.intentHash, blocked.json().intentHash);

    const { guestBundle } = (await app.inject({ url: `/v1/applications/app_demo/decision-receipts/${decisionReceipt.id}/guest-bundle`, headers })).json();
    const output = deriveGuestOutput(guestBundle);
    const artifact = { localVerified: true, claimScope: "BLOCK_DECISION_V1", proof: "0x01", imageId: IMAGE_ID, pubInputs: output.publicValues };
    const { provedRules } = preflightDecisionProof({ decisionReceipt: { ...view, solverStatus: "unsat" }, artifact, expectedPublicInputs: output.publicValues, expectedImageId: IMAGE_ID });
    assert.deepEqual(provedRules, decisionReceipt.violatedRuleIds);

    const other = await app.inject({ url: `/v1/applications/app_other/decision-receipts/${decisionReceipt.id}`, headers });
    assert.equal(other.statusCode, 404);
    const malformed = await app.inject({ url: `/v1/applications/app_demo/decision-receipts/not-a-uuid`, headers });
    assert.equal(malformed.statusCode, 404);
  });
});

test("an unprovable BLOCK is recorded as a NON_PROVABLE Decision Receipt with its reason", async () => {
  const { DEMO_STATE } = await import("../dist/pipeline/index.js");
  await withApp({}, async (app) => {
    const blocked = (await app.inject({
      method: "POST", url: "/v1/applications/app_demo/actions", headers,
      payload: { action: "trade.spot", input: { state: { ...DEMO_STATE, policyStatus: "PAUSED" } }, idempotencyKey: "phase9-invalid" },
    })).json();
    assert.equal(blocked.decision, "BLOCK");
    assert.equal(blocked.decisionReceipt.status, "NON_PROVABLE");
    assert.equal(blocked.decisionReceipt.reasonCode, "OPERATIONAL_FAILURE");
    const view = (await app.inject({ url: `/v1/applications/app_demo/decision-receipts/${blocked.decisionReceipt.id}`, headers })).json();
    assert.equal(view.status, "NON_PROVABLE");
    assert.equal(view.solverStatus, "invalid");
    assert.match(view.decisionLogEntryHash, /^0x[0-9a-f]{64}$/);
    assert.equal(view.proof.status, "NOT_QUEUED");
  });
});
