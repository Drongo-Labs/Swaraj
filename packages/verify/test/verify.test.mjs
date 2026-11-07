import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { hashObject, LocalKeySigner } from "@swaraj/crypto";
import { ObjectType, parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import { bundleDigest, statementText, verifyReceiptBundle } from "../dist/index.js";

const issuer = new LocalKeySigner("0x" + "11".repeat(32));
const sha = (t) => createHash("sha256").update(t).digest("hex");

const mandate = {
  mandateId: "m", version: 1, agent: "*", defaultEffect: "DENY", validFrom: 0, validUntil: 4102444800000,
  rules: [{ ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] }],
};
const action = {
  intentId: "i", agent: "agent:a", action: "PAYMENT", resource: { service: "near_transfer" },
  context: { amount: "5", currency: "NEAR", recipient: "v.testnet" },
  policyHash: "0x" + "9".repeat(64), timestamp: 1790000000000, expiry: 1790000300000,
  idempotencyKey: "k", signature: "0x" + "00".repeat(65),
};
const near = { hash: "Hash", signerId: "a.testnet", expect: { kind: "transfer", receiverId: "v.testnet", amount: "5" } };

async function bundle(overrides = {}) {
  const base = {
    version: "swaraj/receipt-bundle/v1", receiptId: "r1", state: "PROVED", proofRef: "ref", action, mandate,
    intentHash: `0x${sha(serializeUnifiedAction(parseUnifiedAction(action)))}`,
    mandateHash: hashObject(ObjectType.POLICY_PROFILE, mandate),
    decision: "ALLOW", matchedRuleIds: ["permit_pay"], evidenceDigest: "0x" + "ab".repeat(32), chainExecution: near,
    issuer: issuer.address,
    ...overrides,
  };
  base.statementText = statementText(base);
  base.statementId = `stmt_${sha(base.statementText)}`;
  base.signature = await issuer.signDigest(bundleDigest(base));
  return base;
}

const failed = (result) => result.checks.filter((c) => !c.ok).map((c) => c.name);
const verify = (b, extra = {}) => verifyReceiptBundle(b, { issuer: issuer.address, ...extra });

test("an honest bundle verifies with no service", async () => {
  const result = await verify(await bundle());
  assert.equal(result.valid, true, JSON.stringify(result.checks));
});

test("a re-signed bundle cannot claim a decision the mandate does not produce", async () => {
  const lie = await bundle({ mandate: { ...mandate, rules: [] }, mandateHash: hashObject(ObjectType.POLICY_PROFILE, { ...mandate, rules: [] }) });
  assert.deepEqual(failed(await verify(lie)), ["decision recomputes from the mandate"]);
});

test("tampering after signing is caught", async () => {
  const honest = await bundle();
  assert.ok(failed(await verify({ ...honest, action: { ...action, context: { ...action.context, amount: "6" } } })).includes("intent hash"));
  assert.ok(failed(await verify({ ...honest, statementText: `${honest.statementText}x` })).includes("statement text"));
  assert.ok(failed(await verify({ ...honest, state: "PENDING" })).includes("issuer signature"));
});

test("a signature from anyone else fails", async () => {
  const result = await verifyReceiptBundle(await bundle(), { issuer: new LocalKeySigner("0x" + "22".repeat(32)).address });
  assert.deepEqual(failed(result), ["issuer signature"]);
});

test("a NEAR transaction to someone other than the action's recipient fails", async () => {
  const redirected = await bundle({ chainExecution: { ...near, expect: { ...near.expect, receiverId: "evil.testnet" } } });
  assert.deepEqual(failed(await verify(redirected)), ["on-chain target matches the action"]);
});

test("the optional chain check rejects a transaction that is not final", async () => {
  const stub = async (_u, init) => {
    const { method } = JSON.parse(init.body);
    const result = method === "tx"
      ? { final_execution_status: "EXECUTED", status: { SuccessValue: "" }, transaction: { receiver_id: "v.testnet", actions: [{ Transfer: { deposit: "5" } }] }, receipts_outcome: [] }
      : method === "block" ? { header: { hash: "H" } } : {};
    return new Response(JSON.stringify({ result }));
  };
  const result = await verify(await bundle(), { nearRpcUrl: "http://rpc", fetchImpl: stub });
  assert.deepEqual(failed(result), ["transaction is final on NEAR"]);
});
