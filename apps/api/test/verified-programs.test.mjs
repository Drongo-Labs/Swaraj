import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { buildApp } from "../dist/app.js";
import { certificateDigest } from "../dist/pipeline/index.js";

const token = "development-test-token-at-least-32-characters";
const headers = { authorization: `Bearer ${token}` };
const certifier = new LocalKeySigner("0x" + "44".repeat(32));
const stranger = new LocalKeySigner("0x" + "55".repeat(32));
const base = "/v1/applications/app_programs";

async function certificate(signer, program, overrides = {}) {
  const unsigned = { program, codeHash: "abc123", expiresAt: Date.now() + 60_000, ...overrides };
  return { ...unsigned, signature: await signer.signDigest(certificateDigest(unsigned)) };
}

function appAction(target) {
  const now = Date.now();
  return {
    intentId: "intent_program",
    agent: "agent:a",
    action: "APP_ACTION",
    resource: { app: "defi", target },
    context: { name: "swap", params: {} },
    policyHash: "0x" + "9".repeat(64),
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `program-${randomUUID()}`,
    signature: "0x" + "00".repeat(65),
  };
}

async function harness() {
  const app = await buildApp(token, { pipelineMode: "mock", databaseUrl: "", signer: new LocalKeySigner("0x" + "11".repeat(32)) });
  const res = await app.inject({
    method: "POST",
    url: `${base}/mandates`,
    headers,
    payload: {
      mandateId: "mandate_programs",
      version: 1,
      agent: "*",
      programCertifier: certifier.address,
      defaultEffect: "DENY",
      validFrom: Date.now() - 1000,
      validUntil: Date.now() + 3_600_000,
      rules: [{ ruleId: "permit_all", effect: "PERMIT", action: "APP_ACTION", predicates: [] }],
    },
  });
  assert.equal(res.statusCode, 201, res.body);
  const addCertificate = async (payload) =>
    (await app.inject({ method: "POST", url: `${base}/program-certificates`, headers, payload })).statusCode;
  const submit = async (target) =>
    (await app.inject({ method: "POST", url: `${base}/unified-actions`, headers, payload: { action: appAction(target) } })).json();
  return { app, addCertificate, submit };
}

test("a permitted action on an uncertified program is blocked", async () => {
  const { app, submit } = await harness();
  try {
    const result = await submit("pool.testnet");
    assert.equal(result.decision, "BLOCK");
    assert.equal(result.mandate.reason, "UNVERIFIED_PROGRAM");
  } finally {
    await app.close();
  }
});

test("a certificate from the mandate's certifier opens only that program", async () => {
  const { app, addCertificate, submit } = await harness();
  try {
    assert.equal(await addCertificate(await certificate(certifier, "pool.testnet")), 201);
    assert.equal((await submit("pool.testnet")).decision, "ALLOW");
    assert.equal((await submit("other.testnet")).mandate.reason, "UNVERIFIED_PROGRAM");
  } finally {
    await app.close();
  }
});

test("forged, expired and altered certificates are refused", async () => {
  const { app, addCertificate, submit } = await harness();
  try {
    assert.equal(await addCertificate(await certificate(stranger, "pool.testnet")), 422);
    assert.equal(await addCertificate(await certificate(certifier, "pool.testnet", { expiresAt: Date.now() - 1 })), 422);
    const altered = { ...(await certificate(certifier, "pool.testnet")), program: "evil.testnet" };
    assert.equal(await addCertificate(altered), 422);
    assert.equal((await submit("evil.testnet")).mandate.reason, "UNVERIFIED_PROGRAM");
  } finally {
    await app.close();
  }
});

test("a certificate that expires stops working", async () => {
  const { app, addCertificate, submit } = await harness();
  try {
    assert.equal(await addCertificate(await certificate(certifier, "pool.testnet", { expiresAt: Date.now() + 40 })), 201);
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal((await submit("pool.testnet")).mandate.reason, "UNVERIFIED_PROGRAM");
  } finally {
    await app.close();
  }
});
