import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { LocalKeySigner, type Hex } from "@swaraj/crypto";
import { parseUnifiedAction, unifiedActionSigningPayload } from "@swaraj/schemas";
import { SwarajApiClient } from "./api-client.js";
import { gatewayLine, type GatewayOptions } from "./gateway.js";

/**
 * swaraj-mcp-gateway: point an agent's MCP config here instead of at the
 * upstream server.
 *
 *   SWARAJ_URL=… SWARAJ_DEV_TOKEN=… SWARAJ_APPLICATION_ID=app_demo \
 *   SWARAJ_UPSTREAM_NAME=github swaraj-mcp-gateway -- npx some-mcp-server
 *
 * Optional: SWARAJ_AGENT (default agent:mcp), SWARAJ_AGENT_KEY (secp256k1 hex,
 * required when the mandate names an agentSigner).
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
upstream.stdout.pipe(process.stdout);

createInterface({ input: process.stdin })
  .on("line", (line) => {
    void gatewayLine(options, line).then(({ toUpstream, toAgent }) => {
      if (toUpstream !== undefined) upstream.stdin.write(`${toUpstream}\n`);
      if (toAgent !== undefined) process.stdout.write(`${toAgent}\n`);
    });
  })
  .on("close", () => upstream.stdin.end());
