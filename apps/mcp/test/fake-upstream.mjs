// Minimal upstream MCP server: answers every request and records tool calls to a file.
import { appendFileSync } from "node:fs";
import { createInterface } from "node:readline";

createInterface({ input: process.stdin }).on("line", (line) => {
  const message = JSON.parse(line);
  if (message.id === undefined) return;
  if (message.method === "tools/call") appendFileSync(process.env.UPSTREAM_LOG, `${message.params.name}\n`);
  const result = message.method === "tools/call"
    ? { content: [{ type: "text", text: `ran ${message.params.name}` }] }
    : { tools: [{ name: "delete_repo" }, { name: "read_file" }] };
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id: message.id, result })}\n`);
});
