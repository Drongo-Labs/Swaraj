import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { inspect } from "node:util";
import test from "node:test";
import * as S from "@swaraj/schemas";
import { KeyRegistry, LocalKeySigner, deriveKeyId, signReceipt, verifyReceiptSignature } from "../dist/index.js";

const KEY_A = "0x" + "11".repeat(32);
const KEY_B = "0x" + "22".repeat(32);
const unsigned = S.parseReceiptUnsigned(JSON.parse(readFileSync(new URL("../../schemas/fixtures/valid/receipt-unsigned.json", import.meta.url), "utf8")));
const at = unsigned.createdAt;

const registryFor = (...signers) =>
  new KeyRegistry(signers.map((s) => ({ keyId: deriveKeyId(s.address), address: s.address, validFrom: at - 1000 })));

test("right signer verifies; signature carries keyId", async () => {
  const signer = new LocalKeySigner(KEY_A);
  const signed = await signReceipt(unsigned, signer);
  assert.equal(signed.signerKeyId, deriveKeyId(signer.address));
  assert.match(signed.signature, /^0x[0-9a-f]{130}$/);
  assert.ok(S.SignedReceiptSchema.safeParse(signed).success);
  assert.ok(await verifyReceiptSignature(signed, registryFor(signer)));
  assert.deepEqual(await signReceipt(unsigned, signer), signed, "deterministic (RFC 6979)");
});

test("wrong signer fails", async () => {
  const a = new LocalKeySigner(KEY_A);
  const b = new LocalKeySigner(KEY_B);
  const signed = await signReceipt(unsigned, a);
  assert.equal(await verifyReceiptSignature(signed, registryFor(b)), false, "key not registered");
  const forged = { ...(await signReceipt(unsigned, b)), signerKeyId: signed.signerKeyId };
  assert.equal(await verifyReceiptSignature(forged, registryFor(a, b)), false, "b's signature under a's keyId");
  const swapped = { ...signed, signature: (await signReceipt(unsigned, b)).signature };
  assert.equal(await verifyReceiptSignature(swapped, registryFor(a, b)), false);
});

test("any edited field fails", async () => {
  const signer = new LocalKeySigner(KEY_A);
  const registry = registryFor(signer);
  const signed = await signReceipt(unsigned, signer);
  const edits = {
    receiptId: "receipt_0002", status: "NON_PROVABLE", claimType: "ORDER_PLACED", intentHash: "0x" + "9".repeat(64),
    policyHash: "0x" + "9".repeat(64), evidenceRoot: "0x" + "9".repeat(64), verifierVersion: "0.1.1", createdAt: signed.createdAt + 1,
    signerKeyId: "0x" + "9".repeat(64), signature: "0x" + "9".repeat(130),
  };
  for (const [field, value] of Object.entries(edits)) {
    assert.equal(await verifyReceiptSignature({ ...signed, [field]: value }, registry), false, field);
  }
  const { signature, ...missing } = signed;
  assert.equal(await verifyReceiptSignature(missing, registry), false);
  assert.equal(await verifyReceiptSignature({ ...signed, extra: 1 }, registry), false);
  assert.equal(await verifyReceiptSignature(null, registry), false);
});

test("key window, revocation and rotation", async () => {
  const oldKey = new LocalKeySigner(KEY_A);
  const newKey = new LocalKeySigner(KEY_B);
  const oldId = deriveKeyId(oldKey.address);
  const registry = new KeyRegistry([{ keyId: oldId, address: oldKey.address, validFrom: at - 100 }]);
  const receipt = await signReceipt(unsigned, oldKey);
  assert.ok(await verifyReceiptSignature(receipt, registry));

  // Before validFrom / after validUntil (exclusive) fail.
  assert.equal(await verifyReceiptSignature(await signReceipt({ ...unsigned, createdAt: at - 101 }, oldKey), registry), false, "before window");
  assert.ok(await verifyReceiptSignature(await signReceipt({ ...unsigned, createdAt: at - 100 }, oldKey), registry), "validFrom inclusive");

  // Rotate: old key retired after the receipt, new key added. Old receipts stay valid.
  registry.retire(oldId, at + 500);
  registry.add({ keyId: deriveKeyId(newKey.address), address: newKey.address, validFrom: at + 500 });
  assert.ok(await verifyReceiptSignature(receipt, registry), "rotated-out key still verifies old receipts");
  assert.equal(await verifyReceiptSignature(await signReceipt({ ...unsigned, createdAt: at + 500 }, oldKey), registry), false, "expired window");
  assert.ok(await verifyReceiptSignature(await signReceipt({ ...unsigned, createdAt: at + 500 }, newKey), registry));
  assert.equal(await verifyReceiptSignature(await signReceipt({ ...unsigned, createdAt: at + 499 }, newKey), registry), false, "new key not yet valid");

  // Revoke: receipts stamped at/after revokedAt fail, earlier ones remain.
  registry.revoke(oldId, at + 10);
  assert.ok(await verifyReceiptSignature(receipt, registry), "signed before revocation");
  assert.equal(await verifyReceiptSignature(await signReceipt({ ...unsigned, createdAt: at + 10 }, oldKey), registry), false, "revoked");
});

