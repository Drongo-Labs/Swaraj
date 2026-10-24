import assert from "node:assert/strict";
import test from "node:test";
import { deriveKeyId, KeyRegistry, LocalKeySigner, verifyReceiptSignature } from "@swaraj/crypto";
import {
  assertTransition,
  canTransition,
  createMemoryReceiptStore,
  createReceiptEngine,
  IllegalTransitionError,
  ReasonCode,
} from "../dist/index.js";

const KEY = "0x" + "11".repeat(32);
const HASH = (n) => "0x" + String(n).repeat(64);

test("illegal transitions are rejected", () => {
  assert.throws(() => assertTransition("NON_PROVABLE", "PENDING"), IllegalTransitionError);
  assert.throws(() => assertTransition("PROVED", "PENDING"), IllegalTransitionError);
  assert.throws(() => assertTransition("DEV_UNVERIFIED", "PROVED"), IllegalTransitionError);
  assert.equal(canTransition("PENDING", "NON_PROVABLE"), true);
  assert.equal(canTransition("PENDING", "DEV_UNVERIFIED"), true);
  assert.equal(canTransition("PENDING", "PROVED"), true);
  assert.equal(canTransition("NON_PROVABLE", "PROVED"), false);
});

test("create PENDING receipt is signed and idempotent", async () => {
  const signer = new LocalKeySigner(KEY);
  const store = createMemoryReceiptStore();
  const engine = createReceiptEngine(store);
  const params = {
    applicationId: "app_demo",
    receiptId: "receipt_0001",
    actionId: "action_0001",
    intentHash: HASH(1),
    policyHash: HASH(2),
    evidenceRoot: HASH(7),
    claimType: "TRADE_EXECUTED",
    finalityRule: "BASE_CONFIRMATIONS_12",
    verifierVersion: "0.1.0",
    createdAt: 1790000250,
    signer,
  };
  const first = await engine.createPendingReceipt(params);
  assert.equal(first.status, "PENDING");
  assert.equal(first.signedReceipt.status, "PENDING");
  const registry = new KeyRegistry([
    { keyId: deriveKeyId(signer.address), address: signer.address, validFrom: params.createdAt - 1000 },
  ]);
  assert.ok(await verifyReceiptSignature(first.signedReceipt, registry));

  const second = await engine.createPendingReceipt(params);
  assert.equal(second.receiptId, first.receiptId);
  assert.deepEqual(second.signedReceipt, first.signedReceipt);

  await assert.rejects(
    () => engine.createPendingReceipt({ ...params, intentHash: HASH(9) }),
    /idempotency conflict/,
  );
});

test("restart mid-PENDING still loadable", async () => {
  const signer = new LocalKeySigner(KEY);
  const store = createMemoryReceiptStore();
  const engine = createReceiptEngine(store);
  await engine.createPendingReceipt({
    applicationId: "app_demo",
    receiptId: "receipt_restart",
    actionId: "action_restart",
    intentHash: HASH(1),
    policyHash: HASH(2),
    evidenceRoot: HASH(7),
    claimType: "TRADE_EXECUTED",
    finalityRule: "BASE_CONFIRMATIONS_12",
    verifierVersion: "0.1.0",
    createdAt: 1790000250,
    signer,
  });
  const loaded = await engine.getReceipt("app_demo", "receipt_restart");
  assert.ok(loaded);
  assert.equal(loaded.status, "PENDING");
});

test("conflict evidence path marks NON_PROVABLE with EVIDENCE_CONFLICT", async () => {
  const signer = new LocalKeySigner(KEY);
  const store = createMemoryReceiptStore();
  const engine = createReceiptEngine(store);
  await engine.createPendingReceipt({
    applicationId: "app_demo",
    receiptId: "receipt_conflict",
    actionId: "action_conflict",
    intentHash: HASH(1),
    policyHash: HASH(2),
    evidenceRoot: HASH(7),
    claimType: "TRADE_EXECUTED",
    finalityRule: "BASE_CONFIRMATIONS_12",
    verifierVersion: "0.1.0",
    createdAt: 1790000250,
    signer,
  });
  const marked = await engine.markNonProvable("app_demo", "receipt_conflict", ReasonCode.EVIDENCE_CONFLICT, signer);
  assert.equal(marked.status, "NON_PROVABLE");
  assert.equal(marked.reasonCode, ReasonCode.EVIDENCE_CONFLICT);
  assert.equal(marked.signedReceipt.status, "NON_PROVABLE");
  const registry = new KeyRegistry([
    { keyId: deriveKeyId(signer.address), address: signer.address, validFrom: 1790000250 - 1000 },
  ]);
  assert.ok(await verifyReceiptSignature(marked.signedReceipt, registry));
});

test("markProved requires proof metadata and only from PENDING", async () => {
  const signer = new LocalKeySigner(KEY);
  const engine = createReceiptEngine(createMemoryReceiptStore());
  await engine.createPendingReceipt({
    applicationId: "app_demo",
    receiptId: "receipt_proved",
    actionId: "action_proved",
    intentHash: HASH(1),
    policyHash: HASH(2),
    evidenceRoot: HASH(7),
    claimType: "TRADE_EXECUTED",
    finalityRule: "BASE_CONFIRMATIONS_12",
    verifierVersion: "0.1.0",
    createdAt: 1790000250,
    signer,
  });
  const proof = {
    proofSystem: "SP1",
    proofHash: HASH(8),
    programVkeyHash: HASH(9),
    publicInputsHash: HASH("a"),
  };
  await assert.rejects(
    () => engine.markProved("app_demo", "receipt_proved", proof, " ", signer),
    /proof reference is required/,
  );
  const proved = await engine.markProved("app_demo", "receipt_proved", proof, "zkverify:statement-1", signer);
  assert.equal(proved.status, "PROVED");
  assert.deepEqual(proved.signedReceipt.proof, proof);
  assert.equal(proved.proofReference, "zkverify:statement-1");
  await assert.rejects(
    () => engine.markProved("app_demo", "receipt_proved", proof, "zkverify:statement-1", signer),
    IllegalTransitionError,
  );
});

test("cannot transition twice from PENDING after NON_PROVABLE", async () => {
  const signer = new LocalKeySigner(KEY);
  const engine = createReceiptEngine(createMemoryReceiptStore());
  await engine.createPendingReceipt({
    applicationId: "app_demo",
    receiptId: "receipt_once",
    actionId: "action_once",
    intentHash: HASH(1),
    policyHash: HASH(2),
    evidenceRoot: HASH(7),
    claimType: "ORDER_PLACED",
    finalityRule: "BASE_CONFIRMATIONS_12",
    verifierVersion: "0.1.0",
    createdAt: 1790000250,
    signer,
  });
  await engine.markNonProvable("app_demo", "receipt_once", ReasonCode.SCHEMA, signer);
  await assert.rejects(
    () => engine.markDevUnverified("app_demo", "receipt_once", signer),
    IllegalTransitionError,
  );
});
