import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore } from "@swaraj/receipts";
import { buildApp } from "../dist/app.js";
import { DEMO_ALLOW_INTENT } from "../dist/pipeline/index.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };

async function app() {
  return buildApp(token, {
    pipelineMode: "mock",
    receiptStore: createMemoryReceiptStore(),
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
  });
}

const ZERO_SIG = "0x" + "00".repeat(65);
const POLICY_HASH = "0x" + "9".repeat(64);

function spotTradeAction(overrides = {}) {
  const now = Date.now();
  return {
    intentId: "intent_trade_u1",
    agent: "agent:demo",
    action: "SPOT_TRADE",
    resource: { venue: "UNISWAP_V3_BASE" },
    context: {
      amount: "10000000",
      assetIn: DEMO_ALLOW_INTENT.assetIn,
      assetOut: DEMO_ALLOW_INTENT.assetOut,
      slippageBps: 50,
    },
    policyHash: POLICY_HASH,
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: "unified-trade-1",
    signature: ZERO_SIG,
    ...overrides,
  };
}

function paymentAction(overrides = {}) {
  const now = Date.now();
  return {
    intentId: "intent_pay_u1",
    agent: "agent:treasury",
    action: "PAYMENT",
    resource: { service: "stripe" },
    context: { amount: "1000000", currency: "USD", recipient: "acct_vendor" },
    policyHash: POLICY_HASH,
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: "unified-pay-1",
    signature: ZERO_SIG,
    ...overrides,
  };
}

async function postAction(appInstance, action) {
  return appInstance.inject({
    method: "POST",
    url: "/v1/applications/app_demo/unified-actions",
    headers,
    payload: { action },
  });
}

test("valid unified SPOT_TRADE flows through the full pipeline: ALLOW with receipt", async () => {
  const instance = await app();
  const response = await postAction(instance, spotTradeAction());
  const body = response.json();
  assert.equal(response.statusCode, 200);
  assert.equal(body.decision, "ALLOW");
  assert.ok(body.receiptId, "trade allow must produce a receipt");
  assert.ok(body.intentHash.startsWith("0x"));
  await instance.close();
});

test("oversized unified SPOT_TRADE is blocked by the mandate", async () => {
  const instance = await app();
  const response = await postAction(
    instance,
    spotTradeAction({
      intentId: "intent_trade_block",
      idempotencyKey: "unified-trade-block",
      context: {
        amount: "600000000",
        assetIn: DEMO_ALLOW_INTENT.assetIn,
        assetOut: DEMO_ALLOW_INTENT.assetOut,
        slippageBps: 50,
      },
    }),
  );
  const body = response.json();
  assert.equal(response.statusCode, 200);
  assert.equal(body.decision, "BLOCK");
  assert.match(body.violations[0].reason, /MANDATE:FORBID_MATCH/);
  await instance.close();
});

test("the gate judges time by its own clock: backdated or expired actions are blocked", async () => {
  const instance = await app();
  const hour = 3_600_000;
  const backdated = await postAction(
    instance,
    spotTradeAction({ intentId: "intent_trade_old", idempotencyKey: "unified-trade-old", timestamp: Date.now() - hour }),
  );
  assert.equal(backdated.json().decision, "BLOCK");
  assert.match(backdated.json().violations[0].reason, /CLOCK_SKEW/);
  const expired = await postAction(
    instance,
    spotTradeAction({ intentId: "intent_trade_exp", idempotencyKey: "unified-trade-exp", timestamp: Date.now() - 120_000, expiry: Date.now() - 1 }),
  );
  assert.equal(expired.json().decision, "BLOCK");
  assert.match(expired.json().violations[0].reason, /ACTION_EXPIRED/);
  await instance.close();
});

test("invalid unified action is rejected with 400 and field paths only", async () => {
  const instance = await app();
  const response = await postAction(instance, { intentId: "broken" });
  const body = response.json();
  assert.equal(response.statusCode, 400);
  assert.equal(body.error, "invalid_unified_action");
  assert.ok(Array.isArray(body.issues) && body.issues.length > 0);
  assert.ok(!JSON.stringify(body).includes("broken"), "rejected values must not be echoed");
  await instance.close();
});

