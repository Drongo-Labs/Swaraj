/**
 * Generates vectors/engine-vectors.json from the REAL TypeScript engine
 * (src/zunno/cards.ts isPlayable + src/game/engine.ts play/draw), so the Lean
 * suite kernel-checks the same expectations the game itself computes.
 *
 * Run: pnpm vectors
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isPlayable } from "../src/zunno/cards.js";
import { UnoEngine, type EngineState } from "../src/game/engine.js";

const here = dirname(fileURLToPath(import.meta.url));

/** Curated codec coverage: numbers, skip, reverse, +2, wild, wild+4 across colors. */
const playableCases: Array<{ card: number; top: number; activeColor: number }> = [
  { card: 11, top: 5, activeColor: 0 },   // red 5 on red 2 — color match
  { card: 11, top: 36, activeColor: 1 },  // red 5 on green 5 — number match
  { card: 11, top: 26, activeColor: 1 },  // red 5 on green 0 — no match
  { card: 21, top: 5, activeColor: 0 },   // red skip on red — color match
  { card: 21, top: 71, activeColor: 2 },  // red skip on blue skip — kind match
  { card: 24, top: 24, activeColor: 3 },  // red +2 on red +2 — kind match
  { card: 101, top: 5, activeColor: 0 },  // wild — always playable
  { card: 105, top: 26, activeColor: 1 }, // wild+4 — always playable
  { card: 2, top: 76, activeColor: 2 },   // red 1 on yellow 1 — number match
  { card: 3, top: 27, activeColor: 1 },   // red 1 on green 1
];

interface PlayCase {
  name: string;
  human: boolean;
  card: number;
  chosenColor: number;
  state: {
    human: number[];
    agent: number[];
    drawPile: number[];
    /** TS discard is top-last; the Lean model reads the head — emit reversed. */
    discardReversed: number[];
    activeColor: number;
    humanTurn: boolean;
    winner: 0 | 1 | 2;
  };
  applied: boolean;
  winner: 0 | 1 | 2;
  humanTurn: boolean;
  top: number;
}

function rig(partial: Partial<EngineState>): UnoEngine {
  const base = UnoEngine.newState();
  return new UnoEngine({ ...base, ...partial });
}

const winnerCode = (s: EngineState): 0 | 1 | 2 =>
  s.winner === null ? 0 : s.winner === "human" ? 1 : 2;

function playCase(name: string, state: Partial<EngineState>, human: boolean, card: number, chosenColor: number): PlayCase {
  // rig() shares the partial's arrays with the engine, and play() splices them —
  // deep-clone so the recorded state stays the PRE-play state.
  const pre = structuredClone(state);
  const engine = rig(structuredClone(state));
  const hand = human ? engine.state.hands.human : engine.state.hands.agent;
  const handIndex = hand.indexOf(card);
  const error = handIndex >= 0 ? engine.play(human ? "human" : "agent", handIndex, chosenColor) : "no such card";
  return {
    name,
    human,
    card,
    chosenColor,
    state: {
      human: pre.hands!.human,
      agent: pre.hands!.agent,
      drawPile: pre.drawPile!,
      discardReversed: [...(pre.discard ?? [])].reverse(),
      activeColor: pre.activeColor ?? 0,
      humanTurn: pre.turn === "human",
      winner: 0,
    },
    applied: error === null,
    winner: winnerCode(engine.state),
    humanTurn: engine.state.turn === "human",
    top: engine.topValue,
  };
}

const drawPile = [50, 51, 52, 53, 54, 55, 56, 57];

const plays: PlayCase[] = [
  playCase("red5_number_match",
    { hands: { human: [11, 2], agent: [3] }, drawPile, discard: [36], activeColor: 1, turn: "human", winner: null, log: [] },
    true, 11, 4),
  playCase("skip_keeps_turn",
    { hands: { human: [21, 2], agent: [3] }, drawPile, discard: [11], activeColor: 0, turn: "human", winner: null, log: [] },
    true, 21, 4),
  playCase("draw_two_penalizes",
    { hands: { human: [24, 2], agent: [3] }, drawPile, discard: [11], activeColor: 0, turn: "human", winner: null, log: [] },
    true, 24, 4),
  playCase("wild_chooses_color",
    { hands: { human: [101, 2], agent: [3] }, drawPile, discard: [11], activeColor: 0, turn: "human", winner: null, log: [] },
    true, 101, 2),
  playCase("wild4_penalizes_four",
    { hands: { human: [105, 2], agent: [3] }, drawPile, discard: [11], activeColor: 0, turn: "human", winner: null, log: [] },
    true, 105, 3),
  playCase("last_card_wins",
    { hands: { human: [11], agent: [3] }, drawPile, discard: [36], activeColor: 1, turn: "human", winner: null, log: [] },
    true, 11, 4),
  playCase("illegal_play_rejected",
    { hands: { human: [11], agent: [3] }, drawPile, discard: [26], activeColor: 1, turn: "human", winner: null, log: [] },
    true, 11, 4),
  playCase("not_your_turn_rejected",
    { hands: { human: [11], agent: [3] }, drawPile, discard: [36], activeColor: 1, turn: "agent", winner: null, log: [] },
    true, 11, 4),
  playCase("agent_plays_number",
    { hands: { human: [3], agent: [11, 2] }, drawPile, discard: [36], activeColor: 1, turn: "agent", winner: null, log: [] },
    false, 11, 4),
];

