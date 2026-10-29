import { createHash } from "node:crypto";
import { SatSession } from "@swaraj/smt";
import type { AgentMandate, UnifiedAction, MandateRule, MandatePredicate } from "@swaraj/schemas";
import { evaluateParsedMandate, type MandateDecision } from "./index.js";

/**
 * Z3 dual-engine cross-check: compile a mandate decision into SMT (the same
 * typed integer term AST the gateway renders) and let Z3 decide it
 * independently of the predicate engine. Disagreement (or solver failure)
 * must be treated as fail-closed by the caller.
 *
 * String fields (app, name, currency, recipient, string params) are encoded
 * as deterministic non-negative integer hashes of their values — equality
 * on the hash is equality on the string for the bounded domain. A hash
 * collision could only ever cause a disagreement, which fails closed.
 */

type IntTerm = { kind: "const"; value: bigint } | { kind: "field"; name: string };
type SmtOp = "eq" | "ne" | "lt" | "le" | "gt" | "ge";
type BoolTerm =
  | { kind: "compare"; op: SmtOp; left: IntTerm; right: IntTerm }
  | { kind: "all"; parts: BoolTerm[] }
  | { kind: "any"; parts: BoolTerm[] }
  | { kind: "not"; part: BoolTerm };

const OP_MAP: Record<"EQ" | "LT" | "LTE" | "GT" | "GTE", SmtOp> = {
  EQ: "eq", LT: "lt", LTE: "le", GT: "gt", GTE: "ge",
};

const DUMMY_FIELD = "__one";
const TRUE: BoolTerm = {
  kind: "compare", op: "eq",
  left: { kind: "field", name: DUMMY_FIELD }, right: { kind: "field", name: DUMMY_FIELD },
};
const FALSE: BoolTerm = { kind: "not", part: TRUE };

/** Deterministic non-negative integer encoding of a string. */
function stringCode(value: string): bigint {
  return BigInt(`0x${createHash("sha256").update(value).digest("hex").slice(0, 15)}`);
}

/** Ground integer values of the action's fields; absent fields are simply
 * not bound (predicates over them compile to FALSE, matching the TS
 * `fieldValue → undefined → no match` semantics). */
function actionBinding(action: UnifiedAction): Map<string, bigint> {
  const binding = new Map<string, bigint>([[DUMMY_FIELD, 1n]]);
  const put = (name: string, value: bigint) => binding.set(name, value);
  if (action.action === "APP_ACTION") {
    const context = action.context;
    put("resource.app", stringCode(action.resource.app));
    put("context.name", stringCode(context.name));
    for (const [name, value] of Object.entries(context.params)) {
      put(`context.param.${name}`, typeof value === "bigint" ? value : stringCode(String(value)));
    }
  } else if (action.action === "PAYMENT" || action.action === "REFUND") {
    const context = action.context;
    put("context.amount", context.amount);
    put("context.currency", stringCode(context.currency));
    put("context.recipient", stringCode(context.recipient));
  }
  return binding;
}

function predicateTerm(predicate: MandatePredicate, binding: Map<string, bigint>): BoolTerm {
  const compare = (name: string, op: "EQ" | "LT" | "LTE" | "GT" | "GTE", constant: bigint): BoolTerm => ({
    kind: "compare",
    op: OP_MAP[op],
    left: { kind: "field", name },
    right: { kind: "const", value: constant },
  });
  const stringEqTerm = (name: string, value: string): BoolTerm =>
    binding.has(name)
      ? compare(name, "EQ", stringCode(value))
      : FALSE; // field absent from this action — never matches

  switch (predicate.field) {
    case "resource.app":
      return "value" in predicate ? stringEqTerm("resource.app", predicate.value) : FALSE;
    case "resource.target":
      return "value" in predicate ? stringEqTerm("resource.target", predicate.value) : FALSE;
    case "context.name":
      if ("values" in predicate) {
        return predicate.values.length === 0
          ? FALSE
          : { kind: "any", parts: predicate.values.map((value) => stringEqTerm("context.name", value)) };
      }
      return "value" in predicate ? stringEqTerm("context.name", predicate.value) : FALSE;
    case "context.currency":
    case "context.recipient":
      return "value" in predicate ? stringEqTerm(predicate.field, predicate.value) : FALSE;
    case "context.param": {
      const name = `context.param.${predicate.name}`;
      if (!binding.has(name)) return FALSE;
      return compare(name, predicate.operator, predicate.value);
    }
    case "context.paramString":
      // TS fieldValue reads params[name] for all param predicate kinds —
      // string params are bound at `context.param.<name>`.
      return "value" in predicate
        ? stringEqTerm(`context.param.${predicate.name}`, predicate.value)
        : FALSE;
    case "context.paramBool": {
      const name = `context.param.${predicate.name}`;
      if (!binding.has(name)) return FALSE;
      return compare(name, "EQ", predicate.value ? 1n : 0n);
    }
    case "context.amount": {
      if (!binding.has("context.amount")) return FALSE;
      return compare("context.amount", predicate.operator, predicate.value);
    }
    default:
      return FALSE;
  }
}