test("mandate can be registered and fetched per application", async () => {
  const instance = await app();
  const mandate = {
    mandateId: "mandate_treasury_v1",
    version: 1,
    agent: "*",
    defaultEffect: "DENY",
    validFrom: 0,
    validUntil: 4102444800000,
    rules: [
      {
        ruleId: "forbid_large_payment",
        effect: "FORBID",
        action: "PAYMENT",
        predicates: [{ field: "context.amount", operator: "GT", value: "5000000" }],
      },
      {
        ruleId: "permit_payment",
        effect: "PERMIT",
        action: "PAYMENT",
        predicates: [{ field: "context.currency", operator: "IN", values: ["USD", "USDC"] }],
      },
    ],
  };
  const created = await instance.inject({
    method: "POST",
    url: "/v1/applications/app_demo/mandates",
    headers,
    payload: mandate,
  });
  assert.equal(created.statusCode, 201);
  assert.equal(created.json().mandateId, "mandate_treasury_v1");
  assert.ok(created.json().policyHash.startsWith("0x"));

  const fetched = await instance.inject({
    method: "GET",
    url: "/v1/applications/app_demo/mandates",
    headers,
  });
  assert.equal(fetched.statusCode, 200);
  assert.equal(fetched.json().mandate.mandateId, "mandate_treasury_v1");
  await instance.close();
});

