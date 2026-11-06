import {
  decodeRequest,
  encodeResponse,
  errorResponse,
  okResponse,
  type JsonRpcRequest,
} from "./protocol.js";
import { ApiError } from "./api-client.js";
import { InvalidArgumentsError, TOOL_DEFINITIONS, UnknownToolError } from "./tools.js";

/** Minimal MCP stdio server. Tool calls go through the injected dispatcher. */

export const PROTOCOL_VERSION = "2025-06-18";

export interface McpServerOptions {
  serverInfo: { name: string; version: string };
  dispatch: (toolName: string, args: Record<string, unknown>) => Promise<unknown>;
}

export class McpServer {
  constructor(private readonly options: McpServerOptions) {}

  /** Returns the response line, or undefined for notifications and unparseable input. */
  async handleLine(line: string): Promise<string | undefined> {
    let request: JsonRpcRequest;
    try {
      request = decodeRequest(line);
    } catch {
      return undefined;
    }

    switch (request.method) {
      case "initialize":
        return encodeResponse(
          okResponse(request.id, {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: { tools: {} },
            serverInfo: this.options.serverInfo,
          }),
        );

      case "notifications/initialized":
      case "initialized":
        return undefined;

      case "ping":
        return encodeResponse(okResponse(request.id, {}));

      case "tools/list":
        return encodeResponse(okResponse(request.id, { tools: TOOL_DEFINITIONS }));

      case "tools/call":
        return await this.handleToolCall(request);

      default:
        if (request.id === null) return undefined;
        return encodeResponse(errorResponse(request.id, -32601, `method not found: ${request.method}`));
    }
  }

  private async handleToolCall(request: JsonRpcRequest): Promise<string> {
    const params = request.params ?? {};
    const toolName = typeof params.name === "string" ? params.name : "";
    const args =
      typeof params.arguments === "object" && params.arguments !== null
        ? (params.arguments as Record<string, unknown>)
        : {};
    try {
      const result = await this.options.dispatch(toolName, args);
      return encodeResponse(okResponse(request.id, result));
    } catch (err) {
      if (err instanceof UnknownToolError) {
        return encodeResponse(errorResponse(request.id, -32602, err.message));
      }
      if (err instanceof InvalidArgumentsError || err instanceof ApiError) {
        return encodeResponse(
          okResponse(request.id, {
            content: [{ type: "text", text: err.message }],
            isError: true,
          }),
        );
      }
      const message = err instanceof Error ? err.message : String(err);
      return encodeResponse(errorResponse(request.id, -32603, `internal error: ${message}`));
    }
  }
}
