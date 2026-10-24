import assert from "node:assert/strict";
import test from "node:test";
import { Swaraj, SwarajHttpError } from "../dist/index.js";

test("SDK preserves requests, scopes access, and rejects invalid responses", async () => {
  const calls = [];
  let response = { decision: "ALLOW", receiptId: "receipt_demo", status: "PENDING" };
  let status = 200;
  const options = {
    baseUrl: "https://swaraj.example/api/",
    apiKey: "test-key",
    applicationId: "app_demo",
    fetch: async (url, init) => {
      calls.push({ url, ...init });
      return Response.json(response, { status });
    },
  };
  const client = new Swaraj(options);
  const intent = {
    action: "payment.send",
    input: { amountCents: "9007199254740993", recipient: "vendor_acme" },
    idempotencyKey: "invoice-1042",
  };

  assert.equal((await client.submitAction(intent)).status, "PENDING");
  assert.equal(calls[0].url, "https://swaraj.example/api/v1/applications/app_demo/actions");
  assert.deepEqual(JSON.parse(calls[0].body), intent);
  assert.equal(calls[0].headers.authorization, "Bearer test-key");
  assert.equal(calls[0].redirect, "error");
  assert(calls[0].signal instanceof AbortSignal);

  response = { decision: "BLOCK", violations: [{ ruleId: "limit", reason: "Too large" }] };
  assert.deepEqual(await client.submitAction(intent), response);
  response = { receiptId: "receipt_demo", status: "NON_PROVABLE", reason: "Demo only" };
  assert.deepEqual(await client.getReceipt("receipt_demo"), response);
  assert.equal(calls.at(-1).method, "GET");
  assert(calls.at(-1).url.endsWith("/receipts/receipt_demo"));

  response = { receiptId: "receipt_other", status: "PENDING" };
  await assert.rejects(client.getReceipt("receipt_demo"), /does not match/);
  response = { decision: "ALLOW", receiptId: "receipt_demo", status: "PROVED" };
  await assert.rejects(client.submitAction(intent));
  response = { receiptId: "receipt_demo", status: "UNKNOWN" };
  await assert.rejects(client.getReceipt("receipt_demo"));

  status = 401;
  const beforeFailure = calls.length;
  await assert.rejects(client.submitAction(intent), (error) =>
    error instanceof SwarajHttpError && error.status === 401);
  assert.equal(calls.length, beforeFailure + 1, "Mutations must not be retried automatically");

  const beforeInvalid = calls.length;
  await assert.rejects(client.submitAction({ ...intent, idempotencyKey: "" }));
  await assert.rejects(client.getReceipt("../another-account"));
  assert.equal(calls.length, beforeInvalid, "Invalid input must not reach the transport");
  assert.throws(() => new Swaraj({ ...options, applicationId: ".." }));
  assert.throws(() => new Swaraj({ ...options, baseUrl: "http://public.example" }));
  assert.throws(() => new Swaraj({ ...options, baseUrl: "https://user:secret@example.com" }));
  assert.throws(() => new Swaraj({ ...options, apiKey: "" }));
  assert.doesNotThrow(() => new Swaraj({ ...options, baseUrl: "http://localhost:3000" }));
});
