import { test } from "node:test";
import assert from "node:assert/strict";
import { UnoEngine, type EngineState } from "../src/game/engine.js";
import { startServer } from "../src/server/http.js";
import { remoteTable } from "../src/game/table.js";
import { GameSession } from "../src/game/session.js";
import { checkEnclave } from "../src/agent/run.js";
import { attest, checkAttestation, reportData } from "../src/enclave/attestation.js";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const token = "agent-token-at-least-32-characters-long";
const config = {
  swarajApiUrl: "http://localhost:3000",
  applicationId: "zunno",
  agentId: "zunno-agent",
  gameAddress: "0x82b2cce9a52c7e56838a5c46833067f9eb006911",
  buyInCapWei: "10000000000000000",
  signature: `0x${"00".repeat(65)}`,
};

// Distinct hands so a leak would be visible: the human holds blue cards, the agent red and a Wild+4.
const rigged = (partial: Partial<EngineState> = {}) => () =>
  new UnoEngine({
    ...UnoEngine.newState(),
    hands: { human: [52, 53, 54], agent: [11, 105] },
    drawPile: [60, 61, 62, 63],
    discard: [36],
    activeColor: 1,
    turn: "agent",
    winner: null,
    log: [],
    ...partial,
  });

async function withEnclave(run: (url: URL) => Promise<void>, partial?: Partial<EngineState>) {
  const enclave = await startServer({ port: 0, agentToken: token, newEngine: rigged(partial) });
  try {
    await run(enclave.url);
  } finally {
    await enclave.close();
  }
}

test("the agent's seat never shows the human's hand", () =>
  withEnclave(async (url) => {
    const view = await remoteTable(url, token).view();
    assert.deepEqual(view.hand, [11, 105]);
    for (const card of [52, 53, 54]) assert.ok(!JSON.stringify(view).includes(String(card)), `leaked ${card}`);
  }));

test("the human's page never shows the agent's hand", () =>
  withEnclave(async (url) => {
    const state = await (await fetch(new URL("/api/state", url))).json();
    assert.deepEqual(state.yourHand.map((card: { value: number }) => card.value), [52, 53, 54]);
    assert.equal(state.opponentCount, 2);
    assert.ok(!JSON.stringify(state.yourHand).includes("105"));
  }));

test("the agent's seat needs its token", () =>
  withEnclave(async (url) => {
    for (const authorization of [undefined, "Bearer wrong-token-of-the-same-length-xx"]) {
      const response = await fetch(new URL("/agent/view", url), authorization ? { headers: { authorization } } : {});
      assert.equal(response.status, 401);
    }
    await assert.rejects(remoteTable(url, "x".repeat(40)).view(), /401/);
  }));

test("a governed agent plays through the enclave, and its block reaches the log", () =>
  withEnclave(async (url) => {
    // The only playable card is the forbidden Wild+4, so the mandate blocks it and the agent draws.
    await new GameSession(config, remoteTable(url, token)).agentTick();
    const state = await (await fetch(new URL("/api/state", url))).json();
    assert.ok(state.log.some((entry: { blocked?: boolean; text: string }) => entry.blocked && /BLOCKED by a_forbid_wild_draw_four/.test(entry.text)));
    assert.equal(state.turn, "human");
    assert.equal(state.opponentCount, 2); // kept the Wild+4, drew one
  }, { hands: { human: [52, 53, 54], agent: [105] }, discard: [11], activeColor: 0 }));

test("outside a TEE the engine says so, and a client that requires one refuses to play", () =>
  withEnclave(async (url) => {
    const answer = await checkEnclave(url, false);
    assert.equal(answer.tee, "none");
    assert.match(answer.codeHash, /^[0-9a-f]{64}$/);
    await assert.rejects(checkEnclave(url, true), /not running in a TEE/);
  }));

test("an attestation for another nonce is rejected, and report data binds nonce and code", () => {
  const nonce = "aa".repeat(32);
  const code = "bb".repeat(32);
  assert.match(checkAttestation({ tee: "tdx", nonce: "cc".repeat(32), codeHash: code, quote: "q" }, nonce, true) ?? "", /nonce/);
  assert.equal(checkAttestation({ tee: "tdx", nonce, codeHash: code, quote: "q" }, nonce, true), null);
  assert.equal(reportData(nonce, code).length, 64);
});

test("the enclave refuses a short agent token", () => {
  assert.throws(() => startServer({ port: 0, agentToken: "short" }), /32 characters/);
});

test("a host with a report directory but no TDX quote says no TEE instead of failing", () => {
  // Like a CI runner: configfs-tsm exists, but nothing produces a quote.
  const reports = mkdtempSync(join(tmpdir(), "tsm-"));
  const answer = attest("aa".repeat(32), "bb".repeat(32), reports);
  assert.deepEqual(answer, { tee: "none", nonce: "aa".repeat(32), codeHash: "bb".repeat(32) });
});
