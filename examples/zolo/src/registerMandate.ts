import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SwarajClient } from "./swaraj/client.js";
import type { AgentMandateWire } from "./swaraj/mandateSchema.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mandatePath = path.join(root, "mandate", "zolo-mandate.json");

const baseUrl = process.env.SWARAJ_API_URL ?? "http://localhost:3000";
const applicationId = process.env.SWARAJ_APPLICATION_ID ?? "zolo";
const token = process.env.SWARAJ_DEV_TOKEN;
if (!token || token.length < 32) {
  throw new Error("SWARAJ_DEV_TOKEN (≥32 chars) is required");
}

const mandate = JSON.parse(await readFile(mandatePath, "utf8")) as AgentMandateWire;
const client = new SwarajClient(baseUrl, applicationId, token);
const result = await client.registerMandate(mandate);
console.log(JSON.stringify(result, null, 2));
