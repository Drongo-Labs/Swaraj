import assert from "node:assert/strict";
import test from "node:test";
import { spawn, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { runOneProofJob } from "@swaraj/proofs";
import { registerPolicy, startPipelineFixture, type FixtureHandle } from "./pipeline-fixture.ts";
import type { PolicyDoc } from "@swaraj/smt";

/**
 * End-to-end over real stdio: an MCP host process talks to swaraj-mcp,
 * which submits actions to the pipeline API. Covers the handshake, tool
 * discovery, submission, proof promotion, receipt lookup, and the
 * blocked path with rule attribution.
 */

interface JsonRpcMessage {
  jsonrpc?: string;
  id?: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
}

class McpHostSession {
  private nextId = 1;
  private readonly pending = new Map<number, (message: JsonRpcMessage) => void>();
  private readonly child: ChildProcess;

  constructor(child: ChildProcess) {
    assert.ok(child.stdout, "child stdout expected");
    this.child = child;
    const stdoutLines = createInterface({ input: child.stdout });
    this.attach(stdoutLines);
  }

  private attach(stdoutLines: ReturnType<typeof createInterface>): void {
    stdoutLines.on("line", (line) => {
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
      }, 5_000);
    });
    this.send({ jsonrpc: "2.0", id, method, ...(params !== undefined ? { params } : {}) });
    return promise;
  }

  notify(method: string): void {
    this.send({ jsonrpc: "2.0", method });
  }

  /** Push a raw line into the server, bypassing request bookkeeping. */
  writeRaw(line: string): void {
    assert.ok(this.child.stdin, "child stdin expected");
    this.child.stdin.write(`${line}\n`);
  }

  private send(message: Record<string, unknown>): void {
    this.writeRaw(JSON.stringify(message));
  }

  async close(): Promise<void> {
    this.child.stdin?.end();
    await once(this.child, "close");
  }
}

