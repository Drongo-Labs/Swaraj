import { test } from "node:test";
import assert from "node:assert/strict";
import { UnoEngine, buildDeck, cardLabel, type EngineState } from "../src/game/engine.js";
import { GameSession } from "../src/game/session.js";
import { localTable } from "../src/game/table.js";

const config = {
  swarajApiUrl: "http://localhost:3000",
  applicationId: "zunno",
  agentId: "zunno-agent",
  gameAddress: "0x82b2cce9a52c7e56838a5c46833067f9eb006911",
  buyInCapWei: "10000000000000000",
  signature: `0x${"00".repeat(65)}`,
};

function rigged(partial: Partial<EngineState>): UnoEngine {
  const base = UnoEngine.newState();
  return new UnoEngine({ ...base, ...partial });
}

test("engine: deck is a standard 108-card UNO deck", () => {
  const deck = buildDeck();
  assert.equal(deck.length, 108);
  assert.equal(new Set(deck).size, 108); // every card value unique
});

test("engine: legality, effects, and win detection", () => {
  const engine = rigged({
    hands: { human: [2, 8], agent: [11] }, // agent holds red 5
    discard: [26], // green 0 on top
    activeColor: 1, // green active
    turn: "human",
    winner: null,
    log: [],
  });
  // human hand: value 2 = red 1, value 8 = green... decode: 8 → id 7 → w=7 → number 4 red. Neither matches green 0.
  assert.deepEqual(engine.playableIndices("human"), []);
  assert.equal(engine.draw("human"), true); // draw allowed
  assert.equal(engine.state.turn, "agent");
  // agent plays red 5 — does not match green 0
  assert.deepEqual(engine.playableIndices("agent"), []);
  // now make it match: set active color to red
  engine.state.activeColor = 0;
  assert.deepEqual(engine.playableIndices("agent"), [0]);
  const error = engine.play("agent", 0);
  assert.equal(error, null);
  assert.equal(engine.state.winner, "agent"); // last card played
});

test("engine: draw-two makes the opponent draw and skips them", () => {
  const engine = rigged({
    hands: { human: [1], agent: [21] }, // 21 → red skip? decode(21): id 20 → w=20 → skip. use 24 → id 23 → w=23 → draw two
    discard: [24], // hmm — rig instead below
    activeColor: 0,
    turn: "agent",
    winner: null,
    log: [],
  });
  // Use a clean rig: top red 5, agent holds red +2 (value 24 → id 23, w=23 → DRAW_TWO red)
  const engine2 = rigged({
    hands: { human: [1], agent: [24, 2] }, // keep a card so the +2 does not end the game
    drawPile: [50, 51, 52, 53],
    discard: [11],
    activeColor: 0,
    turn: "agent",
    winner: null,
    log: [],
  });
  assert.equal(engine2.play("agent", 0), null);
  assert.equal(engine2.hand("human").length, 3); // drew 2
  assert.equal(engine2.state.turn, "agent"); // human skipped, agent goes again
  void engine;
});

test("governed play: a forbidden Wild+4 is blocked by the mandate and the agent draws instead", async () => {
  const engine = rigged({
    hands: { human: [1], agent: [105] }, // agent's only playable card is a Wild Draw Four
    drawPile: [50, 51, 52, 53],
    discard: [11], // red 5
    activeColor: 0,
    turn: "agent",
    winner: null,
    log: [],
  });
  const session = new GameSession(config, localTable(engine));
  assert.equal(cardLabel(105), "Wild+4");
  await session.agentTick();
  const blocked = engine.state.log.filter((entry) => entry.blocked);
  assert.equal(blocked.length, 1);
  assert.match(blocked[0]!.text, /play_card — BLOCKED by a_forbid_wild_draw_four/);
  assert.equal(engine.hand("agent").length, 2); // kept the Wild+4, drew one
  assert.equal(engine.state.turn, "human"); // turn passed
});

test("governed play: two forbidden cards in hand are each refused once, then the agent draws", async () => {
  const engine = rigged({
    hands: { human: [1], agent: [105, 106] }, // both playable, both forbidden
    drawPile: [50, 51, 52, 53],
    discard: [11],
    activeColor: 0,
    turn: "agent",
    winner: null,
    log: [],
  });
  const session = new GameSession(config, localTable(engine));
  await session.agentTick();
  assert.equal(engine.state.log.filter((entry) => entry.blocked).length, 2); // not an endless retry
  assert.equal(engine.hand("agent").length, 3); // kept both, drew one
  assert.equal(engine.state.turn, "human");
});

test("governed play: a hand full of forbidden cards still ends in one draw", async () => {
  const engine = rigged({
    hands: { human: [1], agent: [105, 106, 107, 108] },
    drawPile: [50, 51, 52, 53],
    discard: [11],
    activeColor: 0,
    turn: "agent",
    winner: null,
    log: [],
  });
  const session = new GameSession(config, localTable(engine));
  await session.agentTick();
  assert.equal(engine.state.log.filter((entry) => entry.blocked).length, 4);
  assert.equal(engine.hand("agent").length, 5);
  assert.equal(engine.state.turn, "human");
});

test("governed play: a legal non-wild card passes the mandate and plays", async () => {
  const engine = rigged({
    hands: { human: [1], agent: [11, 105] },
    drawPile: [50, 51],
    discard: [36], // green 5
    activeColor: 1, // green
    turn: "agent",
    winner: null,
    log: [],
  });
  const session = new GameSession(config, localTable(engine));
  await session.agentTick();
  const blocked = engine.state.log.filter((entry) => entry.blocked);
  assert.equal(blocked.length, 0); // first legal card (red 5 via number match) is permitted
  assert.equal(engine.state.discard.at(-1), 11);
  assert.equal(engine.state.turn, "human");
});

test("human moves flow through the engine; the human is never mandate-checked", async () => {
  const engine = rigged({
    hands: { human: [105], agent: [11] },
    drawPile: [50, 51],
    discard: [36],
    activeColor: 1,
    turn: "human",
    winner: null,
    log: [],
  });
  const session = new GameSession(config, localTable(engine));
  // human plays a Wild+4 — no gateway block, only game legality applies
  const error = engine.play("human", 0, 2);
  assert.equal(error, null);
  assert.equal(engine.state.discard.at(-1), 105);
  // the agent then takes its turn under the mandate
  await session.agentTick();
  assert.ok(engine.state.log.some((entry) => entry.seat !== "human"));
});
