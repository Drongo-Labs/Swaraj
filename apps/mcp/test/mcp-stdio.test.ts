import assert from "node:assert/strict";
import test from "node:test";
import { spawn, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { LocalKeySigner } from "@swaraj/crypto";
import { buildApp } from "../../api/dist/app.js";

/**
 * End-to-end over real stdio: an MCP host process talks to swaraj-mcp, which
 * calls the real Swaraj API. Covers the handshake, tool discovery, mandate
 * lookup, and the allowed and blocked paths with rule attribution.
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

const token = "development-test-token-at-least-32-characters";
const applicationId = "app_mcp";

type Api = Awaited<ReturnType<typeof buildApp>>;
let api: Api;
let host: McpHostSession;

function payment(amount: string): Record<string, unknown> {
  const now = Date.now();
  return {
    intentId: "intent_mcp",
    agent: "agent:mcp",
    action: "PAYMENT",
    resource: { service: "stripe" },
    context: { amount, currency: "USD", recipient: "acct_vendor" },
    policyHash: `0x${"9".repeat(64)}`,
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `mcp-${randomUUID()}`,
    signature: `0x${"00".repeat(65)}`,
  };
}

const callTool = async (name: string, args: Record<string, unknown>) => {
  const response = await host.request("tools/call", { name, arguments: args });
  return response.result as { isError?: boolean; content: Array<{ text: string }> };
};

test.before(async () => {
  api = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: "",
    signer: new LocalKeySigner(`0x${"11".repeat(32)}`),
  });
  const now = Date.now();
  const registered = await api.inject({
    method: "POST",
    url: `/v1/applications/${applicationId}/mandates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      mandateId: "mandate_mcp",
      version: 1,
      agent: "*",
      defaultEffect: "DENY",
      validFrom: now - 1000,
      validUntil: now + 3_600_000,
      rules: [
        {
          ruleId: "forbid_large",
          effect: "FORBID",
          action: "PAYMENT",
          predicates: [{ field: "context.amount", operator: "GT", value: "1000" }],
        },
        { ruleId: "permit_pay", effect: "PERMIT", action: "PAYMENT", predicates: [] },
      ],
    },
  });
  assert.equal(registered.statusCode, 201, registered.body);
  await api.listen({ port: 0, host: "127.0.0.1" });
  const address = api.server.address();
  assert.ok(address !== null && typeof address === "object");
  host = await spawnHost(address.port, token);

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
  await api?.close();
});

test("host handshake and tool discovery", async () => {
  const ping = await host.request("ping");
  assert.deepEqual(ping.result, {});

  const tools = await host.request("tools/list");
  const result = tools.result as { tools: Array<{ name: string; inputSchema: { type: string } }> };
  assert.deepEqual(
    result.tools.map((tool) => tool.name),
    ["swaraj_submit_action", "swaraj_get_receipt", "swaraj_get_mandate"],
  );
  for (const tool of result.tools) {
    assert.equal(tool.inputSchema.type, "object");
  }
});

test("mandate tool reads the active mandate from the real API", async () => {
  const result = await callTool("swaraj_get_mandate", { applicationId });
  assert.equal(JSON.parse(result.content[0]!.text).mandate.mandateId, "mandate_mcp");
});

test("submission tool: the real gateway allows and blocks with rule attribution", async () => {
  const allowed = await callTool("swaraj_submit_action", { applicationId, action: payment("1000") });
  assert.notEqual(allowed.isError, true, allowed.content[0]?.text);
  assert.equal(JSON.parse(allowed.content[0]!.text).decision, "ALLOW");

  const blocked = await callTool("swaraj_submit_action", { applicationId, action: payment("1001") });
  assert.equal(blocked.isError, true);
  const body = JSON.parse(blocked.content[0]!.text);
  assert.equal(body.decision, "BLOCK");
  assert.deepEqual(body.mandate.matchedRuleIds, ["forbid_large"]);
});

test("an action the API rejects comes back as a tool error, not an allow", async () => {
  const result = await callTool("swaraj_submit_action", { applicationId, action: { action: "PAYMENT" } });
  assert.equal(result.isError, true);
  assert.match(result.content[0]?.text ?? "", /400/);
});

test("invalid tool arguments come back as tool errors, unknown tools as JSON-RPC errors", async () => {
  const invalid = await callTool("swaraj_get_receipt", { applicationId, receiptId: "" });
  assert.equal(invalid.isError, true);
  assert.match(invalid.content[0]?.text ?? "", /receiptId/);

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
