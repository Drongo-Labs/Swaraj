import assert from "node:assert/strict";
import test from "node:test";
import { Swaraj, SwarajHttpError, SwarajTimeoutError } from "../dist/index.js";

const payment = (amount, overrides = {}) => ({
  intentId: "intent_sdk",
  agent: "agent:treasury",
  action: "PAYMENT",
  resource: { service: "near_transfer" },
  context: { amount, currency: "NEAR", recipient: "shop.testnet" },
  policyHash: "0x" + "9".repeat(64),
  timestamp: Date.now(),
  expiry: Date.now() + 60_000,
  idempotencyKey: "invoice-1042",
  signature: "0x" + "00".repeat(65),
  ...overrides,
});

const permit = {
  version: "swaraj/permit/v1",
  applicationId: "app_demo",
  action: payment("5"),
  intentHash: "0x" + "a".repeat(64),
  mandateHash: "0x" + "b".repeat(64),
  decision: "ALLOW",
  matchedRuleIds: ["permit_small"],
  expiresAt: Date.now() + 60_000,
  issuer: "0x" + "c".repeat(40),
  signature: "0x" + "d".repeat(130),
};

function mockClient(handler, options = {}) {
  return new Swaraj({
    baseUrl: "https://swaraj.example/api/",
    apiKey: "test-key",
    applicationId: "app_demo",
    fetch: handler,
    ...options,
  });
}

test("submitUnifiedAction posts to unified-actions and returns ALLOW with permit", async () => {
  const calls = [];
  const action = payment("5");
  const client = mockClient(async (url, init) => {
    calls.push({ url, ...init });
    return Response.json(
      {
        decision: "ALLOW",
        productStatus: "allowed",
        status: "NOT_EXECUTABLE",
        intentHash: permit.intentHash,
        policyHash: permit.mandateHash,
        permit,
      },
      { status: 200 },
    );
  });

  const result = await client.submitUnifiedAction(action);
  assert.equal(result.decision, "ALLOW");
  assert.equal(result.permit.issuer, permit.issuer);
  assert.equal(calls[0].url, "https://swaraj.example/api/v1/applications/app_demo/unified-actions");
  assert.equal(calls[0].headers.authorization, "Bearer test-key");
  assert.deepEqual(JSON.parse(calls[0].body), { action });
  assert.equal(calls[0].redirect, "error");
  assert(calls[0].signal instanceof AbortSignal);
});

test("BLOCK and NEEDS_APPROVAL carry no permit; 202 is accepted", async () => {
  let round = 0;
  const client = mockClient(async () => {
    round += 1;
    if (round === 1) {
      return Response.json(
        {
          decision: "BLOCK",
          productStatus: "blocked",
          violations: [{ ruleId: "MANDATE", reason: "MANDATE:FORBID_MATCH" }],
        },
        { status: 200 },
      );
    }
    return Response.json(
      {
        decision: "NEEDS_APPROVAL",
        productStatus: "needs_approval",
        approvalId: "appr_demo",
        expiresAt: Date.now() + 60_000,
      },
      { status: 202 },
    );
  });

  const blocked = await client.submitUnifiedAction(payment("50"));
  assert.equal(blocked.decision, "BLOCK");
  assert.equal(blocked.permit, undefined);

  const paused = await client.submitUnifiedAction(payment("20"));
  assert.equal(paused.decision, "NEEDS_APPROVAL");
  assert.equal(paused.approvalId, "appr_demo");
  assert.equal(paused.permit, undefined);
});

test("getReceipt scopes the path and rejects mismatched ids", async () => {
  const calls = [];
  const client = mockClient(async (url, init) => {
    calls.push({ url, method: init.method });
    return Response.json({ receiptId: "receipt_demo", status: "PENDING" });
  });
  assert.deepEqual(await client.getReceipt("receipt_demo"), {
    receiptId: "receipt_demo",
    status: "PENDING",
  });
  assert(calls[0].url.endsWith("/receipts/receipt_demo"));

  const mismatch = mockClient(async () =>
    Response.json({ receiptId: "receipt_other", status: "PENDING" }),
  );
  await assert.rejects(mismatch.getReceipt("receipt_demo"), /does not match/);
});