test("with an approver token set, only the owner can change the mandate", async () => {
  const owner = "owner-approver-token-at-least-32-characters";
  const instance = await buildApp(token, {
    pipelineMode: "mock",
    receiptStore: createMemoryReceiptStore(),
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
    approverToken: owner,
  });
  const mandate = {
    mandateId: "mandate_owner",
    version: 1,
    agent: "*",
    defaultEffect: "DENY",
    validFrom: 0,
    validUntil: Date.now() + 3_600_000,
    rules: [{ ruleId: "permit_all_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] }],
  };
  const post = (auth) =>
    instance.inject({ method: "POST", url: "/v1/applications/app_owner/mandates", headers: { authorization: `Bearer ${auth}` }, payload: mandate });
  const byAgent = await post(token);
  assert.equal(byAgent.statusCode, 401);
  assert.equal(byAgent.json().error, "owner_token_required");
  assert.equal((await post(owner)).statusCode, 201);
  // Actions still use the agent token.
  assert.equal((await postAction(instance, paymentAction())).statusCode, 200);
  await instance.close();
});

test("invalid mandate is rejected with 400", async () => {
  const instance = await app();
  const response = await instance.inject({
    method: "POST",
    url: "/v1/applications/app_demo/mandates",
    headers,
    payload: { mandateId: "nope" },
  });
  assert.equal(response.statusCode, 400);
  assert.equal(response.json().error, "invalid_mandate");
  await instance.close();
});

test("oversized PAYMENT is blocked by the registered mandate (forbid always wins)", async () => {
  const instance = await app();
  await instance.inject({
    method: "POST",
    url: "/v1/applications/app_demo/mandates",
    headers,
    payload: {
      mandateId: "mandate_treasury_v1",
      version: 1,
      agent: "*",
      defaultEffect: "DENY",
      validFrom: 0,
      validUntil: 4102444800000,
      rules: [
        {
          ruleId: "forbid_large_payment",
          effect: "FORBID",
          action: "PAYMENT",
          predicates: [{ field: "context.amount", operator: "GT", value: "5000000" }],
        },
        {
          ruleId: "permit_payment",
          effect: "PERMIT",
          action: "PAYMENT",
          predicates: [{ field: "context.currency", operator: "IN", values: ["USD", "USDC"] }],
        },
      ],
    },
  });
  const blocked = await postAction(
    instance,
    paymentAction({
      intentId: "intent_pay_big",
      idempotencyKey: "unified-pay-big",
      context: { amount: "9000000", currency: "USD", recipient: "acct_vendor" },
    }),
  );
  const body = blocked.json();
  assert.equal(blocked.statusCode, 200);
  assert.equal(body.decision, "BLOCK");
  assert.equal(body.mandate.reason, "FORBID_MATCH");
  assert.ok(body.intentHash.startsWith("0x"));
  assert.ok(body.policyHash.startsWith("0x"));
  assert.ok(body.decisionReceipt, "block is recorded as a decision receipt");

  // Same engine, permitted payment: allowed but not executable yet.
  const allowed = await postAction(
    instance,
    paymentAction({ intentId: "intent_pay_ok", idempotencyKey: "unified-pay-ok" }),
  );
  const allowBody = allowed.json();
  assert.equal(allowBody.decision, "ALLOW");
  assert.equal(allowBody.mandate.reason, "PERMIT_MATCH");
  assert.equal(allowBody.status, "NOT_EXECUTABLE");
  await instance.close();
});

test("payment outside the mandate permit list is default-denied", async () => {
  const instance = await app();
  await instance.inject({
    method: "POST",
    url: "/v1/applications/app_demo/mandates",
    headers,
    payload: {
      mandateId: "mandate_treasury_v1",
      version: 1,
      agent: "*",
      defaultEffect: "DENY",
      validFrom: 0,
      validUntil: 4102444800000,
      rules: [
        {
          ruleId: "permit_payment",
          effect: "PERMIT",
          action: "PAYMENT",
          predicates: [{ field: "context.currency", operator: "IN", values: ["USD", "USDC"] }],
        },
      ],
    },
  });
  const response = await postAction(
    instance,
    paymentAction({
      intentId: "intent_pay_eur",
      idempotencyKey: "unified-pay-eur",
      context: { amount: "1000", currency: "EUR", recipient: "acct_vendor" },
    }),
  );
  const body = response.json();
  assert.equal(response.statusCode, 200);
  assert.equal(body.decision, "BLOCK");
  assert.equal(body.mandate.reason, "DEFAULT_DENY");
  await instance.close();
});

test("unified-action receipt is verifiable end to end (format, hash, signature, binding)", async () => {
  const instance = await app();
  const traded = await postAction(instance, spotTradeAction({ idempotencyKey: "unified-verify-1" }));
  const { receiptId } = traded.json();
  const verified = await instance.inject({
    method: "GET",
    url: `/v1/applications/app_demo/receipts/${receiptId}/verify`,
    headers,
  });
  const body = verified.json();
  assert.equal(verified.statusCode, 200);
  assert.equal(body.format, "unified-action");
  assert.equal(body.valid, true, JSON.stringify(body.checks));
  assert.equal(body.checks.actionSchema, true);
  assert.equal(body.checks.actionHash, true);
  assert.equal(body.checks.signature, true);
  assert.equal(body.checks.binding, true);
  assert.equal(body.action.type, "SPOT_TRADE");
  await instance.close();
});

test("legacy receipts still verify (signature + binding), action checks not applicable", async () => {
  const instance = await app();
  const traded = await instance.inject({
    method: "POST",
    url: "/v1/applications/app_demo/actions",
    headers,
    payload: { action: "trade.spot", input: {}, idempotencyKey: "legacy-verify-1" },
  });
  const { receiptId } = traded.json();
  const verified = await instance.inject({
    method: "GET",
    url: `/v1/applications/app_demo/receipts/${receiptId}/verify`,
    headers,
  });
  const body = verified.json();
  assert.equal(verified.statusCode, 200);
  assert.equal(body.format, "legacy");
  assert.equal(body.valid, true);
  assert.equal(body.checks.signature, true);
  assert.equal(body.checks.actionSchema, null);
  await instance.close();
});

test("verify endpoint: unknown receipt is 404", async () => {
  const instance = await app();
  const response = await instance.inject({
    method: "GET",
    url: "/v1/applications/app_demo/receipts/receipt_missing/verify",
    headers,
  });
  assert.equal(response.statusCode, 404);
  await instance.close();
});