async function spawnHost(port: number, token: string): Promise<McpHostSession> {
  const mainJs = fileURLToPath(new URL("../dist/main.js", import.meta.url));
  const child = spawn(process.execPath, [mainJs], {
    env: {
      ...process.env,
      SWARAJ_URL: `http://127.0.0.1:${port}`,
      SWARAJ_DEV_TOKEN: token,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    process.stderr.write(`[swaraj-mcp] ${chunk.toString("utf8")}`);
  });
  return new McpHostSession(child);
}

const wirePolicy: PolicyDoc = {
  policyId: "pol_mcp_demo",
  revision: 2,
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

let fixture: FixtureHandle;
let host: McpHostSession;

test.before(async () => {
  fixture = await startPipelineFixture();
  await registerPolicy(fixture, wirePolicy);
  await fixture.pool.raw.query("DELETE FROM proof_jobs");
  host = await spawnHost(fixture.port, fixture.token);

  const init = await host.request("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "test-host", version: "0.0.0" },
  });
  const initResult = init.result as { protocolVersion: string; serverInfo: { name: string } };
  assert.equal(initResult.serverInfo.name, "swaraj-mcp");
  host.notify("notifications/initialized");
});

test.after(async () => {
  await host?.close();
  await fixture?.close();
});

test("host handshake and tool discovery", async () => {
  const ping = await host.request("ping");
  assert.deepEqual(ping.result, {});

  const tools = await host.request("tools/list");
  const result = tools.result as { tools: Array<{ name: string; inputSchema: { type: string } }> };
  assert.deepEqual(
    result.tools.map((tool) => tool.name),
    ["swaraj_submit_action", "swaraj_get_receipt", "swaraj_get_policy"],
  );
  for (const tool of result.tools) {
    assert.equal(tool.inputSchema.type, "object");
  }
});

test("policy tool returns digest and rules", async () => {
  const call = await host.request("tools/call", {
    name: "swaraj_get_policy",
    arguments: { policyId: wirePolicy.policyId },
  });
  const result = call.result as { content: Array<{ type: string; text: string }> };
  assert.equal(result.content[0]?.type, "text");
  const policy = JSON.parse(result.content[0]!.text) as { policyId: string; ruleIds: string[] };
  assert.equal(policy.policyId, wirePolicy.policyId);
  assert.deepEqual(policy.ruleIds, ["amount.positive", "amount.cap"]);
});

test("submission tool: ALLOW returns a receipt, BLOCK carries the violated rule", async () => {
  const allowed = await host.request("tools/call", {
    name: "swaraj_submit_action",
    arguments: {
      applicationId: fixture.appId,
      policyId: wirePolicy.policyId,
      input: { amountCents: "25000", limitCents: "100000" },
    },
  });
  const allowedResult = allowed.result as { isError?: boolean; content: Array<{ text: string }> };
  assert.equal(allowedResult.isError, undefined);
  const allowedBody = JSON.parse(allowedResult.content[0]!.text) as {
    decision: string;
    receiptId: string;
    violatedRuleIds: string[];
  };
  assert.equal(allowedBody.decision, "ALLOW");
  assert.ok(allowedBody.receiptId.startsWith("rcpt_"));

  const blocked = await host.request("tools/call", {
    name: "swaraj_submit_action",
    arguments: {
      applicationId: fixture.appId,
      policyId: wirePolicy.policyId,
      input: { amountCents: "250000", limitCents: "100000" },
    },
  });
  const blockedResult = blocked.result as { isError: boolean; content: Array<{ text: string }> };
  assert.equal(blockedResult.isError, true);
  const blockedBody = JSON.parse(blockedResult.content[0]!.text) as {
    decision: string;
    violatedRuleIds: string[];
  };
  assert.equal(blockedBody.decision, "BLOCK");
  assert.deepEqual(blockedBody.violatedRuleIds, ["amount.cap"]);
});

test("full pipeline through MCP: submit, prove, read the PROVED receipt", async () => {
  await fixture.pool.raw.query("DELETE FROM proof_jobs");
  const submitted = await host.request("tools/call", {
    name: "swaraj_submit_action",
    arguments: {
      applicationId: fixture.appId,
      policyId: wirePolicy.policyId,
      input: { amountCents: "40000", limitCents: "100000" },
      idempotencyKey: `mcp_${randomUUID().slice(0, 8)}`,
    },
  });
  const submittedBody = JSON.parse(
    (submitted.result as { content: Array<{ text: string }> }).content[0]!.text,
  ) as { receiptId: string };
  const receiptId = submittedBody.receiptId;

  // The proof worker drains the queue the submission filled.
  const outcome = await runOneProofJob(fixture.pool, {
    artifactRoot: `/tmp/swaraj-mcp-artifacts-${randomUUID().slice(0, 8)}`,
  });
  assert.ok(outcome, "worker processed the job");
  assert.equal(outcome.receiptId, receiptId);

  const fetched = await host.request("tools/call", {
    name: "swaraj_get_receipt",
    arguments: { receiptId },
  });
  const receipt = JSON.parse(
    (fetched.result as { content: Array<{ text: string }> }).content[0]!.text,
  ) as { state: string; proofRef?: string };
  assert.equal(receipt.state, "PROVED");
  assert.match(receipt.proofRef ?? "", /^zkv_local_[0-9a-f]{32}$/);
});

test("invalid tool arguments come back as tool errors, unknown tools as JSON-RPC errors", async () => {
  const invalid = await host.request("tools/call", {
    name: "swaraj_get_receipt",
    arguments: { receiptId: "" },
  });
  const invalidResult = invalid.result as { isError: boolean; content: Array<{ text: string }> };
  assert.equal(invalidResult.isError, true);
  assert.match(invalidResult.content[0]?.text ?? "", /receiptId/);

  const unknown = await host.request("tools/call", {
    name: "swaraj_no_such_tool",
    arguments: {},
  });
  assert.ok(unknown.error, "unknown tool must be a JSON-RPC error");
  assert.equal(unknown.error?.code, -32602);
});

test("unreadable input lines are ignored without killing the server", async () => {
  host.writeRaw("this is not json");
  const pong = await host.request("ping");
  assert.deepEqual(pong.result, {});
});
