import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { checkEnclave, runAgent } from "./agent/run.js";
import { registerShadeAgent, shadeConfigFromEnv } from "./agent/shade.js";
import { nearAiConfigFromEnv, nearAiMove, verifyNearAi } from "./agent/nearai.js";
import type { AgentView } from "./game/table.js";
import type { ZunnoProposal } from "./actions/intents.js";
import { loadConfig } from "./config.js";
import { remoteTable } from "./game/table.js";
import { registerZunnoMandate } from "./swaraj/gateway.js";

/**
 * `pnpm play` — Zunno with the Swaraj-governed AI opponent. The rules engine
 * runs as its own process holding both hands, and this process plays the
 * agent's seat through its token only.
 *
 * ZUNNO_ENCLAVE_URL + ZUNNO_AGENT_TOKEN: use a rules engine running elsewhere
 * (e.g. a TDX VM) instead of starting one. ZUNNO_REQUIRE_TEE=1: refuse to play
 * unless the engine reports a TEE. SHADE_*: register the agent as a Shade
 * Agent on NEAR first (see the README). NEAR_AI_API_KEY / NEAR_API_KEY: pick
 * moves with NEAR AI Cloud private inference, after checking its attestation.
 */

for (const candidate of [
  ".env",
  fileURLToPath(new URL("../.env", import.meta.url)), // examples/zunno/.env
  fileURLToPath(new URL("../../../.env", import.meta.url)), // repo root .env
]) {
  if (existsSync(candidate)) process.loadEnvFile(candidate);
}

const requireTee = process.env.ZUNNO_REQUIRE_TEE === "1";
let enclave: URL;
let token = process.env.ZUNNO_AGENT_TOKEN ?? "";

if (process.env.ZUNNO_ENCLAVE_URL) {
  enclave = new URL(process.env.ZUNNO_ENCLAVE_URL);
} else {
  token = randomBytes(32).toString("hex");
  const child = spawn(process.execPath, ["--import", "tsx", fileURLToPath(new URL("./enclave/main.ts", import.meta.url))], {
    env: { ...process.env, ZUNNO_AGENT_TOKEN: token, PORT: process.env.PORT ?? "3002" },
    stdio: ["ignore", "pipe", "inherit"],
  });
  process.on("exit", () => child.kill());
  for (const signal of ["SIGINT", "SIGTERM"] as const) process.once(signal, () => process.exit(0));
  enclave = await new Promise<URL>((resolve, reject) => {
    child.stdout.on("data", (chunk: Buffer) => {
      const match = /enclave ready (\S+)/.exec(chunk.toString());
      if (match) resolve(new URL(match[1]!));
    });
    child.on("exit", (code) => reject(new Error(`rules engine exited with code ${code}`)));
  });
}

const attestation = await checkEnclave(enclave, requireTee);
const table = remoteTable(enclave, token);
if (attestation.tee === "none") {
  await table.log("Rules engine is running outside a TEE (local mode).", false);
}
const shade = shadeConfigFromEnv();
if (shade) {
  const agentAccount = await registerShadeAgent(shade);
  await table.log(`Agent is Shade Agent ${agentAccount.slice(0, 8)}… on ${shade.contractId} (local mode, mock attestation).`, false);
  console.log(`Shade Agent: ${agentAccount} registered on ${shade.contractId}`);
}
let pickMove: ((view: AgentView) => Promise<ZunnoProposal | undefined>) | undefined;
const nearAi = nearAiConfigFromEnv();
if (nearAi) {
  try {
    const attested = await verifyNearAi(nearAi);
    pickMove = (view) => nearAiMove(nearAi, attested, view);
    await table.log(`Agent thinks with NEAR AI ${nearAi.model}; its TEE attestation checked out.`, false);
    console.log(`NEAR AI: ${nearAi.model}, attested signer(s) ${[...attested].join(", ")}`);
  } catch (error) {
    // Fail closed: no prompt is sent to a model whose attestation did not verify.
    await table.log("NEAR AI attestation failed, so the agent uses its built-in moves.", true);
    console.error(`NEAR AI attestation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
const config = loadConfig();
let policyHash: string | undefined;
try {
  const registered = await registerZunnoMandate(config);
  if (registered) {
    policyHash = registered.policyHash;
    await table.log(`Mandate ${registered.mandateId} on live Swaraj gateway (${config.swarajApiUrl}).`, false);
    console.log(`Swaraj gateway: live at ${config.swarajApiUrl} (mandate ${registered.mandateId})`);
  } else {
    console.log("Swaraj gateway: embedded (set ZUNNO_GATEWAY=live + SWARAJ_DEV_TOKEN for live unified-actions)");
  }
} catch (error) {
  console.error(`Mandate registration failed; falling back to embedded gateway: ${error instanceof Error ? error.message : String(error)}`);
}
runAgent(config, table, pickMove, 300, policyHash);

console.log(`Zunno × Swaraj — playing at ${enclave}`);
console.log(`Rules engine: ${attestation.tee === "none" ? "separate process, no TEE" : "TDX"} (code ${attestation.codeHash.slice(0, 12)}…)`);
console.log("The agent's every move goes through its Agent Mandate (default deny). Blocked moves are marked in red.");
