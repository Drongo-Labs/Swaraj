import type { SubmitActionRequest, SwarajApiClient } from "./api-client.js";

/**
 * The tool surface exposed over MCP. Tool names and argument shapes are
 * the contract documented in docs/integration.md and shared with the SDK.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: "string" | "object"; description: string; additionalProperties?: { type: "string" } }>;
    required: string[];
  };
}

export interface ToolCallResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "swaraj_submit_action",
    description:
      "Submit an action for authorization under the application's active policy. " +
      "ALLOW means accepted into the execution workflow, not completed execution; " +
      "poll swaraj_get_receipt for the outcome.",
    inputSchema: {
      type: "object",
      properties: {
        applicationId: { type: "string", description: "Application the agent acts for, e.g. app_demo" },
        policyId: { type: "string", description: "Policy revision set the action is checked against" },
        input: {
          type: "object",
          description: "Ground field values as decimal strings (integers only)",
          additionalProperties: { type: "string" },
        },
        idempotencyKey: { type: "string", description: "Stable key; retries with the same key return the same receipt" },
      },
      required: ["applicationId", "policyId", "input"],
    },
  },
  {
    name: "swaraj_get_receipt",
    description: "Fetch a receipt's lifecycle state and proof reference.",
    inputSchema: {
      type: "object",
      properties: {
        receiptId: { type: "string", description: "Receipt identifier returned by swaraj_submit_action" },
      },
      required: ["receiptId"],
    },
  },
  {
    name: "swaraj_get_policy",
    description: "Read a policy's revision, digest, and rule identifiers.",
    inputSchema: {
      type: "object",
      properties: {
        policyId: { type: "string", description: "Policy identifier" },
      },
      required: ["policyId"],
    },
  },
];

export async function dispatchToolCall(
  client: SwarajApiClient,
  name: string,
  args: Record<string, unknown>,
): Promise<ToolCallResult> {
  switch (name) {
    case "swaraj_submit_action": {
      const applicationId = requireString(args, "applicationId");
      const policyId = requireString(args, "policyId");
      const input = requireStringMap(args, "input");
      const idempotencyKey = optionalString(args, "idempotencyKey");
      const request: SubmitActionRequest = { applicationId, policyId, input };
      if (idempotencyKey !== undefined) request.idempotencyKey = idempotencyKey;
      const result = await client.submitAction(request);
      const call: ToolCallResult = { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      if (result.decision === "BLOCK") call.isError = true;
      return call;
    }
    case "swaraj_get_receipt": {
      const receiptId = requireString(args, "receiptId");
      const receipt = await client.getReceipt(receiptId);
      return { content: [{ type: "text", text: JSON.stringify(receipt, null, 2) }] };
    }
    case "swaraj_get_policy": {
      const policyId = requireString(args, "policyId");
      const policy = await client.getPolicy(policyId);
      return { content: [{ type: "text", text: JSON.stringify(policy, null, 2) }] };
    }
    default:
      throw new UnknownToolError(name);
  }
}

export class UnknownToolError extends Error {
  constructor(public readonly toolName: string) {
    super(`unknown tool: ${toolName}`);
    this.name = "UnknownToolError";
  }
}

function requireString(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new InvalidArgumentsError(`${key} must be a non-empty string`);
  }
  return value;
}

function optionalString(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length === 0) {
    throw new InvalidArgumentsError(`${key} must be a non-empty string when present`);
  }
  return value;
}

function requireStringMap(args: Record<string, unknown>, key: string): Record<string, string> {
  const value = args[key];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new InvalidArgumentsError(`${key} must be an object of string values`);
  }
  const result: Record<string, string> = {};
  for (const [field, raw] of Object.entries(value)) {
    if (typeof raw !== "string") {
      throw new InvalidArgumentsError(`${key}.${field} must be a decimal string`);
    }
    result[field] = raw;
  }
  return result;
}

export class InvalidArgumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidArgumentsError";
  }
}
