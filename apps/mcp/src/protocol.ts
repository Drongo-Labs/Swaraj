/**
 * JSON-RPC 2.0 message handling for the MCP stdio transport: one
 * newline-delimited UTF-8 JSON message per line, exactly as the MCP
 * specification requires (no embedded newlines).
 */

export type RequestId = number | string;

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: RequestId | null;
  method: string;
  params?: Record<string, unknown> | undefined;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: RequestId | null;
  result?: unknown;
  error?: { code: number; message: string };
}

export class MalformedMessage extends Error {
  constructor(line: string) {
    super(`malformed JSON-RPC message: ${line.slice(0, 80)}`);
    this.name = "MalformedMessage";
  }
}

export function decodeRequest(line: string): JsonRpcRequest {
  const trimmed = line.trim();
  if (trimmed.length === 0) throw new MalformedMessage(line);
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new MalformedMessage(line);
  }
  if (typeof parsed !== "object" || parsed === null) throw new MalformedMessage(line);
  const record = parsed as Record<string, unknown>;
  if (record.jsonrpc !== "2.0" || typeof record.method !== "string") throw new MalformedMessage(line);
  const id = typeof record.id === "number" || typeof record.id === "string" ? record.id : null;
  const params = typeof record.params === "object" && record.params !== null
    ? (record.params as Record<string, unknown>)
    : undefined;
  return { jsonrpc: "2.0", id, method: record.method, params };
}

export function encodeResponse(response: JsonRpcResponse): string {
  const text = JSON.stringify(response);
  if (text.includes("\n")) throw new Error("response contains embedded newlines");
  return `${text}\n`;
}

export function okResponse(id: JsonRpcRequest["id"], result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

export function errorResponse(
  id: JsonRpcRequest["id"],
  code: number,
  message: string,
): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
