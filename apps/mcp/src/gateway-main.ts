import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { LocalKeySigner, type Hex } from "@swaraj/crypto";
import { parseUnifiedAction, unifiedActionSigningPayload } from "@swaraj/schemas";
import { SwarajApiClient } from "./api-client.js";
import { createGateway, type GatewayOptions } from "./gateway.js";

/**
 * Proxies an MCP server: SWARAJ_UPSTREAM_NAME=github swaraj-mcp-gateway -- npx some-mcp-server
 * Also needs SWARAJ_URL, SWARAJ_DEV_TOKEN, SWARAJ_APPLICATION_ID. Optional: SWARAJ_AGENT, SWARAJ_AGENT_KEY,
 * SWARAJ_TRUSTED_TOOLS (comma-separated tools whose results are not outside content).
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    process.stderr.write(`swaraj-mcp-gateway: ${name} must be set\n`);
    process.exit(1);
  }
  return value;
}

const separator = process.argv.indexOf("--");
const command = separator >= 0 ? process.argv.slice(separator + 1) : [];
if (command.length === 0) {
  process.stderr.write("usage: swaraj-mcp-gateway -- <upstream command> [args...]\n");
  process.exit(1);
}

const key = process.env.SWARAJ_AGENT_KEY;
const signer = key ? new LocalKeySigner(key as Hex) : undefined;
const options: GatewayOptions = {
  client: new SwarajApiClient({ baseUrl: required("SWARAJ_URL"), token: required("SWARAJ_DEV_TOKEN") }),
  applicationId: required("SWARAJ_APPLICATION_ID"),
  agent: process.env.SWARAJ_AGENT ?? "agent:mcp",
  upstream: required("SWARAJ_UPSTREAM_NAME"),
  trustedTools: new Set((process.env.SWARAJ_TRUSTED_TOOLS ?? "").split(",").map((name) => name.trim()).filter(Boolean)),
  ...(signer
    ? {
        sign: (digest: `0x${string}`) => signer.signDigest(digest),
        signingPayload: (action: Record<string, unknown>) => unifiedActionSigningPayload(parseUnifiedAction(action)),
      }
    : {}),
};

const upstream = spawn(command[0]!, command.slice(1), { stdio: ["pipe", "pipe", "inherit"] });
upstream.on("error", (error) => {
  process.stderr.write(`swaraj-mcp-gateway: upstream failed: ${error.message}\n`);
  process.exit(1);
});
upstream.on("exit", (code) => process.exit(code ?? 1));
const gateway = createGateway(options);
createInterface({ input: upstream.stdout }).on("line", (line) => {
  void gateway.fromUpstream(line).then((out) => process.stdout.write(`${out}\n`));
});

createInterface({ input: process.stdin })
  .on("line", (line) => {
    void gateway.fromAgent(line).then(({ toUpstream, toAgent }) => {
      if (toUpstream !== undefined) upstream.stdin.write(`${toUpstream}\n`);
      if (toAgent !== undefined) process.stdout.write(`${toAgent}\n`);
    });
  })
  .on("close", () => upstream.stdin.end());
