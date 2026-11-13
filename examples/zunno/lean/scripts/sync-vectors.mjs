#!/usr/bin/env node
/**
 * Generates lean/Zunno/Vectors.lean from vectors/engine-vectors.json, so the
 * Lean suite kernel-checks the same expectations the TypeScript engine
 * computed. Mirrors swaraj-new's packages/lean sync-vectors pattern.
 *
 * Run: node lean/scripts/sync-vectors.mjs   (or: pnpm lean:sync)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const vectorsPath = join(here, "..", "..", "vectors", "engine-vectors.json");
const outPath = join(here, "..", "Zunno", "Vectors.lean");

const file = JSON.parse(readFileSync(vectorsPath, "utf-8"));
if (file.domain !== "zunno/engine-vectors/v1") {
  throw new Error(`unexpected vector domain: ${file.domain}`);
}

const natList = (xs) => `[${xs.map(String).join(", ")}]`;
const boolLit = (b) => (b ? "true" : "false");

function stateDef(name, s) {
  return `def ${name} : Zunno.GameState :=
  { human := ${natList(s.human)}, agent := ${natList(s.agent)}, drawPile := ${natList(s.drawPile)}, discard := ${natList(s.discardReversed)}, activeColor := ${s.activeColor}, humanTurn := ${boolLit(s.humanTurn)}, winner := ${s.winner === 1 ? "some true" : s.winner === 2 ? "some false" : "none"} }`;
}

const parts = [];
parts.push(`/-
Shared engine vectors — GENERATED FILE, do not edit by hand.

Source: vectors/engine-vectors.json (produced by the REAL TypeScript engine,
scripts/gen-vectors.ts). Regenerate: pnpm vectors && pnpm lean:sync

Each example is kernel-checked: the Lean model must reproduce the exact
outcome the TypeScript engine computed — same UNO card codec (1..108),
same legality, same effects, same winner.
-/

import Zunno.Engine
import Zunno.Bridge

namespace Zunno
`);

for (const [i, c] of file.playable.entries()) {
  parts.push(`example : Zunno.isPlayable ${c.card} ${c.top} ${c.activeColor} = ${boolLit(c.expected)} := by rfl -- #${i} card=${c.card} top=${c.top} color=${c.activeColor}`);
}

for (const [i, p] of file.plays.entries()) {
  const stateName = `vec_play_state_${i}`;
  parts.push(stateDef(stateName, p.state));
  const target = p.applied
    ? `(Zunno.playCard ${stateName} ${boolLit(p.human)} ${p.card} ${p.chosenColor}).map Zunno.summarize = some (${p.winner}, ${boolLit(p.humanTurn)}, ${p.top})`
    : `(Zunno.playCard ${stateName} ${boolLit(p.human)} ${p.card} ${p.chosenColor}) = none`;
  parts.push(`example : ${target} := by rfl -- ${p.name}`);
}

for (const [i, d] of file.draws.entries()) {
  const stateName = `vec_draw_state_${i}`;
  parts.push(stateDef(stateName, d.state));
  const target = d.applied
    ? `(Zunno.drawCard ${stateName} ${boolLit(d.human)}).map Zunno.summarize = some (${d.winner}, ${boolLit(d.humanTurn)}, ${d.top})`
    : `(Zunno.drawCard ${stateName} ${boolLit(d.human)}) = none`;
  parts.push(`example : ${target} := by rfl -- ${d.name}`);
}

parts.push("end Zunno");

writeFileSync(outPath, parts.join("\n\n") + "\n");
console.log(`lean/Zunno/Vectors.lean: ${file.playable.length} playable, ${file.plays.length} plays, ${file.draws.length} draws`);

/**
 * Exhaustive engine refinement: lean/Zunno/EngineRefinement.lean — one
 * kernel-checked example per bounded-domain state, evaluating every mover
 * option (each card + draw) and asserting equality with the outcomes the
 * REAL TypeScript engine computed. Any TS<->Lean divergence in the space
 * breaks the build.
 */
const exhaustivePath = join(here, "..", "Zunno", "EngineRefinement.lean");
const xStateDef = (name, s) =>
  `def ${name} : Zunno.GameState :=\n  { human := ${natList(s.human)}, agent := ${natList(s.agent)}, drawPile := ${natList(s.drawPile)}, discard := ${natList(s.discard)}, activeColor := ${s.activeColor}, humanTurn := ${boolLit(s.humanTurn)}, winner := none }`;

const outcome = (entry) =>
  entry === null ? "none" : `some (${entry[1]}, ${boolLit(entry[2])}, ${entry[3]})`;

const exParts = [];
exParts.push(`/-
Exhaustive engine refinement — GENERATED FILE, do not edit by hand.

Source: vectors/engine-vectors.json (exhaustive block, computed by the REAL
TypeScript engine). Regenerate: pnpm vectors && pnpm lean:sync

One kernel-checked example per bounded-domain state (${file.exhaustive.length} states,
${file.exhaustive.reduce((n, e) => n + e.expected.length, 0)} outcomes): every mover option — each
card in hand, then a draw — must produce exactly the outcome the TypeScript
engine produced. This is the machine-checked Lean <=> TS correspondence for
the game engine over the entire bounded space.
-/`);

exParts.push(`import Zunno.Engine\n\nnamespace Zunno`);

for (const [i, c] of file.exhaustive.entries()) {
  const name = `vec_x_${i}`;
  const s = {
    human: c.human ? c.hand : [3],
    agent: c.human ? [3] : c.hand,
    drawPile: [50, 51, 52, 53, 54, 55, 56, 57],
    discard: [c.top],
    activeColor: c.activeColor,
    humanTurn: c.human,
  };
  exParts.push(`${xStateDef(name, s)}

example : Zunno.playOutcomes ${name} ${boolLit(c.human)} = [${c.expected.map(outcome).join(", ")}] := by rfl`);
}

exParts.push("end Zunno");
writeFileSync(exhaustivePath, exParts.join("\n\n") + "\n");
console.log(`lean/Zunno/EngineRefinement.lean: ${file.exhaustive.length} states, ${file.exhaustive.reduce((n, e) => n + e.expected.length, 0)} kernel-checked outcomes`);
