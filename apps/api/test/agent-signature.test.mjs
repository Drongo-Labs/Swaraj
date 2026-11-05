import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore } from "@swaraj/receipts";
import { parseUnifiedAction, unifiedActionSigningPayload } from "@swaraj/schemas";
import { buildApp } from "../dist/app.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const agentKey = new LocalKeySigner("0x" + "22".repeat(32));
const otherKey = new LocalKeySigner("0x" + "33".repeat(32));

function payment() {
  const now = Date.now();
  return {
    intentId: "intent_sig",
    agent: "agent:treasury",
    action: "PAYMENT",
    resource: { service: "stripe" },
    context: { amount: "1000000", currency: "USD", recipient: "acct_vendor" },
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `sig-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
  };
}

async function signed(signer) {
  const wire = payment();
  const payload = unifiedActionSigningPayload(parseUnifiedAction(wire));
  const digest = `0x${createHash("sha256").update(payload).digest("hex")}`;
  return { ...wire, signature: await signer.signDigest(digest) };
}

async function appWithMandate() {
  const app = await buildApp(token, {
    pipelineMode: "mock",
    receiptStore: createMemoryReceiptStore(),
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
  });
  const now = Date.now();
  const res = await app.inject({
    method: "POST",
    url: "/v1/applications/app_demo/mandates",
    headers,
    payload: {
      mandateId: "mandate_sig",
      version: 1,
      agent: "*",
      agentSigner: agentKey.address,
      defaultEffect: "DENY",
      validFrom: now - 1000,
      validUntil: now + 3_600_000,
      rules: [{ ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] }],
    },
  });
  assert.equal(res.statusCode, 201, res.body);
  return app;
}

const submit = (app, action) =>
  app.inject({ method: "POST", url: "/v1/applications/app_demo/unified-actions", headers, payload: { action } });

test("a mandate's agentSigner accepts its key and blocks everything else", async () => {
  const app = await appWithMandate();
  try {
    const good = await submit(app, await signed(agentKey));
    assert.equal(good.json().decision, "ALLOW", good.body);

    const wrongKey = await submit(app, await signed(otherKey));
    assert.equal(wrongKey.json().decision, "BLOCK");
    assert.equal(wrongKey.json().mandate.reason, "INVALID_SIGNATURE");

    const tampered = await signed(agentKey);
    tampered.context.amount = "2000000";
    assert.equal((await submit(app, tampered)).json().mandate.reason, "INVALID_SIGNATURE");

    assert.equal((await submit(app, payment())).json().mandate.reason, "INVALID_SIGNATURE");
  } finally {
    await app.close();
  }
});
