import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { LocalKeySigner } from "@swaraj/crypto";
import { parseUnifiedAction } from "@swaraj/schemas";
import { buildApp } from "../../api/dist/app.js";
import { toolCallAction } from "../dist/gateway.js";

const token = "development-test-token-at-least-32-characters";
const applicationId = "app_gateway";
const logDir = mkdtempSync(join(tmpdir(), "swaraj-gateway-"));
const logFile = join(logDir, "upstream.log");
const upstreamCalls = () => {
  try {
    return readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
};

class Agent {
  private id = 1;
  private readonly waiting = new Map<number, (message: { result: { isError?: boolean; content?: Array<{ text: string }>; tools?: unknown[] } }) => void>();
  readonly child: ChildProcess;
  constructor(child: ChildProcess) {
    this.child = child;
    createInterface({ input: child.stdout! }).on("line", (line) => {
      const message = JSON.parse(line);
      this.waiting.get(message.id)?.(message);
    });
  }
  request(method: string, params: Record<string, unknown> = {}) {
    const id = this.id++;
    const reply = new Promise<{ result: { isError?: boolean; content?: Array<{ text: string }>; tools?: unknown[] } }>((resolve, reject) => {
      this.waiting.set(id, resolve);
      setTimeout(() => reject(new Error(`timed out waiting for ${method}`)), 5000).unref();
    });
    this.child.stdin!.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    return reply;
  }
  call(name: string, args: Record<string, unknown> = {}) {
    return this.request("tools/call", { name, arguments: args });
  }
  async close() {
    if (this.child.exitCode !== null) return;
    this.child.stdin!.end();
    await once(this.child, "close");
  }
}

function startGateway(url: string, env: Record<string, string> = {}): Agent {
  const main = fileURLToPath(new URL("../dist/gateway-main.js", import.meta.url));
  const upstream = fileURLToPath(new URL("./fake-upstream.mjs", import.meta.url));
  return new Agent(spawn(process.execPath, [main, "--", process.execPath, upstream], {
    env: {
      ...process.env,
      SWARAJ_URL: url,
      SWARAJ_DEV_TOKEN: token,
      SWARAJ_APPLICATION_ID: applicationId,
      SWARAJ_UPSTREAM_NAME: "github",
      UPSTREAM_LOG: logFile,
      SWARAJ_AGENT_KEY: "",
      ...env,
    },
    stdio: ["pipe", "pipe", "inherit"],
  }));
}

type Api = Awaited<ReturnType<typeof buildApp>>;
let api: Api;
let url: string;
let agent: Agent;
const agentKey = new LocalKeySigner(`0x${"22".repeat(32)}`);

async function setMandate(version: number, extra: Record<string, unknown> = {}) {
  const now = Date.now();
  const response = await api.inject({
    method: "POST",
    url: `/v1/applications/${applicationId}/mandates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      mandateId: "mandate_gateway",
      version,
      agent: "*",
      defaultEffect: "DENY",
      validFrom: now - 1000,
      validUntil: now + 3_600_000,
      rules: [
        {
          ruleId: "forbid_secrets",
          effect: "FORBID",
          action: "APP_ACTION",
          predicates: [{ field: "context.paramString", name: "path", operator: "EQ", value: ".env" }],
        },
        {
          ruleId: "permit_read",
          effect: "PERMIT",
          action: "APP_ACTION",
          predicates: [
            { field: "resource.app", operator: "EQ", value: "github" },
            { field: "resource.target", operator: "EQ", value: "read_file" },
          ],
        },
      ],
      ...extra,
    },
  });
  assert.equal(response.statusCode, 201, response.body);
}

test.before(async () => {
  api = await buildApp(token, {
    pipelineMode: "mock",
    databaseUrl: "",
    signer: new LocalKeySigner(`0x${"11".repeat(32)}`),
  });
  await setMandate(1);
  await api.listen({ port: 0, host: "127.0.0.1" });
  const address = api.server.address();
  assert.ok(address !== null && typeof address === "object");
  url = `http://127.0.0.1:${address.port}`;
  agent = startGateway(url);
});

test.after(async () => {
  await agent?.close();
  await api?.close();
  rmSync(logDir, { recursive: true, force: true });
});

test("non-tool traffic passes through to the upstream", async () => {
  const listed = await agent.request("tools/list");
  assert.equal(listed.result.tools?.length, 2);
});

test("a permitted tool call reaches the upstream", async () => {
  const reply = await agent.call("read_file", { path: "README.md" });
  assert.equal(reply.result.isError, undefined);
  assert.equal(reply.result.content?.[0]?.text, "ran read_file");
});

test("an unpermitted tool is default-denied and never reaches the upstream", async () => {
  const reply = await agent.call("delete_repo", { repo: "swaraj" });
  assert.equal(reply.result.isError, true);
  assert.match(reply.result.content?.[0]?.text ?? "", /DEFAULT_DENY/);
  assert.equal(upstreamCalls().includes("delete_repo"), false);
});

test("a forbid on an argument value beats the permit", async () => {
  const before = upstreamCalls().length;
  const reply = await agent.call("read_file", { path: ".env" });
  assert.match(reply.result.content?.[0]?.text ?? "", /FORBID_MATCH/);
  assert.equal(upstreamCalls().length, before);
});

test("when Swaraj is unreachable the call is blocked, not forwarded", async () => {
  const offline = startGateway("http://127.0.0.1:9");
  try {
    const before = upstreamCalls().length;
    const reply = await offline.call("read_file", { path: "README.md" });
    assert.equal(reply.result.isError, true);
    assert.match(reply.result.content?.[0]?.text ?? "", /could not authorize/);
    assert.equal(upstreamCalls().length, before);
  } finally {
    await offline.close();
  }
});

test("a mandate with an agentSigner only passes calls signed by that key", async () => {
  await setMandate(2, { agentSigner: agentKey.address });
  const signed = startGateway(url, { SWARAJ_AGENT_KEY: `0x${"22".repeat(32)}` });
  try {
    assert.equal((await signed.call("read_file", { path: "a.md" })).result.isError, undefined);
    assert.match((await agent.call("read_file", { path: "a.md" })).result.content?.[0]?.text ?? "", /INVALID_SIGNATURE/);
  } finally {
    await signed.close();
    await setMandate(3);
  }
});

test("every action the gateway builds is a valid unified action, whatever the arguments", () => {
  const options = { agent: "agent:mcp", upstream: "github" };
  const awkward = [
    {},
    { nested: { a: 1 }, list: [1, 2], "bad key!": "x", negative: -1, float: 1.5, empty: "", nothing: null },
    { big: "x".repeat(5000), argsDigest: "spoof" },
    Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`arg${i}`, i])),
  ];
  for (const args of awkward) parseUnifiedAction(toolCallAction(options, "tool.name/with-odd_chars", args));
  const spoof = toolCallAction(options, "t", { argsDigest: "spoof" }) as { context: { params: { argsDigest: string } } };
  assert.notEqual(spoof.context.params.argsDigest, "spoof");
});

