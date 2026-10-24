import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import {
  CapabilityError,
  createCapabilityService,
  createMemoryCapabilityStore,
  createMemoryReservationStore,
  createMockExecutionAdapter,
} from "../dist/index.js";

const HASH = (n) => "0x" + String(n).repeat(64);
const KEY = "0x" + "11".repeat(32);

function service() {
  return createCapabilityService({
    capabilities: createMemoryCapabilityStore(),
    reservations: createMemoryReservationStore(),
  });
}

test("issues capability only within budget and is idempotent", async () => {
  const svc = service();
  const signer = new LocalKeySigner(KEY);
  const input = {
    applicationId: "app_demo",
    intentHash: HASH(1),
    policyHash: HASH(2),
    accountRef: HASH("a"),
    idempotencyKey: "idem_1",
    amount: "50",
    budgetLimit: "100",
    usedBudget: "0",
    now: 1_000,
  };
  const first = await svc.issue(input, signer);
  assert.equal(first.reservation.status, "HELD");
  assert.equal(first.token.expiresAt, 1_060);
  const second = await svc.issue(input, signer);
  assert.equal(second.token.capabilityId, first.token.capabilityId);

  await assert.rejects(
    () => svc.issue({ ...input, amount: "60", idempotencyKey: "idem_2" }, signer),
    /budget reservation/,
  );
});

test("rejects replayed, expired, altered, and wrong-account capabilities", async () => {
  const svc = service();
  const signer = new LocalKeySigner(KEY);
  const issued = await svc.issue(
    {
      applicationId: "app_demo",
      intentHash: HASH(1),
      policyHash: HASH(2),
      accountRef: HASH("a"),
      idempotencyKey: "idem_x",
      amount: "10",
      budgetLimit: "100",
      now: 1_000,
    },
    signer,
  );
  const adapter = createMockExecutionAdapter(svc);
  const exec = await adapter.execute({
    token: issued.token,
    intentHash: HASH(1),
    policyHash: HASH(2),
    accountRef: HASH("a"),
    now: 1_010,
  });
  assert.match(exec.txHash, /^0x[a-f0-9]{64}$/);

  await assert.rejects(
    () =>
      adapter.execute({
        token: issued.token,
        intentHash: HASH(1),
        policyHash: HASH(2),
        accountRef: HASH("a"),
        now: 1_020,
      }),
    CapabilityError,
  );

  const fresh = await svc.issue(
    {
      applicationId: "app_demo",
      intentHash: HASH(3),
      policyHash: HASH(2),
      accountRef: HASH("a"),
      idempotencyKey: "idem_y",
      amount: "10",
      budgetLimit: "100",
      now: 2_000,
    },
    signer,
  );
  await assert.rejects(
    () =>
      adapter.execute({
        token: fresh.token,
        intentHash: HASH(3),
        policyHash: HASH(2),
        accountRef: HASH("a"),
        now: 2_100,
      }),
    /expired/,
  );

  const third = await svc.issue(
    {
      applicationId: "app_demo",
      intentHash: HASH(4),
      policyHash: HASH(2),
      accountRef: HASH("a"),
      idempotencyKey: "idem_z",
      amount: "5",
      budgetLimit: "100",
      now: 3_000,
    },
    signer,
  );
  await assert.rejects(
    () =>
      adapter.execute({
        token: { ...third.token, amount: "999" },
        intentHash: HASH(4),
        policyHash: HASH(2),
        accountRef: HASH("a"),
        now: 3_010,
      }),
    /altered|mismatch/,
  );
  await assert.rejects(
    () =>
      adapter.execute({
        token: third.token,
        intentHash: HASH(4),
        policyHash: HASH(2),
        accountRef: HASH("b"),
        now: 3_010,
      }),
    /accountRef/,
  );
});
