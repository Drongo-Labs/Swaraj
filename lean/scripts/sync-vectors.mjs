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
outcome the TypeScript engine computed — same card codec (ZunnoInco.sol),
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