function ruleTerm(rule: MandateRule, binding: Map<string, bigint>, action: UnifiedAction): BoolTerm {
  // The TS engine requires the action type to match before any predicate
  // (ruleMatches: action.action === rule.action) — bake it in as a constant.
  const kindOk: BoolTerm = rule.action === action.action ? TRUE : FALSE;
  if (rule.predicates.length === 0) return kindOk;
  return { kind: "all", parts: [kindOk, ...rule.predicates.map((predicate) => predicateTerm(predicate, binding))] };
}

/** The decision formula: allow iff (no forbid matches) ∧ (some permit matches). */
export function mandateDecisionTerm(mandate: AgentMandate, action: UnifiedAction): BoolTerm {
  const binding = actionBinding(action);
  const forbids = mandate.rules.filter((rule) => rule.effect === "FORBID").map((rule) => ruleTerm(rule, binding, action));
  const permits = mandate.rules.filter((rule) => rule.effect === "PERMIT").map((rule) => ruleTerm(rule, binding, action));
  const forbidAny: BoolTerm = { kind: "any", parts: forbids };
  const noForbid: BoolTerm = forbids.length === 0 ? TRUE : { kind: "not", part: forbidAny };
  const somePermit: BoolTerm = permits.length === 0 ? FALSE : { kind: "any", parts: permits };
  const formula: BoolTerm = { kind: "all", parts: [noForbid, somePermit] };
  return formula;
}

/** Z3's independent verdict on the mandate decision. */
export async function z3MandateDecision(
  mandate: AgentMandate,
  action: UnifiedAction,
): Promise<"ALLOW" | "BLOCK"> {
  const binding = actionBinding(action);
  const session = await SatSession.open(binding.keys(), 10_000);
  session.assertBinding(binding);
  session.assert(mandateDecisionTerm(mandate, action));
  const verdict = await session.check();
  if (verdict === "sat") return "ALLOW";
  if (verdict === "unsat") return "BLOCK";
  throw new Error(`z3 returned ${verdict}`);
}

/**
 * Batch sweep for verification harnesses: one Z3 session per action (fields
 * bound once), then each mandate's formula asserted in a push/check/pop
 * scope — the entire bounded space dual-checked without per-case session
 * cost. Verdict order matches `mandates`.
 */
export async function z3VerdictsForAction(
  action: UnifiedAction,
  mandates: AgentMandate[],
): Promise<Array<"ALLOW" | "BLOCK">> {
  const binding = actionBinding(action);
  const session = await SatSession.open(binding.keys(), 10_000);
  session.assertBinding(binding);
  const verdicts: Array<"ALLOW" | "BLOCK"> = [];
  for (const mandate of mandates) {
    session.push();
    session.assert(mandateDecisionTerm(mandate, action));
    const verdict = await session.check();
    session.pop();
    if (verdict === "sat") verdicts.push("ALLOW");
    else if (verdict === "unsat") verdicts.push("BLOCK");
    else throw new Error(`z3 returned ${verdict}`);
  }
  return verdicts;
}

/** Dual-engine check: predicate engine vs Z3. `agree` false ⇒ fail closed. */
export async function crossCheckMandateDecision(
  mandate: AgentMandate,
  action: UnifiedAction,
): Promise<{ decision: MandateDecision; z3: "ALLOW" | "BLOCK"; agree: boolean }> {
  const decision = evaluateParsedMandate(mandate, action);
  const z3 = await z3MandateDecision(mandate, action);
  return { decision, z3, agree: (decision.decision === "ALLOW") === (z3 === "ALLOW") };
}
