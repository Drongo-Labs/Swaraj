import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { createMemoryReceiptStore, createReceiptEngine } from "@swaraj/receipts";
import { createPolicyGateway } from "@swaraj/smt";
import {
  createDefaultCapabilityStack,
  createDefaultEvidenceAdapter,
  runPipeline,
} from "../dist/pipeline/index.js";

test("runPipeline ALLOW uses real SMT and capability", async () => {
  const gateway = await createPolicyGateway();
  const { capabilities, execution } = createDefaultCapabilityStack();
  try {
    const result = await runPipeline(
      "app_demo",
      { action: "trade.spot", input: {}, idempotencyKey: "pipe-allow" },
      {
        evidence: createDefaultEvidenceAdapter(),
        receipts: createReceiptEngine(createMemoryReceiptStore()),
        signer: new LocalKeySigner("0x" + "11".repeat(32)),
        checkPolicy: (input) => gateway.check(input),
        capabilities,
        execution,
      },
    );
    assert.equal(result.decision, "ALLOW");
    if (result.decision !== "ALLOW") return;
    assert.equal(result.status, "PENDING");
    assert.ok(result.capabilityId.startsWith("cap_"));
  } finally {
    await gateway.close();
  }
});

test("runPipeline BLOCK has no capability/receipt", async () => {
  const gateway = await createPolicyGateway();
  const { capabilities, execution } = createDefaultCapabilityStack();
  try {
    const result = await runPipeline(
      "app_demo",
      { action: "trade.block", input: {}, idempotencyKey: "pipe-block" },
      {
        evidence: createDefaultEvidenceAdapter(),
        receipts: createReceiptEngine(createMemoryReceiptStore()),
        signer: new LocalKeySigner("0x" + "11".repeat(32)),
        checkPolicy: (input) => gateway.check(input),
        capabilities,
        execution,
      },
    );
    assert.equal(result.decision, "BLOCK");
  } finally {
    await gateway.close();
  }
});
