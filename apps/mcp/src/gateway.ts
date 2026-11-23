import { createHash, randomUUID } from "node:crypto";
import type { SwarajApiClient } from "./api-client.js";

/**
 * Proxies an MCP server, authorizing each tools/call as an APP_ACTION. Anything but ALLOW stops the call.
 * `argsDigest` binds all arguments, including ones too complex to be params.
 *
 * Provenance: a tool result is outside content the agent did not write, so before one reaches the
 * agent the gateway records it with Swaraj. Every action it builds afterwards says
 * `provenance.untrusted: true`, and so does every other gateway of the same application.
 */

export interface GatewayOptions {
  client: SwarajApiClient;
  applicationId: string;
  agent: string;
  upstream: string;
  /** Signs the action digest when the mandate names an agentSigner. */
  sign?: (digest: `0x${string}`) => Promise<string>;
  /** Canonical signing payload, injected so the gateway stays free of schema code. */
  signingPayload?: (action: Record<string, unknown>) => string;
  now?: () => number;
  /** Tools whose results the owner trusts not to carry outside content (e.g. get_balance). */
  trustedTools?: ReadonlySet<string>;
}

const NAME = /^[A-Za-z][A-Za-z0-9_-]*$/;
const MAX_PARAMS = 15; // APP_ACTION allows 16; argsDigest takes one.
const ZERO_HASH = `0x${"00".repeat(32)}`;
const ZERO_SIGNATURE = `0x${"00".repeat(65)}`;
const ACTION_TTL_MS = 60_000;

/** Stable JSON so the digest does not depend on argument order. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((k) => `${JSON.stringify(k)}:${canonical(record[k])}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** Scalar arguments a mandate can match on; the rest stay in argsDigest. */
function toolParams(args: Record<string, unknown>): Record<string, string | boolean> {
  const params: Record<string, string | boolean> = {
    argsDigest: createHash("sha256").update(canonical(args)).digest("hex"),
  };
  for (const key of Object.keys(args).sort().slice(0, MAX_PARAMS)) {
    const value = args[key];
    if (!NAME.test(key) || key.length > 64 || key === "argsDigest") continue;
    if (typeof value === "boolean") params[key] = value;
    else if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) params[key] = String(value);
    else if (typeof value === "string" && value.length >= 1 && value.length <= 256) params[key] = value;
  }
  return params;
}

export function toolCallAction(
  options: Pick<GatewayOptions, "agent" | "upstream" | "now">,
  toolName: string,
  args: Record<string, unknown>,
  untrusted = true,
): Record<string, unknown> {
  const now = options.now?.() ?? Date.now();
  const id = randomUUID();
  return {
    intentId: `mcp_${id.replaceAll("-", "").slice(0, 32)}`,
    agent: options.agent,
    action: "APP_ACTION",
    resource: { app: options.upstream, target: toolName },
    context: { name: "tool_call", params: toolParams(args) },
    policyHash: ZERO_HASH,
    timestamp: now,
    expiry: now + ACTION_TTL_MS,
    idempotencyKey: `mcp-${id}`,
    signature: ZERO_SIGNATURE,
    provenance: { untrusted },
  };
}

/** Returns undefined when the call may proceed, otherwise why it may not. */
export async function authorizeToolCall(
  options: GatewayOptions,
  toolName: string,
  args: Record<string, unknown>,
  untrusted = true,
): Promise<string | undefined> {
  try {
    const action = toolCallAction(options, toolName, args, untrusted);
    if (options.sign && options.signingPayload) {
      const digest = `0x${createHash("sha256").update(options.signingPayload(action)).digest("hex")}` as const;
      action.signature = await options.sign(digest);
    }
    const result = await options.client.submitAction(options.applicationId, action);
    if (result.decision === "ALLOW") return undefined;
    return `Blocked by Swaraj: ${result.mandate?.reason ?? "no ALLOW decision"}`;
  } catch (error) {
    return `Blocked by Swaraj: could not authorize (${error instanceof Error ? error.message.slice(0, 200) : "unknown error"})`;
  }
}

type Routed = { toUpstream?: string; toAgent?: string };

/** One gateway session: routes agent and upstream lines, remembering which replies carry outside content. */
export function createGateway(options: GatewayOptions) {
  /** JSON-RPC id → what produced the reply, for requests whose reply is outside content. */
  const pending = new Map<string, string>();
  let untrusted = false;
  const source = (what: string) => `${options.upstream}/${what}`.replace(/[^A-Za-z0-9._:@/+-]/g, "_").slice(0, 128);

  /** Clean only when neither this gateway nor any other of the application has seen outside content. */
  const isUntrusted = async () => {
    if (untrusted) return true;
    try {
      return (await options.client.getProvenance(options.applicationId)).untrusted !== false;
    } catch {
      return true;
    }
  };

  return {
    async fromAgent(line: string): Promise<Routed> {
      let message: { id?: unknown; method?: unknown; params?: { name?: unknown; arguments?: unknown } };
      try {
        message = JSON.parse(line) as typeof message;
      } catch {
        return {};
      }
      const key = message.id === undefined ? undefined : JSON.stringify(message.id);
      if (message.method === "resources/read" && key !== undefined) pending.set(key, source("resources/read"));
      if (message.method !== "tools/call") return { toUpstream: line };

      const toolName = typeof message.params?.name === "string" ? message.params.name : "";
      const raw = message.params?.arguments;
      const args = typeof raw === "object" && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
      const denied = await authorizeToolCall(options, toolName, args, await isUntrusted());
      if (denied === undefined) {
        if (key !== undefined && !options.trustedTools?.has(toolName)) pending.set(key, source(toolName));
        return { toUpstream: line };
      }
      return {
        toAgent: JSON.stringify({
          jsonrpc: "2.0",
          id: message.id ?? null,
          result: { content: [{ type: "text", text: denied }], isError: true },
        }),
      };
    },

    /** Outside content is recorded before the agent can read it; if it cannot be recorded, it is withheld. */
    async fromUpstream(line: string): Promise<string> {
      let message: { id?: unknown; result?: unknown };
      try {
        message = JSON.parse(line) as typeof message;
      } catch {
        return line;
      }
      const key = message.id === undefined ? undefined : JSON.stringify(message.id);
      const from = key === undefined ? undefined : pending.get(key);
      if (key === undefined || from === undefined) return line;
      pending.delete(key);
      if (message.result === undefined) return line;
      untrusted = true;
      try {
        await options.client.markUntrusted(options.applicationId, from);
        return line;
      } catch {
        return JSON.stringify({
          jsonrpc: "2.0",
          id: message.id,
          error: { code: -32000, message: "Swaraj could not record this result as untrusted input, so it was withheld" },
        });
      }
    },
  };
}