test("waitForReceipt polls until terminal status", async () => {
  let n = 0;
  const client = mockClient(async () => {
    n += 1;
    const status = n < 3 ? "PENDING" : "PROVED";
    return Response.json({ receiptId: "receipt_wait", status });
  });
  const receipt = await client.waitForReceipt("receipt_wait", {
    timeoutMs: 5_000,
    pollIntervalMs: 10,
  });
  assert.equal(receipt.status, "PROVED");
  assert.equal(n, 3);
});

test("waitForReceipt times out while still PENDING", async () => {
  const client = mockClient(async () =>
    Response.json({ receiptId: "receipt_hang", status: "PENDING" }),
  );
  await assert.rejects(
    () => client.waitForReceipt("receipt_hang", { timeoutMs: 40, pollIntervalMs: 10 }),
    (error) => error instanceof SwarajTimeoutError,
  );
});

test("SwarajHttpError preserves status, body, and error code; mutations are not retried", async () => {
  let calls = 0;
  const client = mockClient(async () => {
    calls += 1;
    return Response.json({ error: "owner_token_required", message: "use approver" }, { status: 401 });
  });
  await assert.rejects(
    () => client.submitUnifiedAction(payment("5")),
    (error) =>
      error instanceof SwarajHttpError &&
      error.status === 401 &&
      error.code === "owner_token_required" &&
      error.body?.error === "owner_token_required",
  );
  assert.equal(calls, 1);
});

test("per-call timeoutMs is applied when no signal is passed", async () => {
  let seen;
  const client = mockClient(
    async (_url, init) => {
      seen = init.signal;
      return Response.json({
        decision: "ALLOW",
        permit,
        intentHash: permit.intentHash,
        policyHash: permit.mandateHash,
      });
    },
    { defaultTimeoutMs: 30_000 },
  );
  await client.submitUnifiedAction(payment("5"), { timeoutMs: 1_500 });
  assert(seen instanceof AbortSignal);
});

test("env defaults fill missing constructor options", async () => {
  const prev = {
    SWARAJ_URL: process.env.SWARAJ_URL,
    SWARAJ_DEV_TOKEN: process.env.SWARAJ_DEV_TOKEN,
    SWARAJ_APPLICATION_ID: process.env.SWARAJ_APPLICATION_ID,
  };
  process.env.SWARAJ_URL = "https://swaraj.example";
  process.env.SWARAJ_DEV_TOKEN = "env-token-at-least-32-characters-long";
  process.env.SWARAJ_APPLICATION_ID = "app_env";
  try {
    const client = new Swaraj({
      fetch: async () =>
        Response.json({
          decision: "ALLOW",
          permit: { ...permit, applicationId: "app_env" },
        }),
    });
    assert.equal(client.applicationId, "app_env");
    const result = await client.submitUnifiedAction(payment("5"));
    assert.equal(result.decision, "ALLOW");
  } finally {
    for (const [key, value] of Object.entries(prev)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("legacy submitAction still hits /actions", async () => {
  const calls = [];
  const client = mockClient(async (url, init) => {
    calls.push({ url, body: init.body });
    return Response.json({ decision: "ALLOW", receiptId: "receipt_demo", status: "PENDING" });
  });
  const intent = {
    action: "payment.send",
    input: { amountCents: "5000", recipient: "vendor_acme" },
    idempotencyKey: "invoice-1042",
  };
  assert.equal((await client.submitAction(intent)).status, "PENDING");
  assert.equal(calls[0].url, "https://swaraj.example/api/v1/applications/app_demo/actions");
});

test("constructor rejects unsafe base URLs and empty credentials", async () => {
  const base = {
    baseUrl: "https://swaraj.example",
    apiKey: "test-key",
    applicationId: "app_demo",
    fetch: async () => new Response(null, { status: 500 }),
  };
  assert.throws(() => new Swaraj({ ...base, applicationId: ".." }));
  assert.throws(() => new Swaraj({ ...base, baseUrl: "http://public.example" }));
  assert.throws(() => new Swaraj({ ...base, baseUrl: "https://user:secret@example.com" }));
  assert.throws(() => new Swaraj({ ...base, apiKey: "" }));
  assert.doesNotThrow(() => new Swaraj({ ...base, baseUrl: "http://localhost:3000" }));
  await assert.rejects(() => mockClient(async () => Response.json({})).submitUnifiedAction([]));
});
