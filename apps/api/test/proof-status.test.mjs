import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore } from "@swaraj/receipts";
import { buildApp } from "../dist/app.js";
import { proofStackStatus } from "../dist/auto-prove.js";
import { destinationTxUrl, proofJobFields, sanitizeProofError, zkVerifyExplorerUrl } from "../dist/kurier.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const ZK_TX = `0x${"7".repeat(64)}`;
const BASE_TX = `0x${"c".repeat(64)}`;
const base = { attempts: 1, submissionProvider: "KURIER", providerJobId: "job-1", destinationChainId: 84532, zkverifyNetwork: "zkVerify" };

test("zkVerify and Base Sepolia links use their own network and their own hash", () => {
  assert.equal(zkVerifyExplorerUrl("zkVerify", ZK_TX), `https://zkverify.subscan.io/extrinsic/${ZK_TX}`);
  // Jobs without a recorded network default to zkVerify.
  assert.equal(zkVerifyExplorerUrl(undefined, ZK_TX), `https://zkverify.subscan.io/extrinsic/${ZK_TX}`);
  assert.equal(destinationTxUrl(84532, BASE_TX), `https://sepolia.basescan.org/tx/${BASE_TX}`);
  assert.equal(destinationTxUrl(84532, undefined), undefined);
  assert.equal(destinationTxUrl(1, BASE_TX), undefined);
});

test("proof fields cover pending, failed, verified-but-unpublished and published jobs", () => {
  const pending = proofJobFields({ ...base, state: "SUBMITTED", providerStatus: "Queued", providerStatusAt: new Date(0) });
  assert.equal(pending.kurierStatus, "Queued");
  assert.equal(pending.statusCheckedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(pending.zkVerifyUrl, undefined);
  assert.equal(pending.kurierUrl, undefined, "no unverified /jobs/<id> page is linked");
  assert.deepEqual(pending.destination, { chainId: 84532, name: "base-sepolia", status: "AWAITING_ZKVERIFY" });

  const failed = proofJobFields({ ...base, state: "NON_PROVABLE", providerStatus: "Failed", lastError: "Kurier job-status failed: https://k/api/v1/job-status/sekret/job-1" });
  assert.equal(failed.lastError.includes("sekret"), false);

  const verified = proofJobFields({ ...base, state: "FINALIZED", zkverifyTxHash: ZK_TX, zkverifyStatement: `0x${"9".repeat(64)}`, aggregationId: "12", publicationState: "PENDING", providerStatus: "Aggregated" });
  assert.equal(verified.transactionHash, ZK_TX);
  assert.equal(verified.zkVerifyUrl, `https://zkverify.subscan.io/extrinsic/${ZK_TX}`);
  assert.equal(verified.kurierUrl, verified.zkVerifyUrl, "kurierUrl stays for older callers");
  assert.deepEqual(verified.destination, { chainId: 84532, name: "base-sepolia", status: "PENDING" });

  const published = proofJobFields({ ...base, state: "FINALIZED", zkverifyTxHash: ZK_TX, publicationState: "PUBLISHED", publicationTxHash: BASE_TX });
  assert.equal(published.destination.url, `https://sepolia.basescan.org/tx/${BASE_TX}`);
  assert.equal(published.destination.url.includes(ZK_TX), false, "a zkVerify hash never appears in a Basescan link");
  const publicationFailed = proofJobFields({ ...base, state: "FINALIZED", zkverifyTxHash: ZK_TX, publicationState: "FAILED", publicationError: "aggregation leaf mismatch" });
  assert.deepEqual(publicationFailed.destination, { chainId: 84532, name: "base-sepolia", status: "FAILED", error: "aggregation leaf mismatch" });

  // Direct zkVerify jobs have no destination.
  assert.equal(proofJobFields({ attempts: 1, state: "FINALIZED", submissionProvider: "ZKVERIFY_DIRECT", zkverifyTxHash: ZK_TX }).destination, undefined);
});

test("the Kurier API key is redacted from errors", () => {
  const saved = process.env.KURIER_API_KEY;
  process.env.KURIER_API_KEY = "live-key-abc";
  try {
    assert.equal(sanitizeProofError("boom live-key-abc boom").includes("live-key-abc"), false);
  } finally {
    if (saved === undefined) delete process.env.KURIER_API_KEY; else process.env.KURIER_API_KEY = saved;
  }
});

test("Kurier-backed verification is ready without a zkVerify seed phrase", () => {
  assert.deepEqual(proofStackStatus({ KURIER_API_KEY: "k", KURIER_CHAIN_ID: "84532" }), {
    autoProve: false, sp1: "missing_env", zkVerify: "zkverify_read_only", kurier: "configured", submission: "kurier", destination: "base-sepolia",
  });
  assert.equal(proofStackStatus({ ZKVERIFY_SEED_PHRASE: "words" }).submission, "zkverify_direct");
  assert.equal(proofStackStatus({}).zkVerify, "missing_env");
});

test("the receipt endpoint reports the durable job's provider status and separate links", async () => {
  const store = createMemoryReceiptStore();
  let job;
  const app = await buildApp(token, { pipelineMode: "mock", receiptStore: store, signer: new LocalKeySigner("0x" + "11".repeat(32)), proofJobs: { getByReceipt: async () => job } });
  try {
    const created = await app.inject({ method: "POST", url: "/v1/applications/app_demo/actions", headers, payload: { action: "trade.spot", input: {}, idempotencyKey: "proof-status" } });
    const receiptId = created.json().receiptId;
    const view = async () => (await app.inject({ url: `/v1/applications/app_demo/receipts/${receiptId}`, headers })).json().proof;

    job = { ...base, state: "SUBMITTED", providerStatus: "Valid" };
    assert.deepEqual(await view(), { status: "SUBMITTED", attempts: 1, network: "zkVerify", provider: "KURIER", kurierJobId: "job-1", kurierStatus: "Valid", destination: { chainId: 84532, name: "base-sepolia", status: "AWAITING_ZKVERIFY" } });

    job = { ...base, state: "FINALIZED", zkverifyTxHash: ZK_TX, aggregationId: "12", publicationState: "PUBLISHED", publicationTxHash: BASE_TX, providerStatus: "AggregationPublished" };
    const published = await view();
    assert.equal(published.status, "FINALIZED");
    assert.equal(published.transactionHash, ZK_TX);
    assert.equal(published.aggregationId, "12");
    assert.equal(published.zkVerifyUrl, `https://zkverify.subscan.io/extrinsic/${ZK_TX}`);
    assert.equal(published.destination.status, "PUBLISHED");
    assert.equal(published.destination.url, `https://sepolia.basescan.org/tx/${BASE_TX}`);
  } finally {
    await app.close();
  }
});
