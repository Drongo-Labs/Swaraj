import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore } from "@swaraj/receipts";
import { buildApp } from "../dist/app.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const url = "/v1/applications/app_check/mandates";

const mandate = (cap) => ({
  mandateId: "mandate_check",
  version: 1,
  agent: "*",
  defaultEffect: "DENY",
  validFrom: 0,
  validUntil: 4102444800000,
  rules: [
    { ruleId: "forbid_cap", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "GT", value: cap }] },
    { ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] },
  ],
});

test("mandate check reports issues and the behaviour change without saving", async () => {
  const app = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: "",
    receiptStore: createMemoryReceiptStore(),
    signer: new LocalKeySigner("0x" + "11".repeat(32)),
  });
  try {
    await app.inject({ method: "POST", url, headers, payload: mandate("100") });
    const checked = (await app.inject({ method: "POST", url: `${url}/check`, headers, payload: mandate("200") })).json();
    assert.deepEqual(checked.issues, []);
    assert.ok(checked.diff.newlyAllowed.some((a) => a.context.amount === "200"));
    const active = (await app.inject({ method: "GET", url, headers })).json();
    assert.equal(active.mandate.rules[0].predicates[0].value, "100");

    const empty = { ...mandate("1"), rules: [] };
    const saved = (await app.inject({ method: "POST", url, headers, payload: empty })).json();
    assert.equal(saved.issues[0].code, "NO_PERMIT");

    const bad = await app.inject({ method: "POST", url: `${url}/check`, headers, payload: { mandateId: "x" } });
    assert.equal(bad.statusCode, 400);
  } finally {
    await app.close();
  }
});
