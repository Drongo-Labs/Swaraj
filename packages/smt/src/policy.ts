import { createHash } from "node:crypto";

/** Constraint AST shared by the gateway, renderer and SP1 guest. Integer arithmetic only, never floats. */

export interface ConstTerm {
  kind: "const";
  value: bigint;
}

export interface FieldTerm {
  kind: "field";
  name: string;
}

export interface SumTerm {
  kind: "sum";
  parts: IntTerm[];
}

export interface DiffTerm {
  kind: "diff";
  left: IntTerm;
  right: IntTerm;
}

export interface ProdTerm {
  kind: "prod";
  parts: IntTerm[];
}

export type IntTerm = ConstTerm | FieldTerm | SumTerm | DiffTerm | ProdTerm;

export type CompareOp = "eq" | "ne" | "lt" | "le" | "gt" | "ge";

export interface CompareTerm {
  kind: "compare";
  op: CompareOp;
  left: IntTerm;
  right: IntTerm;
}

export interface AllTerm {
  kind: "all";
  parts: BoolTerm[];
}

export interface AnyTerm {
  kind: "any";
  parts: BoolTerm[];
}

export interface NotTerm {
  kind: "not";
  part: BoolTerm;
}

export interface ImpliesTerm {
  kind: "implies";
  when: BoolTerm;
  then: BoolTerm;
}

export type BoolTerm = CompareTerm | AllTerm | AnyTerm | NotTerm | ImpliesTerm;

export interface NamedAssertion {
  ruleId: string;
  assertion: BoolTerm;
}

export interface PolicyDoc {
  policyId: string;
  revision: number;
  fields: string[];
  assumptions: NamedAssertion[];
  rules: NamedAssertion[];
}

/** Ground values for every declared field, as canonical decimal strings. */
export type FieldBinding = Map<string, bigint>;

export interface PolicyProblem {
  code: "UNDECLARED_FIELD" | "DUPLICATE_RULE_ID" | "EMPTY_RULE_ID" | "BAD_REVISION";
  detail: string;
}

export interface BoundAction {
  values: Record<string, string>;
}

/** Structural policy check. The gateway refuses documents that fail it. */
export function checkPolicy(doc: PolicyDoc): PolicyProblem[] {
  const problems: PolicyProblem[] = [];
  const declared = new Set(doc.fields);

  if (!Number.isInteger(doc.revision) || doc.revision < 1) {
    problems.push({ code: "BAD_REVISION", detail: `revision ${doc.revision} is not a positive integer` });
  }

  const seenRuleIds = new Set<string>();
  for (const named of [...doc.assumptions, ...doc.rules]) {
    if (!named.ruleId) {
      problems.push({ code: "EMPTY_RULE_ID", detail: "assertion without a rule id" });
      continue;
    }
    if (seenRuleIds.has(named.ruleId)) {
      problems.push({ code: "DUPLICATE_RULE_ID", detail: named.ruleId });
    }
    seenRuleIds.add(named.ruleId);
    walkTerms(named.assertion, (term) => {
      if (term.kind === "field" && !declared.has(term.name)) {
        problems.push({ code: "UNDECLARED_FIELD", detail: `${named.ruleId}: ${term.name}` });
      }
    });
  }

  return problems;
}

export function collectFieldRefs(term: BoolTerm): Set<string> {
  const refs = new Set<string>();
  walkTerms(term, (node) => {
    if (node.kind === "field") refs.add(node.name);
  });
  return refs;
}

function walkTerms(term: BoolTerm, visit: (node: IntTerm | BoolTerm) => void): void {
  const stack: Array<IntTerm | BoolTerm> = [term];
  while (stack.length > 0) {
    const node = stack.pop()!;
    visit(node);
    switch (node.kind) {
      case "const":
      case "field":
        break;
      case "sum":
      case "prod":
        stack.push(...node.parts);
        break;
      case "diff":
        stack.push(node.left, node.right);
        break;
      case "compare":
        stack.push(node.left, node.right);
        break;
      case "all":
      case "any":
        stack.push(...node.parts);
        break;
      case "not":
        stack.push(node.part);
        break;
      case "implies":
        stack.push(node.when, node.then);
        break;
    }
  }
}

function stableString(value: unknown): string {
  if (typeof value === "bigint") return `${value.toString()}n`;
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableString).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableString(record[key])}`).join(",")}}`;
}

/** Canonical digest of a policy document; identical documents always agree. */
export function policyDigest(doc: PolicyDoc): string {
  const normalized = {
    policyId: doc.policyId,
    revision: doc.revision,
    fields: [...doc.fields].sort(),
    assumptions: doc.assumptions,
    rules: doc.rules,
  };
  const payload = `swaraj/policy/v1\n${stableString(normalized)}`;
  return `pol_${createHash("sha256").update(payload).digest("hex")}`;
}

/** Normalizes ground values. Rejects floats, non-numeric text and unknown fields; all fields are required. */
export function bindAction(doc: PolicyDoc, action: BoundAction): { binding: FieldBinding } | { reject: string } {
  const declared = new Set(doc.fields);
  for (const name of Object.keys(action.values)) {
    if (!declared.has(name)) return { reject: `unknown field ${name}` };
  }
  const binding: FieldBinding = new Map();
  for (const name of doc.fields) {
    const raw = action.values[name];
    if (raw === undefined) return { reject: `missing value for ${name}` };
    const text = String(raw).trim();
    if (!/^-?\d+$/.test(text)) return { reject: `${name} is not an integer` };
    binding.set(name, BigInt(text));
  }
  return { binding };
}
