import assert from "node:assert/strict";
import test from "node:test";
import { spawn, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runOneProofJob, type Sp1ProverConfig } from "@swaraj/proofs";
import type { PolicyDoc } from "@swaraj/smt";
import { startPipelineFixture, type FixtureHandle } from "./pipeline-fixture.ts";

/**
 * Day 6 full-pipeline integration run: one scenario, every stage, real
 * infrastructure. Application and policy are created through the API
 * contract; the action is submitted through the MCP bridge (a real
 * subprocess over stdio); the SMT gateway decides; the receipt persists
 * in Postgres; the proof worker runs the SP1 guest in the zkVM when the
 * toolchain is configured; the sink attests; and the PROVED receipt is
 * read back through the MCP tool.
 */

interface JsonRpcMessage {
  id?: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
}

class HostSession {
  private nextId = 1;
  private readonly pending = new Map<number, (message: JsonRpcMessage) => void>();
  private readonly child: ChildProcess;

  constructor(child: ChildProcess) {
    assert.ok(child.stdout, "child stdout expected");
    this.child = child;
    const lines = createInterface({ input: child.stdout });
    lines.on("line", (line: string) => {
      const message = JSON.parse(line) as JsonRpcMessage;
      if (typeof message.id === "number" && this.pending.has(message.id)) {
        this.pending.get(message.id)!(message);
        this.pending.delete(message.id);
      }
    });
  }

  request(method: string, params?: Record<string, unknown>): Promise<JsonRpcMessage> {
    const id = this.nextId++;
    const promise = new Promise<JsonRpcMessage>((resolve, reject) => {
      this.pending.set(id, resolve);
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`timed out waiting for ${method}`));
      }, 10_000);
    });
    assert.ok(this.child.stdin, "child stdin expected");
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, ...(params ? { params } : {}) })}\n`);
    return promise;
  }

  notify(method: string): void {
    assert.ok(this.child.stdin, "child stdin expected");
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method })}\n`);
  }

  async toolResult(method: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await this.request(method, params);
    assert.ok(!response.error, `tool call failed: ${response.error?.message}`);
    const result = response.result as { content: Array<{ text: string }> };
    return JSON.parse(result.content[0]!.text) as Record<string, unknown>;
  }

  async close(): Promise<void> {
    this.child.stdin?.end();
    await once(this.child, "close");
  }
}

async function spawnBridge(port: number, token: string): Promise<HostSession> {
  const mainJs = fileURLToPath(new URL("../dist/main.js", import.meta.url));
  const child = spawn(process.execPath, [mainJs], {
    env: { ...process.env, SWARAJ_URL: `http://127.0.0.1:${port}`, SWARAJ_DEV_TOKEN: token },
    stdio: ["pipe", "pipe", "pipe"],
  });
  return new HostSession(child);
}

