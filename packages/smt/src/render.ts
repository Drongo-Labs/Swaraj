import type { BoolTerm, CompareOp, FieldBinding, IntTerm, NamedAssertion, PolicyDoc } from "./policy.js";

/**
 * Renders the exact SMT-LIB script the gateway asked Z3 to check, so every
 * decision can be stored and replayed later against any SMT solver.
 */

function renderInt(term: IntTerm): string {
  switch (term.kind) {
    case "const":
      return term.value.toString();
    case "field":
      return term.name;
    case "sum":
      return `(+ ${term.parts.map(renderInt).join(" ")})`;
    case "diff":
      return `(- ${renderInt(term.left)} ${renderInt(term.right)})`;
    case "prod":
      return `(* ${term.parts.map(renderInt).join(" ")})`;
  }
}

const COMPARE_OPS: Record<CompareOp, string> = {
  eq: "=",
  ne: "distinct",
  lt: "<",
  le: "<=",
  gt: ">",
  ge: ">=",
};

function renderBool(term: BoolTerm): string {
  switch (term.kind) {
    case "compare": {
      const op = COMPARE_OPS[term.op];
      return `(${op} ${renderInt(term.left)} ${renderInt(term.right)})`;
    }
    case "all":
      return `(and ${term.parts.map(renderBool).join(" ")})`;
    case "any":
      return `(or ${term.parts.map(renderBool).join(" ")})`;
    case "not":
      return `(not ${renderBool(term.part)})`;
    case "implies":
      return `(=> ${renderBool(term.when)} ${renderBool(term.then)})`;
  }
}

function renderNamed(section: string, named: NamedAssertion): string {
  return `(assert ; ${section} ${named.ruleId}\n  ${renderBool(named.assertion)})`;
}

export interface RenderOptions {
  /** Ground action values asserted as equalities; omitted for pure satisfiability queries. */
  binding?: FieldBinding;
}

export function renderSmtScript(doc: PolicyDoc, options: RenderOptions = {}): string {
  const lines: string[] = [];
  lines.push(`; policy ${doc.policyId} revision ${doc.revision}`);
  lines.push("(set-logic QF_NIA)");
  for (const field of [...doc.fields].sort()) {
    lines.push(`(declare-const ${field} Int)`);
  }
  lines.push("");
  for (const assumption of doc.assumptions) {
    lines.push(renderNamed("assumption", assumption));
  }
  lines.push("");
  for (const rule of doc.rules) {
    lines.push(renderNamed("rule", rule));
  }
  if (options.binding) {
    lines.push("");
    lines.push("; ground action under test");
    for (const [name, value] of [...options.binding.entries()].sort(([a], [b]) => (a < b ? -1 : 1))) {
      lines.push(`(assert (= ${name} ${value.toString()}))`);
    }
  }
  lines.push("");
  lines.push("(check-sat)");
  return lines.join("\n");
}