test("after a tool result reaches the agent, a payment rule on untrusted input blocks every gateway of the app", async () => {
  const clear = () => api.inject({ method: "POST", url: `/v1/applications/${applicationId}/provenance/clear`, headers: { authorization: `Bearer ${token}` } });
  const now = Date.now();
  const posted = await api.inject({
    method: "POST",
    url: `/v1/applications/${applicationId}/mandates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      mandateId: "mandate_gateway", version: 4, agent: "*", defaultEffect: "DENY", validFrom: now - 1000, validUntil: now + 3_600_000,
      rules: [
        { ruleId: "forbid_tainted_pay", effect: "FORBID", action: "APP_ACTION", predicates: [
          { field: "resource.target", operator: "EQ", value: "send_payment" },
          { field: "provenance.untrusted", operator: "EQ", value: true },
        ] },
        { ruleId: "permit_github", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "resource.app", operator: "EQ", value: "github" }] },
      ],
    },
  });
  assert.equal(posted.statusCode, 201, posted.body);
  const payments = startGateway(url, { SWARAJ_TRUSTED_TOOLS: "send_payment" });
  const trusting = startGateway(url, { SWARAJ_TRUSTED_TOOLS: "read_file" });
  try {
    await clear();
    assert.equal((await payments.call("send_payment", { amount: 5 })).result.isError, undefined);

    // A trusted tool's result does not taint.
    assert.equal((await trusting.call("read_file", { path: "a.md" })).result.isError, undefined);
    assert.equal((await payments.call("send_payment", { amount: 5 })).result.isError, undefined);

    // Outside content read through one gateway taints the payment gateway too.
    assert.equal((await agent.call("read_file", { path: "tweet.txt" })).result.isError, undefined);
    assert.match((await payments.call("send_payment", { amount: 5 })).result.content?.[0]?.text ?? "", /FORBID_MATCH/);

    await clear();
    assert.equal((await trusting.call("send_payment", { amount: 5 })).result.isError, undefined);
  } finally {
    await payments.close();
    await trusting.close();
    await clear();
    await setMandate(5);
  }
});
