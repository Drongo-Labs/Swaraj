import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore } from "@swaraj/receipts";
import { buildApp } from "../dist/app.js";
import {
  mockExecute,
  mockIssueCapability,
  mockSmtCheck,
  resolvePipelineMode,
  MOCK_ALLOW_INTENT_HASH,
  MOCK_BLOCK_INTENT_HASH,
} from "../dist/pipeline/index.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };

async function app() {
  return buildApp(token, {
    pipelineMode: "mock",
    receiptStore: createMemoryReceiptStore(),
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
  });
}

test("resolvePipelineMode fails closed without live env", () => {
  assert.throws(
    () => resolvePipelineMode({}),
    /Live Base pipeline requires DATABASE_URL/,
  );
  assert.equal(resolvePipelineMode({ SWARAJ_FORCE_MOCK: "1" }), "mock");
  assert.equal(
    resolvePipelineMode({
      DATABASE_URL: "postgresql://x",
      BASE_RPC_URL: "https://mainnet.base.org",
      SWARAJ_EXECUTION_PRIVATE_KEY: "0x" + "11".repeat(32),
    }),
    "base",
  );
});

test("legacy exact-map mocks still behave", () => {
  assert.equal(mockSmtCheck({ intentHash: MOCK_ALLOW_INTENT_HASH, policyHash: "0x" + "3".repeat(64) }).decision, "ALLOW");
  assert.equal(mockSmtCheck({ intentHash: MOCK_BLOCK_INTENT_HASH, policyHash: "0x" + "3".repeat(64) }).decision, "BLOCK");
  const cap = mockIssueCapability(MOCK_ALLOW_INTENT_HASH, 1_000);
  assert.equal(mockExecute(cap.capabilityId, 2_000).executedAt, 2_000);
});

test("ALLOW path: SMT → capability → mock execute → PENDING receipt", async () => {
  const instance = await app();
  try {
    const health = (await instance.inject("/health")).json();
    assert.equal(health.executionEnabled, true);
    assert.equal(health.phases.capability, true);

    const created = await instance.inject({
      method: "POST",
      url: "/v1/applications/app_demo/actions",
      headers,
      payload: { action: "trade.spot", input: {}, idempotencyKey: "allow-one" },
    });
    assert.equal(created.statusCode, 200, JSON.stringify(created.json()));
    assert.equal(created.json().decision, "ALLOW");
    assert.equal(created.json().status, "PENDING");
    assert.ok(created.json().capabilityId);
    assert.match(created.json().intentHash, /^0x[a-f0-9]{64}$/);

    const receiptId = created.json().receiptId;
    const got = await instance.inject({ url: `/v1/applications/app_demo/receipts/${receiptId}`, headers });
    assert.equal(got.statusCode, 200);
    assert.equal(got.json().status, "PENDING");
    assert.equal(got.json().assumptions.execution, "mock");
  } finally {
    await instance.close();
  }
});

test("BLOCK path: policy violations, no receipt", async () => {
  const instance = await app();
  try {
    const blocked = await instance.inject({
      method: "POST",
      url: "/v1/applications/app_demo/actions",
      headers,
      payload: { action: "trade.block", input: {}, idempotencyKey: "block-one" },
    });
    assert.equal(blocked.statusCode, 200, JSON.stringify(blocked.json()));
    assert.equal(blocked.json().decision, "BLOCK");
    assert.ok(blocked.json().violations.length >= 1);

    const missing = await instance.inject({
      url: "/v1/applications/app_demo/receipts/receipt_block-one",
      headers,
    });
    assert.equal(missing.statusCode, 404);
  } finally {
    await instance.close();
  }
});

test("policy create/get and audit trail", async () => {
  const instance = await app();
  try {
    const created = await instance.inject({
      method: "POST",
      url: "/v1/applications/app_demo/policies",
      headers,
      payload: {
        policyId: "policy_custom",
        version: 1,
        definition: {
          policyVersion: 1,
          allowedVenues: ["UNISWAP_V3_BASE"],
          allowedAssets: [
            "0x4200000000000000000000000000000000000006",
            "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
          ],
          maxAmountPerAction: "50000000",
          positionCap: "1000000000",
          dailyTurnoverCap: "500000000",
          maxSlippageBps: 100,
          reserveRequirement: "10000000",
          quoteFreshnessSeconds: 30,
          cooldownSeconds: 60,
          finalityRule: "BASE_CONFIRMATIONS_12",
          policyExpiry: 1800000000,
          paused: false,
        },
      },
    });
    assert.equal(created.statusCode, 200);
    assert.equal(created.json().policyId, "policy_custom");
    assert.equal(created.json().definition.maxAmountPerAction, "50000000");

    const got = await instance.inject({
      url: "/v1/applications/app_demo/policies/policy_demo",
      headers,
    });
    assert.equal(got.statusCode, 200);
    assert.equal(got.json().status, "ACTIVE");

    await instance.inject({
      method: "POST",
      url: "/v1/applications/app_demo/actions",
      headers,
      payload: { action: "trade.spot", input: {}, idempotencyKey: "audit-one" },
    });
    const audit = await instance.inject({ url: "/v1/applications/app_demo/audit", headers });
    assert.equal(audit.statusCode, 200);
    assert.ok(audit.json().entries.some((e) => e.kind === "DECISION"));
    assert.ok(audit.json().entries.some((e) => e.kind === "EXECUTION"));

    const activity = await instance.inject({ url: "/v1/applications/app_demo/activity", headers });
    assert.equal(activity.statusCode, 200);
    assert.ok(activity.json().items.some((i) => i.decision === "ALLOW" && i.receiptId));
  } finally {
    await instance.close();
  }
});

test("ALLOW path exposes Phase 7 guest-bundle bridge", async () => {
  const instance = await app();
  try {
    const created = await instance.inject({
      method: "POST",
      url: "/v1/applications/app_demo/actions",
      headers,
      payload: { action: "trade.spot", input: {}, idempotencyKey: "prove-bridge" },
    });
    assert.equal(created.statusCode, 200, JSON.stringify(created.json()));
    assert.equal(created.json().guestBundleAvailable, true);
    const receiptId = created.json().receiptId;
    const bundle = await instance.inject({
      url: `/v1/applications/app_demo/receipts/${receiptId}/guest-bundle`,
      headers,
    });
    assert.equal(bundle.statusCode, 200, JSON.stringify(bundle.json()));
    assert.equal(bundle.json().guestBundle.schemaVersion, 1);
    assert.equal(bundle.json().guestBundle.intent.actionType, "SPOT_TRADE");
    assert.equal(bundle.json().guestBundle.intent.intentHash, undefined);
  } finally {
    await instance.close();
  }
});

test("amount policy check still works", async () => {
  const instance = await app();
  try {
    const payload = { amount: "5", maxAmount: "10", usedBudget: "0", reservedBudget: "0", budgetLimit: "10", paused: false };
    assert.equal((await instance.inject({ method: "POST", url: "/v1/policy/check", payload })).statusCode, 401);
    const checked = await instance.inject({ method: "POST", url: "/v1/policy/check", payload, headers });
    assert.equal(checked.statusCode, 200);
    assert.equal(checked.json().satisfied, true);
  } finally {
    await instance.close();
  }
});