interface DrawCase {
  name: string;
  human: boolean;
  state: PlayCase["state"];
  applied: boolean;
  winner: 0 | 1 | 2;
  humanTurn: boolean;
  top: number;
}

function drawCase(name: string, state: Partial<EngineState>, human: boolean): DrawCase {
  const pre = structuredClone(state);
  const engine = rig(structuredClone(state));
  const ok = engine.draw(human ? "human" : "agent");
  return {
    name,
    human,
    state: {
      human: pre.hands!.human,
      agent: pre.hands!.agent,
      drawPile: pre.drawPile!,
      discardReversed: [...(pre.discard ?? [])].reverse(),
      activeColor: pre.activeColor ?? 0,
      humanTurn: pre.turn === "human",
      winner: 0,
    },
    applied: ok,
    winner: winnerCode(engine.state),
    humanTurn: engine.state.turn === "human",
    top: engine.topValue,
  };
}

const draws: DrawCase[] = [
  drawCase("human_draws",
    { hands: { human: [11], agent: [3] }, drawPile, discard: [36], activeColor: 1, turn: "human", winner: null, log: [] },
    true),
  drawCase("agent_draws",
    { hands: { human: [11], agent: [3] }, drawPile, discard: [36], activeColor: 1, turn: "agent", winner: null, log: [] },
    false),
  drawCase("draw_wrong_turn",
    { hands: { human: [11], agent: [3] }, drawPile, discard: [36], activeColor: 1, turn: "agent", winner: null, log: [] },
    true),
];

/**
 * Exhaustive refinement block: every (mover, hand, top, activeColor) state
 * in the bounded domain — every card in the hand played (plus a draw),
 * each outcome computed by the REAL engine. The Lean suite kernel-checks
 * the model against every one of these.
 */
const CARD_POOL = [2, 11, 21, 24, 26, 36, 101, 105]; // numbers, skip, +2, two colors, wild, wild+4
const COLOR_POOL = [0, 1];
const DRAW_PILE_X = [50, 51, 52, 53, 54, 55, 56, 57];

const hands: number[][] = [];
for (const c of CARD_POOL) hands.push([c]);
for (const a of CARD_POOL) for (const b of CARD_POOL) if (a !== b) hands.push([a, b]);

interface ExhaustiveCase {
  human: boolean;
  hand: number[];
  top: number;
  activeColor: number;
  /** one entry per card in hand, then the draw: [applied, winnerCode, humanTurn, top] or null */
  expected: Array<[boolean, 0 | 1 | 2, boolean, number] | null>;
}

const exhaustive: ExhaustiveCase[] = [];
for (const moverHuman of [true, false]) {
  for (const hand of hands) {
    for (const top of CARD_POOL) {
      for (const activeColor of COLOR_POOL) {
        const expected: ExhaustiveCase["expected"] = [];
        for (const [handIndex, card] of hand.entries()) {
          const state: Partial<EngineState> = {
            hands: moverHuman ? { human: [...hand], agent: [3] } : { human: [3], agent: [...hand] },
            drawPile: DRAW_PILE_X,
            discard: [top],
            activeColor,
            turn: moverHuman ? "human" : "agent",
            winner: null,
            log: [],
          };
          const engine = rig(structuredClone(state));
          const error = engine.play(moverHuman ? "human" : "agent", handIndex, 4);
          expected.push(error === null
            ? [true, winnerCode(engine.state), engine.state.turn === "human", engine.topValue]
            : null);
        }
        // the draw
        const state: Partial<EngineState> = {
          hands: moverHuman ? { human: [...hand], agent: [3] } : { human: [3], agent: [...hand] },
          drawPile: DRAW_PILE_X,
          discard: [top],
          activeColor,
          turn: moverHuman ? "human" : "agent",
          winner: null,
          log: [],
        };
        const engine = rig(structuredClone(state));
        const ok = engine.draw(moverHuman ? "human" : "agent");
        expected.push(ok
          ? [true, winnerCode(engine.state), engine.state.turn === "human", engine.topValue]
          : null);
        exhaustive.push({ human: moverHuman, hand, top, activeColor, expected });
      }
    }
  }
}

const file = {
  domain: "zunno/engine-vectors/v1",
  playable: playableCases.map((c) => ({ ...c, expected: isPlayable(c.card, c.top, c.activeColor) })),
  plays,
  draws,
  exhaustive,
};

mkdirSync(join(here, "..", "vectors"), { recursive: true });
writeFileSync(join(here, "..", "vectors", "engine-vectors.json"), JSON.stringify(file, null, 2) + "\n");
console.log(`vectors/engine-vectors.json: ${file.playable.length} playable, ${file.plays.length} plays, ${file.draws.length} draws, ${file.exhaustive.length} exhaustive states (${file.exhaustive.reduce((n, e) => n + e.expected.length, 0)} outcomes)`);
