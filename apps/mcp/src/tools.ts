import type { SwarajApiClient } from "./api-client.js";

/**
 * The tool surface exposed over MCP. Tool names and argument shapes are
 * the contract documented in docs/integration.md and shared with the SDK.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: "string" | "object"; description: string }>;
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
      "Submit a unified action for authorization under the application's active Agent Mandate. " +
      "ALLOW means accepted into the execution workflow, not completed execution; " +
      "poll swaraj_get_receipt for the outcome.",
    inputSchema: {
      type: "object",
      properties: {
        applicationId: { type: "string", description: "Application the agent acts for, e.g. app_demo" },
        action: { type: "object", description: "Unified action: agent, action, resource, context, timing, idempotencyKey, signature" },
      },
      required: ["applicationId", "action"],
    },
  },
  {
    name: "swaraj_get_receipt",
    description: "Fetch a receipt's status and proof reference.",
    inputSchema: {
      type: "object",
      properties: {
        applicationId: { type: "string", description: "Application the receipt belongs to" },
        receiptId: { type: "string", description: "Receipt identifier returned by swaraj_submit_action" },
      },
      required: ["applicationId", "receiptId"],
    },
  },
  {
    name: "swaraj_get_mandate",
    description: "Read the application's active Agent Mandate.",
    inputSchema: {
      type: "object",
      properties: {
        applicationId: { type: "string", description: "Application identifier" },
      },
      required: ["applicationId"],
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
      const action = args.action;
      if (typeof action !== "object" || action === null || Array.isArray(action)) {
        throw new InvalidArgumentsError("action must be an object");
      }
      const result = await client.submitAction(applicationId, action);
      const call = textResult(result);
      if (result.decision !== "ALLOW") call.isError = true;
      return call;
    }
    case "swaraj_get_receipt":
      return textResult(await client.getReceipt(requireString(args, "applicationId"), requireString(args, "receiptId")));
    case "swaraj_get_mandate":
      return textResult(await client.getMandate(requireString(args, "applicationId")));
    default:
      throw new UnknownToolError(name);
  }
}

function textResult(value: unknown): ToolCallResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
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

export class InvalidArgumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidArgumentsError";
  }
}