test("registry validates entries and one-way transitions", () => {
  const signer = new LocalKeySigner(KEY_A);
  const keyId = deriveKeyId(signer.address);
  const entry = { keyId, address: signer.address, validFrom: 10 };
  assert.throws(() => new KeyRegistry([{ ...entry, keyId: "0x" + "1".repeat(64) }]), /does not match/);
  assert.throws(() => new KeyRegistry([entry, entry]), /already registered/);
  assert.throws(() => new KeyRegistry([{ ...entry, validUntil: 10 }]), /validUntil/);
  assert.throws(() => new KeyRegistry([{ ...entry, validFrom: -1 }]), /validFrom/);
  const registry = new KeyRegistry([entry]);
  registry.retire(keyId, 20);
  assert.throws(() => registry.retire(keyId, 30), /already retired/);
  registry.revoke(keyId, 15);
  assert.throws(() => registry.revoke(keyId, 12), /already revoked/);
  assert.throws(() => registry.revoke("0x" + "1".repeat(64), 1), /unknown key/);
  assert.equal(registry.isValidAt(keyId, 14), true);
  assert.equal(registry.isValidAt(keyId, 15), false);
  assert.equal(registry.isValidAt("0x" + "1".repeat(64), 14), false);
  registry.get(keyId).revokedAt = undefined;
  assert.equal(registry.get(keyId).revokedAt, 15, "get returns a copy");
});

test("signer never exposes the private key", () => {
  const signer = new LocalKeySigner(KEY_A);
  for (const text of [JSON.stringify(signer), inspect(signer, { showHidden: true, depth: 5 }), String(signer), inspect({ signer })]) {
    assert.ok(!text.includes("11".repeat(32)), text);
  }
  assert.throws(() => new LocalKeySigner("nope"), /invalid private key format/);
  assert.throws(() => new LocalKeySigner(KEY_A.slice(0, 40)), (e) => !e.message.includes("1111"));
  assert.throws(() => LocalKeySigner.fromEnv({}), /SWARAJ_SIGNER_PRIVATE_KEY is not set/);
  assert.equal(LocalKeySigner.fromEnv({ SWARAJ_SIGNER_PRIVATE_KEY: KEY_A }).address, signer.address);
});

test("signReceipt rejects invalid receipts (e.g. PROVED without proof)", async () => {
  const signer = new LocalKeySigner(KEY_A);
  await assert.rejects(signReceipt({ ...unsigned, status: "PROVED" }, signer));
  await assert.rejects(signReceipt({ ...unsigned, extra: 1 }, signer));
});

test("PROVED receipts sign and verify with proof metadata", async () => {
  const proved = S.parseReceiptUnsigned(JSON.parse(readFileSync(new URL("../../schemas/fixtures/valid/receipt-proved.json", import.meta.url), "utf8")));
  const signer = new LocalKeySigner(KEY_A);
  const signed = await signReceipt(proved, signer);
  assert.ok(await verifyReceiptSignature(signed, registryFor(signer)));
  const tampered = { ...signed, proof: { ...signed.proof, proofHash: "0x" + "0".repeat(64) } };
  assert.equal(await verifyReceiptSignature(tampered, registryFor(signer)), false);
});
