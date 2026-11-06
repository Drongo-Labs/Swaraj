import { createHash, randomUUID } from "node:crypto";
import type { SwarajApiClient } from "./api-client.js";

/**
 * MCP gateway: a stdio proxy between an agent and an upstream MCP server.
 * Every tools/call is authorized as an APP_ACTION first; everything else
 * passes through untouched. Anything but an explicit ALLOW stops the call.
 *
 * Mandates address calls by `resource.app` (the upstream name),
 * `resource.target` (the tool name) and `context.params`. `argsDigest` always
 * binds the full arguments, so values too complex to be params still reach
 * the receipt.
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
  };
}

/** Returns undefined when the call may proceed, otherwise why it may not. */
export async function authorizeToolCall(
  options: GatewayOptions,
  toolName: string,
  args: Record<string, unknown>,
): Promise<string | undefined> {
  try {
    const action = toolCallAction(options, toolName, args);
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

/**
 * Handles one line from the agent. Returns what to send upstream, what to
 * reply to the agent directly, or nothing for unparseable input.
 */
export async function gatewayLine(
  options: GatewayOptions,
  line: string,
): Promise<{ toUpstream?: string; toAgent?: string }> {
  let message: { id?: unknown; method?: unknown; params?: { name?: unknown; arguments?: unknown } };
  try {
    message = JSON.parse(line) as typeof message;
  } catch {
    return {};
  }
  if (message.method !== "tools/call") return { toUpstream: line };

  const toolName = typeof message.params?.name === "string" ? message.params.name : "";
  const raw = message.params?.arguments;
  const args = typeof raw === "object" && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const denied = await authorizeToolCall(options, toolName, args);
  if (denied === undefined) return { toUpstream: line };
  return {
    toAgent: JSON.stringify({
      jsonrpc: "2.0",
      id: message.id ?? null,
      result: { content: [{ type: "text", text: denied }], isError: true },
    }),
  };
}
