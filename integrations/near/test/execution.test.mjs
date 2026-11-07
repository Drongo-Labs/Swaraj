import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import {
  createCapabilityService,
  createMemoryCapabilityStore,
  createMemoryReservationStore,
} from "@swaraj/capability";
import {
  createNearMockExecutionAdapter,
  createNearPaymentExecutor,
  NEAR_KNOWN_TX_HASH,
} from "../dist/index.js";

const HASH = (n) => "0x" + String(n).repeat(64);
const KEY = "0x" + "11".repeat(32);

test("NEAR mock execution consumes capability and returns REF_FINANCE_NEAR ref", async () => {
  const svc = createCapabilityService({
    capabilities: createMemoryCapabilityStore(),
    reservations: createMemoryReservationStore(),
  });
  const signer = new LocalKeySigner(KEY);
  const issued = await svc.issue(
    {
      applicationId: "app_demo",
      intentHash: HASH(1),
      policyHash: HASH(2),
      accountRef: HASH("a"),
      idempotencyKey: "idem_near_1",
      amount: "10",
      budgetLimit: "100",
      now: 1_000,
    },
    signer,
  );
  const adapter = createNearMockExecutionAdapter(svc);
  const exec = await adapter.execute({
    token: issued.token,
    intentHash: HASH(1),
    policyHash: HASH(2),
    accountRef: HASH("a"),
    now: 1_010,
  });
  assert.equal(exec.venue, "REF_FINANCE_NEAR");
  assert.equal(exec.txHash, NEAR_KNOWN_TX_HASH);
});

test("live NEAR executor sends nothing when the capability is rejected", async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (...args) => { calls.push(args); throw new Error("no network in this test"); };
  try {
    const executor = createNearPaymentExecutor({
      capabilities: {
        verify: async () => { throw new Error("capability rejected"); },
        consume: async () => { calls.push("consume"); },
        commitReservation: async () => {},
      },
      rpcUrl: "http://127.0.0.1:9",
      accountId: "agent.testnet",
      privateKey: "ed25519:3D4YudUahN1nawWvHfEKBGpmJLfbCTbvdXDJKqfLhQ98XewyWK4tEDWvmAYPZqcgz7qfkCEHyWD15m8JVVWJ3LXD",
    });
    await assert.rejects(
      executor.execute({
        token: { capabilityId: "cap" },
        intentHash: "0x",
        policyHash: "0x",
        accountRef: "0x",
        expect: { kind: "transfer", receiverId: "v.testnet", amount: "1" },
      }),
      /capability rejected/,
    );
    assert.deepEqual(calls, []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