test("full pipeline: policy via API, submit via MCP, decide, persist, SP1 proof, attest, PROVED", async (t) => {
  const fixture: FixtureHandle = await startPipelineFixture();
  const artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-day6-"));
  let bridge: HostSession | undefined;
  try {
    await fixture.pool.raw.query("DELETE FROM proof_jobs");
    bridge = await spawnBridge(fixture.port, fixture.token);

    await bridge.request("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "integration", version: "0.0.0" },
    });
    bridge.notify("notifications/initialized");

    // 1. Application + policy registered through the API contract.
    const wirePolicy: PolicyDoc = {
      policyId: `pol_day6_${randomUUID().slice(0, 6)}`,
      revision: 1,
      fields: ["amountCents", "limitCents"],
      assumptions: [
        {
          ruleId: "limit.fixed",
          assertion: {
            kind: "compare",
            op: "eq",
            left: { kind: "field", name: "limitCents" },
            right: { kind: "const", value: 100000 },
          },
        },
      ],
      rules: [
        {
          ruleId: "amount.positive",
          assertion: {
            kind: "compare",
            op: "gt",
            left: { kind: "field", name: "amountCents" },
            right: { kind: "const", value: 0 },
          },
        },
        {
          ruleId: "amount.cap",
          assertion: {
            kind: "compare",
            op: "le",
            left: { kind: "field", name: "amountCents" },
            right: { kind: "field", name: "limitCents" },
          },
        },
      ],
    };
    const registerResponse = await fetch(`http://127.0.0.1:${fixture.port}/policies`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${fixture.token}` },
      body: JSON.stringify(wirePolicy),
    });
    assert.equal(registerResponse.status, 201);
    const registered = (await registerResponse.json()) as { digest: string };
    assert.match(registered.digest, /^pol_[0-9a-f]{64}$/);

    // 2. Policy visible through the MCP tool.
    const policyView = await bridge.toolResult("tools/call", {
      name: "swaraj_get_policy",
      arguments: { policyId: wirePolicy.policyId },
    });
    assert.equal(policyView.digest, registered.digest);
    assert.deepEqual(policyView.ruleIds, ["amount.positive", "amount.cap"]);

    // 3. A blocked action never creates a receipt.
    const blocked = await bridge.toolResult("tools/call", {
      name: "swaraj_submit_action",
      arguments: {
        applicationId: fixture.appId,
        policyId: wirePolicy.policyId,
        input: { amountCents: "250000", limitCents: "100000" },
      },
    });
    assert.equal(blocked.decision, "BLOCK");
    assert.deepEqual(blocked.violatedRuleIds, ["amount.cap"]);
    assert.equal(blocked.receiptId, undefined);

    // 4. The allowed action creates a PENDING receipt and a queued job.
    const idemKey = `day6_${randomUUID().slice(0, 8)}`;
    const submitted = await bridge.toolResult("tools/call", {
      name: "swaraj_submit_action",
      arguments: {
        applicationId: fixture.appId,
        policyId: wirePolicy.policyId,
        input: { amountCents: "25000", limitCents: "100000" },
        idempotencyKey: idemKey,
      },
    });
    assert.equal(submitted.decision, "ALLOW");
    const receiptId = submitted.receiptId as string;

    const pendingView = await bridge.toolResult("tools/call", {
      name: "swaraj_get_receipt",
      arguments: { receiptId },
    });
    assert.equal(pendingView.state, "PENDING");

    // The idempotency key replays to the same receipt.
    const replayed = await bridge.toolResult("tools/call", {
      name: "swaraj_submit_action",
      arguments: {
        applicationId: fixture.appId,
        policyId: wirePolicy.policyId,
        input: { amountCents: "25000", limitCents: "100000" },
        idempotencyKey: idemKey,
      },
    });
    assert.equal(replayed.receiptId, receiptId);

    // 5. The proof worker runs the whole proof stage, SP1 included when
    //    the toolchain artifacts are configured in the environment.
    const sp1: Sp1ProverConfig | undefined =
      process.env.SWARAJ_SP1_ELF !== undefined && process.env.SWARAJ_SP1_HOST_BIN !== undefined
        ? { elfPath: process.env.SWARAJ_SP1_ELF, hostBin: process.env.SWARAJ_SP1_HOST_BIN }
        : undefined;
    const outcome = await runOneProofJob(fixture.pool, { artifactRoot, sp1 });
    assert.ok(outcome, "worker processed the job");
    assert.equal(outcome.receiptId, receiptId);

    // 6. Every artifact materialized.
    const bundle = JSON.parse(await readFile(outcome.artifactPath, "utf8")) as {
      statementId: string;
      canonicalText: string;
    };
    assert.equal(bundle.statementId, outcome.statementId);
    assert.ok(bundle.canonicalText.includes(`policy=${wirePolicy.policyId}`));

    const ledger = await fixture.pool.raw.query<{ kind: string }>(
      "SELECT kind FROM proof_artifacts WHERE receipt_id = $1 ORDER BY artifact_id",
      [receiptId],
    );
    const expectedKinds = sp1
      ? ["VERIFICATION_BUNDLE", "SP1_PROOF", "ZKVERIFY_ATTESTATION"]
      : ["VERIFICATION_BUNDLE", "ZKVERIFY_ATTESTATION"];
    assert.deepEqual(ledger.rows.map((row) => row.kind), expectedKinds);

    // 7. The receipt reads PROVED through the MCP tool.
    const provedView = await bridge.toolResult("tools/call", {
      name: "swaraj_get_receipt",
      arguments: { receiptId },
    });
    assert.equal(provedView.state, "PROVED");
    assert.equal(provedView.proofRef, outcome.proofRef);
  } finally {
    await bridge?.close();
    await fixture.close();
    await rm(artifactRoot, { recursive: true, force: true });
  }
}, { timeout: 120_000 });
