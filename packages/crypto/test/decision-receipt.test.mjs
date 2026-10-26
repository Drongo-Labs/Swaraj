import assert from "node:assert/strict";
import test from "node:test";
import { deriveKeyId, KeyRegistry, LocalKeySigner, signDecisionReceipt, verifyDecisionReceiptSignature } from "../dist/index.js";

const signer = new LocalKeySigner("0x" + "22".repeat(32));
const registry = new KeyRegistry([{ keyId: deriveKeyId(signer.address), address: signer.address, validFrom: 0 }]);
const h = (c) => `0x${c.repeat(64)}`;
const unsigned = {
  id: "00000000-0000-4000-8000-000000000001", status: "PROVED", decision: "BLOCK", violatedRuleIds: [3, 6],
  intentHash: h("a"), policyHash: h("b"), stateHash: h("c"), decisionLogEntryHash: h("e"), referenceTime: 1790000000,
  verifierVersion: "0.1.0", proof: { proofSystem: "SP1", proofHash: h("1") }, zkVerify: { network: "zkVerify", txHash: h("2"), finalized: true },
  signedAt: 1790000500,
};

test("signed Decision Receipts verify and any change breaks the signature", async () => {
  const signed = await signDecisionReceipt(unsigned, signer);
  assert.equal(await verifyDecisionReceiptSignature(signed, registry), true);
  assert.equal(await verifyDecisionReceiptSignature({ ...signed, violatedRuleIds: [3] }, registry), false);
  assert.equal(await verifyDecisionReceiptSignature({ ...signed, zkVerify: { ...signed.zkVerify, txHash: h("3") } }, registry), false);
  assert.equal(await verifyDecisionReceiptSignature(signed, new KeyRegistry()), false);
});

test("only PROVED BLOCK receipts are signed", async () => {
  await assert.rejects(() => signDecisionReceipt({ ...unsigned, status: "PENDING" }, signer), /only PROVED BLOCK/);
});
