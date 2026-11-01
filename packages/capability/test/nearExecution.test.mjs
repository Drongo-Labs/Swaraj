import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import {
  createCapabilityService,
  createMemoryCapabilityStore,
  createMemoryReservationStore,
  createNearMockExecutionAdapter,
} from "../dist/index.js";
import { NEAR_KNOWN_TX_HASH } from "@swaraj/evidence";

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
