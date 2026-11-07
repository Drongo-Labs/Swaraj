#!/usr/bin/env node
/** Generates Gate/Refinement.lean from those outcomes. Run: node scripts/sync-refinement.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const vectorsPath = join(here, "..", "..", "..", "proofs", "vectors", "mandate-refinement.json");
const outPath = join(here, "..", "Gate", "Refinement.lean");

const file = JSON.parse(readFileSync(vectorsPath, "utf-8"));
if (file.domain !== "swaraj/mandate-refinement-vectors/v1") {
  throw new Error(`unexpected domain: ${file.domain}`);
}

const str = (s) => `"${String(s).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
const effect = (e) => (e === "PERMIT" ? "Gate.MandateEffect.permit" : "Gate.MandateEffect.forbid");

function pred(p) {
  switch (p.k) {
    case "appEq": return `Gate.CPred.appEq ${str(p.v)}`;
    case "nameEq": return `Gate.CPred.nameEq ${str(p.v)}`;
    case "nameIn": return `Gate.CPred.nameIn [${p.vs.map(str).join(", ")}]`;
    case "paramLte": return `Gate.CPred.paramLte ${str(p.n)} ${p.v}`;
    case "paramGt": return `Gate.CPred.paramGt ${str(p.n)} ${p.v}`;
    case "paramStringEq": return `Gate.CPred.paramStringEq ${str(p.n)} ${str(p.v)}`;
    case "amountLte": return `Gate.CPred.amountLte ${p.v}`;
    case "amountGt": return `Gate.CPred.amountGt ${p.v}`;
    case "amountEq": return `Gate.CPred.amountEq ${p.v}`;
    case "currencyEq": return `Gate.CPred.currencyEq ${str(p.v)}`;
    case "recipientEq": return `Gate.CPred.recipientEq ${str(p.v)}`;
  }
}

function rule(r) {
  return `  { ruleId := ${str(r.ruleId)}, effect := ${effect(r.effect)}, preds := [${r.preds.map(pred).join(", ")}] }`;
}

function action(a) {
  const params = Object.entries(a.params ?? {}).map(([k, v]) => `(${str(k)}, ${v})`).join(", ");
  const sparams = Object.entries(a.sparams ?? {}).map(([k, v]) => `(${str(k)}, ${str(v)})`).join(", ");
  return `  { kind := ${a.kind}, app := ${str(a.app)}, name := ${str(a.name)}, params := [${params}], sparams := [${sparams}], amount := ${a.kind ? 0 : BigInt(a.amount)}, currency := ${str(a.currency ?? "")}, recipient := ${str(a.recipient ?? "")} }`;
}

const parts = [];
parts.push(`/-
Mandate refinement — GENERATED FILE, do not edit by hand.

Source: packages/proofs/vectors/mandate-refinement.json (every case
evaluated by the REAL TypeScript engine, @swaraj/rules).
Regenerate: node scripts/gen-refinement-vectors.mjs && node scripts/sync-refinement.mjs

The Lean kernel checks Gate.decideConcrete (the concrete instantiation of
the proven abstract decision function, Gate.Mandate) against the TypeScript
engine's outcome for EVERY case in the bounded space: ${file.mandates.length} mandates x
${file.actions.length} actions = ${file.cases.length} cases. Any divergence between the Lean
model and the TypeScript implementation inside this space breaks the build.
-/`);

parts.push(`import Gate.Concrete\n\nnamespace Gate`);

parts.push(`def refRulePool : List Gate.CRule := [\n${file.rules.map(rule).join(",\n")}\n]`);
parts.push(`def refActionPool : List Gate.CAction := [\n${file.actions.map(action).join(",\n")}\n]`);

for (const [mIdx, ruleIdxs] of file.mandates.entries()) {
  const expected = file.actions.map((_, aIdx) => {
    const entry = file.cases.find(([m, a]) => m === mIdx && a === aIdx);
    return entry[2] === "allow" ? "Gate.Outcome.allow" : "Gate.Outcome.block";
  });
  parts.push(`def refMandate_${mIdx} : List Gate.CRule := [${ruleIdxs.map((i) => `refRulePool[${i}]`).join(", ")}]

example : (Gate.refActionPool.map (Gate.decideConcrete refMandate_${mIdx})) = [${expected.join(", ")}] := by rfl`);
}

parts.push(`end Gate`);

writeFileSync(outPath, parts.join("\n\n") + "\n");
console.log(`Gate/Refinement.lean: ${file.mandates.length} mandates x ${file.actions.length} actions = ${file.cases.length} kernel-checked cases`);
