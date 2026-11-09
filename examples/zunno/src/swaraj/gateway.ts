import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EmbeddedGateway } from "./embeddedGateway.js";
import { SwarajClient, type GatewayDecision } from "./client.js";
import { AgentMandateWireSchema } from "./mandateSchema.js";
import type { ZunnoAgentConfig } from "../config.js";

export type GatewayClient = {
  evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision>;
};

/**
 * Live HTTP gateway only when explicitly opted in (`ZUNNO_GATEWAY=live`) and
 * `SWARAJ_DEV_TOKEN` is present. Default is the in-process EmbeddedGateway so
 * local play / unit tests stay offline-safe even if a token sits in `.env`.
 */
export function createGateway(config: ZunnoAgentConfig, env: NodeJS.ProcessEnv = process.env): GatewayClient {
  const mode = (env.ZUNNO_GATEWAY ?? "").toLowerCase();
  const token = env.SWARAJ_DEV_TOKEN?.trim();
  if (mode === "live" && token && token.length >= 32) {
    return new SwarajClient(config.swarajApiUrl, config.applicationId, token);
  }
  return new EmbeddedGateway();
}

/** Register the Zunno mandate fixture on a live API. Returns policyHash. */
export async function registerZunnoMandate(
  config: ZunnoAgentConfig,
  env: NodeJS.ProcessEnv = process.env,
): Promise<{ policyHash: string; mandateId: string } | undefined> {
  if ((env.ZUNNO_GATEWAY ?? "").toLowerCase() !== "live") return undefined;
  const token = env.SWARAJ_DEV_TOKEN?.trim();
  if (!token || token.length < 32) return undefined;

  const here = dirname(fileURLToPath(import.meta.url));
  const mandateJson = JSON.parse(
    readFileSync(join(here, "..", "..", "mandate", "zunno-mandate.json"), "utf8"),
  );
  const mandate = AgentMandateWireSchema.parse(mandateJson);
  const client = new SwarajClient(config.swarajApiUrl, config.applicationId, token);
  const registered = await client.registerMandate(mandate);
  return { policyHash: registered.policyHash, mandateId: registered.mandateId };
}
