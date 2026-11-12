import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { privateKeyToAccount } from "viem/accounts";
import { nearAiConfigFromEnv, nearAiMove, replyIsSigned, reportDataBinds, verifyNearAi, type Deps } from "../src/agent/nearai.js";

test("nearAiConfigFromEnv accepts NEAR_AI_API_KEY and NEAR_API_KEY alias", () => {
  assert.equal(nearAiConfigFromEnv({}), undefined);
  assert.equal(nearAiConfigFromEnv({ NEAR_API_KEY: "sk-from-alias" })?.apiKey, "sk-from-alias");
  assert.equal(
    nearAiConfigFromEnv({ NEAR_AI_API_KEY: "sk-preferred", NEAR_API_KEY: "sk-alias" })?.apiKey,
    "sk-preferred",
  );
});

const config = { apiKey: "test", model: "test/model", baseUrl: "https://nearai.test" };
const signer = privateKeyToAccount(`0x${"11".repeat(32)}`);
const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const jwt = (claims: object) => `x.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.y`;
const reportData = (address: string, nonce: string) =>
  Buffer.concat([Buffer.from(address.slice(2), "hex"), Buffer.alloc(12), Buffer.from(nonce, "hex")]).toString("hex");

type Fault = "quote" | "binding" | "gpu-nonce" | "nvidia" | "none";

/** A fake NEAR AI Cloud and NVIDIA verifier; `fault` breaks one check. */
function attestationDeps(fault: Fault): Deps {
  let nonce = "";
  return {
    fetchImpl: (async (input: string | URL) => {
      const url = String(input);
      if (url.includes("/v1/attestation/report")) {
        nonce = new URL(url).searchParams.get("nonce")!;
        const gpuNonce = fault === "gpu-nonce" ? "00".repeat(32) : nonce;
        return json({ model_attestations: [{ signing_address: signer.address, intel_quote: "ab", nvidia_payload: JSON.stringify({ nonce: gpuNonce }) }] });
      }
      if (url.includes("nras.attestation.nvidia.com")) {
        return json([["JWT", jwt({ "x-nvidia-overall-att-result": fault !== "nvidia" })]]);
      }
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch,
    verifyQuote: async () => ({
      status: fault === "quote" ? "Revoked" : "UpToDate",
      reportData: reportData(fault === "binding" ? `0x${"22".repeat(20)}` : signer.address, nonce),
    }),
  };
}

test("an attestation that passes every check yields the attested signer", async () => {
  assert.deepEqual([...(await verifyNearAi(config, attestationDeps("none")))], [signer.address.toLowerCase()]);
});

test("each failed attestation check stops the agent from using the model", async () => {
  const expected: Record<Exclude<Fault, "none">, RegExp> = {
    quote: /TDX quote status Revoked/,
    binding: /does not bind/,
    "gpu-nonce": /GPU evidence does not carry the nonce/,
    nvidia: /did not pass the GPU/,
  };
  for (const [fault, message] of Object.entries(expected)) {
    await assert.rejects(verifyNearAi(config, attestationDeps(fault as Fault)), message, fault);
  }
});

test("report data must hold the padded signing address, then the nonce", () => {
  const nonce = "ab".repeat(32);
  assert.ok(reportDataBinds(reportData(signer.address, nonce), signer.address, nonce));
  assert.ok(!reportDataBinds(reportData(signer.address, nonce), signer.address, "cd".repeat(32)));
});

/** A fake chat endpoint whose reply is signed by `by` over the exact request and response. */
async function chatFetch(content: string, by = signer, tamper = false): Promise<typeof fetch> {
  let signed: { text: string; signature: string; signing_address: string } | undefined;
  return (async (input: string | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith("/v1/chat/completions")) {
      const responseText = JSON.stringify({ id: "chat-1", choices: [{ message: { content } }] });
      const text = `test/model:${sha256(String(init?.body))}:${sha256(tamper ? `${responseText} ` : responseText)}`;
      signed = { text, signature: await by.signMessage({ message: text }), signing_address: by.address };
      return new Response(responseText);
    }
    if (url.includes("/v1/signature/chat-1")) return json(signed);
    throw new Error(`unexpected ${url}`);
  }) as typeof fetch;
}

const attested = new Set([signer.address.toLowerCase()]);
// Top card red 6 (13); the hand holds red 5 (legal), green 5 (illegal) and a Wild+4.
const view = { hand: [11, 36, 105], topValue: 13, activeColor: 0, turn: "agent" as const, winner: null };

test("a signed reply naming a legal card becomes the agent's proposal", async () => {
  assert.deepEqual(await nearAiMove(config, attested, view, await chatFetch("0")), {
    kind: "PLAY_CARD", handIndex: 0, cardValue: 11, chosenColor: 4,
  });
  assert.deepEqual(await nearAiMove(config, attested, view, await chatFetch("draw")), { kind: "DRAW_CARD" });
});

test("an illegal card, an unattested signer or a changed reply falls back", async () => {
  assert.equal(await nearAiMove(config, attested, view, await chatFetch("1")), undefined);
  const stranger = privateKeyToAccount(`0x${"33".repeat(32)}`);
  assert.equal(await nearAiMove(config, attested, view, await chatFetch("0", stranger)), undefined);
  assert.equal(await nearAiMove(config, attested, view, await chatFetch("0", signer, true)), undefined);
});

test("the signature check recovers the attested signer over the exact bytes", async () => {
  const fetchImpl = await chatFetch("0");
  const body = "{}";
  const response = await fetchImpl("https://nearai.test/v1/chat/completions", { method: "POST", body });
  const text = await response.text();
  assert.ok(await replyIsSigned(config, attested, "chat-1", body, text, fetchImpl));
  assert.ok(!(await replyIsSigned(config, attested, "chat-1", "{ }", text, fetchImpl)));
});

test("a model slower than the time limit gives up, so the built-in pick is used", async () => {
  const hanging = ((_input: string | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
    })) as typeof fetch;
  // AbortSignal.timeout does not keep the process alive, so on Node 22 the event loop
  // empties before it fires and the runner cancels the test. A plain timer holds it open.
  const keepAlive = setTimeout(() => {}, 5_000);
  try {
    await assert.rejects(nearAiMove({ ...config, timeoutMs: 20 }, attested, view, hanging));
  } finally {
    clearTimeout(keepAlive);
  }
});

test("reasoning is off by default, and the request asks for it that way", async () => {
  const { nearAiConfigFromEnv, DEFAULT_MODEL } = await import("../src/agent/nearai.js");
  assert.deepEqual(nearAiConfigFromEnv({ NEAR_AI_API_KEY: "k" }), {
    apiKey: "k", model: DEFAULT_MODEL, baseUrl: "https://cloud-api.near.ai", reasoningEffort: "none", timeoutMs: 10_000,
  });
  assert.equal(nearAiConfigFromEnv({ NEAR_AI_API_KEY: "k", NEAR_AI_REASONING: "" })?.reasoningEffort, undefined);
  let sent = "";
  const capture = (async (input: string | URL, init?: RequestInit) => {
    sent = String(init?.body);
    throw new Error("stop");
  }) as typeof fetch;
  await assert.rejects(nearAiMove({ ...config, reasoningEffort: "none" }, attested, view, capture), /stop/);
  assert.equal(JSON.parse(sent).reasoning_effort, "none");
});
