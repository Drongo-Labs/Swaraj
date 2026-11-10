import { createHash, randomBytes } from "node:crypto";
import { js_get_collateral, js_verify } from "@phala/dcap-qvl-node";
import { recoverMessageAddress } from "viem";
import type { AgentView } from "../game/table.js";
import type { ZunnoProposal } from "../actions/intents.js";
import { isPlayable } from "../zunno/cards.js";
import { cardLabel, COLORS } from "../game/engine.js";

/**
 * The agent's moves from NEAR AI Cloud private inference. Before any prompt is
 * sent, the model's attestation is checked the way NEAR's own verifier does
 * (github.com/nearai/nearai-cloud-verifier): the Intel TDX quote verifies,
 * its report data binds the model's signing key and our nonce, and the GPU
 * evidence carries the same nonce and passes NVIDIA's verifier. Each reply
 * must then be signed by an attested key over the exact request and response.
 * A pick is only a proposal: it must be a legal card, and it still goes
 * through the mandate gateway.
 */

export interface NearAiConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  /** Sent as `reasoning_effort` when set. Reasoning models otherwise think past the token limit. */
  reasoningEffort?: string;
  /** Longest a move may wait for the model before the built-in pick is used. */
  timeoutMs?: number;
}

// A fast attested model. With reasoning off it answers in about half a second; the
// earlier DeepSeek default spent every token reasoning and never answered.
export const DEFAULT_MODEL = "Qwen/Qwen3.6-35B-A3B-FP8";
const PCCS_URL = "https://api.trustedservices.intel.com/tdx/certification/v4";
const NRAS_URL = "https://nras.attestation.nvidia.com/v3/attest/gpu";

export function nearAiConfigFromEnv(env: NodeJS.ProcessEnv = process.env): NearAiConfig | undefined {
  // Prefer NEAR_AI_API_KEY; accept NEAR_API_KEY as the common alias in root .env.
  const apiKey = env.NEAR_AI_API_KEY?.trim() || env.NEAR_API_KEY?.trim();
  if (!apiKey) return undefined;
  return {
    apiKey,
    model: env.NEAR_AI_MODEL?.trim() || DEFAULT_MODEL,
    baseUrl: env.NEAR_AI_BASE_URL?.trim() || "https://cloud-api.near.ai",
    // NEAR_AI_REASONING= (empty) sends no reasoning_effort, for models that reject it.
    ...(env.NEAR_AI_REASONING === "" ? {} : { reasoningEffort: env.NEAR_AI_REASONING?.trim() || "none" }),
    timeoutMs: Number(env.NEAR_AI_TIMEOUT_MS) || 10_000,
  };
}

export interface Deps {
  fetchImpl: typeof fetch;
  /** Verifies an Intel TDX quote; returns its status and report data (hex). */
  verifyQuote: (quoteHex: string) => Promise<{ status: string; reportData: string }>;
}

export async function verifyTdxQuote(quoteHex: string): Promise<{ status: string; reportData: string }> {
  const raw = Buffer.from(quoteHex, "hex");
  const collateral = await js_get_collateral(PCCS_URL, raw);
  const result = js_verify(raw, collateral, BigInt(Math.floor(Date.now() / 1000)));
  return { status: String(result?.status ?? ""), reportData: String(result?.report?.TD10?.report_data ?? "") };
}

const defaultDeps: Deps = { fetchImpl: fetch, verifyQuote: verifyTdxQuote };
const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

interface ModelAttestation {
  signing_address: string;
  intel_quote: string;
  nvidia_payload?: string;
}

/** Report data = signing address right-padded to 32 bytes, then the raw 32-byte nonce. */
export function reportDataBinds(reportDataHex: string, signingAddress: string, nonce: string): boolean {
  const data = Buffer.from(reportDataHex.replace(/^0x/i, ""), "hex");
  const address = Buffer.from(signingAddress.replace(/^0x/i, ""), "hex");
  if (data.length < 64 || address.length > 32) return false;
  const padded = Buffer.concat([address, Buffer.alloc(32 - address.length)]);
  return data.subarray(0, 32).equals(padded) && data.subarray(32, 64).equals(Buffer.from(nonce, "hex"));
}

