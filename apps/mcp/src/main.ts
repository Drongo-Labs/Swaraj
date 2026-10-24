import { createInterface } from "node:readline";
import { SwarajApiClient } from "./api-client.js";
import { McpServer, PROTOCOL_VERSION } from "./server.js";
import { dispatchToolCall } from "./tools.js";

/**
 * Entry point: swaraj-mcp. Speaks MCP over stdio and talks to the Swaraj
 * API over HTTP. Requires SWARAJ_URL and SWARAJ_DEV_TOKEN in the
 * environment (see .env.example).
 */

function main(): void {
  const baseUrl = process.env.SWARAJ_URL;
  const token = process.env.SWARAJ_DEV_TOKEN;
  if (!baseUrl || !token) {
    process.stderr.write("swaraj-mcp: SWARAJ_URL and SWARAJ_DEV_TOKEN must be set\n");
    process.exit(1);
  }

  const client = new SwarajApiClient({ baseUrl, token });
  const server = new McpServer({
    serverInfo: { name: "swaraj-mcp", version: "0.1.0" },
    dispatch: (toolName, args) => dispatchToolCall(client, toolName, args),
  });

  const input = createInterface({ input: process.stdin });
  input.on("line", (line) => {
    void server.handleLine(line).then((response) => {
      if (response !== undefined) process.stdout.write(response);
    });
  });
  input.on("close", () => {
    process.exit(0);
  });
}

export { PROTOCOL_VERSION };

main();
