import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { checkPermit } from "@swaraj/verify";
import { buildApp } from "../dist/app.js";

const token = "development-test-token-at-least-32-characters";
const approverToken = "approver-test-token-at-least-32-characters";
const signer = new LocalKeySigner("0x" + "11".repeat(32));

const mandate = () => ({
  mandateId: "mandate_permit", version: 1, agent: "*", defaultEffect: "DENY",
  validFrom: Date.now() - 1000, validUntil: Date.now() + 3_600_000,
  rules: [{ ruleId: "permit_small", effect: "PERMIT", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "LTE", value: "10" }] }],
});
const payment = (amount) => {
  const now = Date.now();
  return {
    intentId: "intent_permit", agent: "agent:treasury", action: "PAYMENT", resource: { service: "near_transfer" },
    context: { amount, currency: "NEAR", recipient: "shop.testnet" }, policyHash: "0x" + "9".repeat(64),
    timestamp: now, expiry: now + 3_600_000, idempotencyKey: `permit-${randomUUID()}`, signature: "0x" + "00".repeat(65),
  };
};

test("ALLOW carries a permit the counterparty accepts once; BLOCK carries none", async () => {
  const app = await buildApp(token, { pipelineMode: "mock", databaseUrl: "", signer, approverToken });
  try {
    const appId = `app_${randomUUID().slice(0, 8)}`;
    const base = `/v1/applications/${appId}`;
    const created = await app.inject({ method: "POST", url: `${base}/mandates`, headers: { authorization: `Bearer ${approverToken}` }, payload: mandate() });
    assert.equal(created.statusCode, 201, created.body);
    const submit = async (action) =>
      (await app.inject({ method: "POST", url: `${base}/unified-actions`, headers: { authorization: `Bearer ${token}` }, payload: { action } })).json();

    const allowed = await submit(payment("5"));
    assert.equal(allowed.decision, "ALLOW");
    assert.equal(allowed.permit.issuer, signer.address);
    assert.ok(allowed.permit.expiresAt <= Date.now() + 5 * 60_000, "permit lifetime is capped below the action's expiry");

    const shop = { issuer: signer.address, applicationId: appId, matches: (a) => a.context.recipient === "shop.testnet" && a.context.amount === 5n };
    assert.equal((await checkPermit(allowed.permit, shop)).ok, true);
    assert.equal((await checkPermit(allowed.permit, shop)).reason, "permit_reused");

    const blocked = await submit(payment("50"));
    assert.equal(blocked.decision, "BLOCK");
    assert.equal(blocked.permit, undefined);
  } finally {
    await app.close();
  }
});