/** Returns the model's attested signing addresses (lowercase). Throws if any check fails. */
export async function verifyNearAi(config: NearAiConfig, deps: Deps = defaultDeps): Promise<Set<string>> {
  const nonce = randomBytes(32).toString("hex");
  const url = `${config.baseUrl}/v1/attestation/report?model=${encodeURIComponent(config.model)}&nonce=${nonce}&signing_algo=ecdsa`;
  const response = await deps.fetchImpl(url, { headers: { authorization: `Bearer ${config.apiKey}` } });
  if (!response.ok) throw new Error(`attestation request failed: ${response.status}`);
  const report = (await response.json()) as { model_attestations?: ModelAttestation[] };
  const attestations = report.model_attestations ?? [];
  if (attestations.length === 0) throw new Error("no model attestation");

  const attested = new Set<string>();
  for (const attestation of attestations) {
    const quote = await deps.verifyQuote(attestation.intel_quote);
    // OutOfDate means the platform is behind Intel's latest advisories, not a broken quote; NEAR's verifier accepts it too.
    if (quote.status !== "UpToDate" && quote.status !== "OutOfDate") throw new Error(`TDX quote status ${quote.status}`);
    if (!reportDataBinds(quote.reportData, attestation.signing_address, nonce)) {
      throw new Error("TDX report data does not bind the signing key and nonce");
    }
    if (!attestation.nvidia_payload) throw new Error("no GPU evidence");
    const gpu = JSON.parse(attestation.nvidia_payload) as { nonce?: string };
    if (gpu.nonce?.toLowerCase() !== nonce) throw new Error("GPU evidence does not carry the nonce");
    const nras = await deps.fetchImpl(NRAS_URL, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: attestation.nvidia_payload,
    });
    if (!nras.ok) throw new Error(`NVIDIA verifier: ${nras.status}`);
    const jwt = ((await nras.json()) as [string, string][])[0]?.[1] ?? "";
    const claims = JSON.parse(Buffer.from(jwt.split(".")[1] ?? "", "base64url").toString("utf8")) as Record<string, unknown>;
    if (claims["x-nvidia-overall-att-result"] !== true) throw new Error("NVIDIA verifier did not pass the GPU");
    attested.add(attestation.signing_address.toLowerCase());
  }
  return attested;
}

export function movePrompt(view: AgentView): string {
  const cards = view.hand.map((card, index) => `${index}: ${cardLabel(card)}`).join(", ");
  return [
    "You are playing two-player UNO. Pick your move.",
    `Top card: ${cardLabel(view.topValue)}. Active colour: ${COLORS[view.activeColor] ?? "?"}.`,
    `Your hand: ${cards}.`,
    "Reply with only the number of the card to play, or the word draw.",
  ].join("\n");
}

/** Checks the reply was signed by an attested key over the exact bytes sent and received. */
export async function replyIsSigned(
  config: NearAiConfig,
  attested: Set<string>,
  chatId: string,
  requestBody: string,
  responseText: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const url = `${config.baseUrl}/v1/signature/${encodeURIComponent(chatId)}?model=${encodeURIComponent(config.model)}&signing_algo=ecdsa`;
  const response = await fetchImpl(url, { headers: { authorization: `Bearer ${config.apiKey}` } });
  if (!response.ok) return false;
  const signed = (await response.json()) as { text: string; signature: string; signing_address: string };
  const parts = signed.text.split(":");
  const [requestHash, responseHash] = parts.length === 3 ? parts.slice(1) : parts;
  if (requestHash !== sha256(requestBody) || responseHash !== sha256(responseText)) return false;
  const signer = await recoverMessageAddress({ message: signed.text, signature: signed.signature as `0x${string}` });
  return signer.toLowerCase() === signed.signing_address.toLowerCase() && attested.has(signer.toLowerCase());
}

/** Asks the model for a move. Undefined means use the built-in pick. */
export async function nearAiMove(
  config: NearAiConfig,
  attested: Set<string>,
  view: AgentView,
  fetchImpl: typeof fetch = fetch,
): Promise<ZunnoProposal | undefined> {
  const requestBody = JSON.stringify({
    model: config.model,
    messages: [{ role: "user", content: movePrompt(view) }],
    stream: false,
    temperature: 0,
    max_tokens: 1024,
    ...(config.reasoningEffort ? { reasoning_effort: config.reasoningEffort } : {}),
  });
  const response = await fetchImpl(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.apiKey}`, "content-type": "application/json" },
    body: requestBody,
    ...(config.timeoutMs ? { signal: AbortSignal.timeout(config.timeoutMs) } : {}),
  });
  if (!response.ok) return undefined;
  const responseText = await response.text();
  const reply = JSON.parse(responseText) as { id?: string; choices?: { message?: { content?: string } }[] };
  if (!reply.id || !(await replyIsSigned(config, attested, reply.id, requestBody, responseText, fetchImpl))) return undefined;

  const content = (reply.choices?.[0]?.message?.content ?? "").trim().toLowerCase();
  if (/^draw\b/.test(content)) return { kind: "DRAW_CARD" };
  const index = Number(/\d+/.exec(content)?.[0]);
  const card = view.hand[index];
  // Only a legal card counts; anything else falls back to the built-in pick.
  if (card === undefined || !isPlayable(card, view.topValue, view.activeColor)) return undefined;
  return { kind: "PLAY_CARD", handIndex: index, cardValue: card, chosenColor: 4 };
}
