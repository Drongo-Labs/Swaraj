#!/usr/bin/env node
/** Generates Gate/Vectors.lean from the shared gate vectors. Run: pnpm --filter @swaraj/lean sync:vectors */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const vectorsPath = join(here, "../../proofs/vectors/gate-vectors.json");
const outPath = join(here, "../Gate/Vectors.lean");

const file = JSON.parse(readFileSync(vectorsPath, "utf8"));
if (file.domain !== "swaraj/gate-vectors/v1") {
  throw new Error(`unexpected vector domain: ${file.domain}`);
}

function leanString(value) {
  return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function intTerm(term) {
  return `(${intTermRaw(term)})`;
}

function intTermRaw(term) {
  switch (term.kind) {
    case "const":
      return `Gate.IntTerm.const ${term.value}`;
    case "field":
      return `Gate.IntTerm.field ${leanString(term.name)}`;
    case "sum":
      return `Gate.IntTerm.sum [${term.parts.map(intTerm).join(", ")}]`;
    case "diff":
      return `Gate.IntTerm.diff ${intTerm(term.left)} ${intTerm(term.right)}`;
    case "prod":
      return `Gate.IntTerm.prod [${term.parts.map(intTerm).join(", ")}]`;
    default:
      throw new Error(`unknown int term kind ${term.kind}`);
  }
}

function boolTerm(term) {
  return `(${boolTermRaw(term)})`;
}

function boolTermRaw(term) {
  switch (term.kind) {
    case "compare":
      return `Gate.BoolTerm.compare Gate.CmpOp.${term.op} ${intTerm(term.left)} ${intTerm(term.right)}`;
    case "all":
      return `Gate.BoolTerm.all [${term.parts.map(boolTerm).join(", ")}]`;
    case "any":
      return `Gate.BoolTerm.any [${term.parts.map(boolTerm).join(", ")}]`;
    case "not":
      return `Gate.BoolTerm.neg ${boolTerm(term.part)}`;
    case "implies":
      return `Gate.BoolTerm.implies ${boolTerm(term.when)} ${boolTerm(term.then)}`;
    default:
      throw new Error(`unknown bool term kind ${term.kind}`);
  }
}

function named(a) {
  return `Gate.NamedAssertion.mk ${leanString(a.ruleId)} ${boolTerm(a.assertion)}`;
}

function policyLiteral(policy) {
  const fields = policy.fields.map(leanString).join(", ");
  const assumptions = policy.assumptions.map(named).join(", ");
  const rules = policy.rules.map(named).join(", ");
  return `Gate.PolicyDoc.mk ${leanString(policy.policyId)} ${policy.revision} [${fields}] [${assumptions}] [${rules}]`;
}

function bindingLiteral(action) {
  const pairs = Object.entries(action.values)
    .map(([name, value]) => `(${leanString(name)}, ${value})`)
    .join(", ");
  return `[${pairs}]`;
}

function identifier(name) {
  return name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part.toLowerCase() : part[0].toUpperCase() + part.slice(1).toLowerCase()))
    .join("");
}

const policyDefs = Object.entries(file.policies).map(([key, policy]) => {
  const id = `pol_${identifier(policy.policyId)}`;
  return { key, id, text: `def ${id} : Gate.PolicyDoc :=\n  ${policyLiteral(policy)}` };
});

const caseDefs = file.cases.map((vectorCase) => {
  const policy = policyDefs.find((entry) => entry.key === vectorCase.policy);
  if (!policy) throw new Error(`case ${vectorCase.name}: unknown policy ${vectorCase.policy}`);
  const id = identifier(vectorCase.name);
  const outcome = vectorCase.expect.outcome === "ALLOW" ? "Gate.Outcome.allow" : "Gate.Outcome.block";
  const violated = vectorCase.expect.violated.length === 0
    ? "[]"
    : `[${vectorCase.expect.violated.map(leanString).join(", ")}]`;
  return {
    text: [
      `def bind_${id} : Gate.Binding :=`,
      `  ${bindingLiteral(vectorCase.action)}`,
      ``,
      `example : Gate.decide ${policy.id} bind_${id} = (${outcome}, ${violated}) := by
  simp [${policy.id}, bind_${id},
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]`,
    ].join("\n"),
  };
});

const header = `/-
Shared gate vectors — GENERATED FILE, do not edit by hand.

Source: packages/proofs/vectors/gate-vectors.json
Regenerate: pnpm --filter @swaraj/lean sync:vectors

Each example is kernel-checked: the Lean evaluator must reproduce the
exact outcome and violated-rule list the TypeScript gateway test
(scripts/vectors.test.ts) and the Rust engine tests assert.
-/

import Gate.Decide

namespace Gate

`;

const body = [
  ...policyDefs.map((entry) => entry.text),
  ...caseDefs.map((entry) => entry.text),
].join("\n\n");

writeFileSync(outPath, `${header}${body}\n\nend Gate\n`);
console.log(`wrote ${outPath}: ${policyDefs.length} policies, ${file.cases.length} cases`);
