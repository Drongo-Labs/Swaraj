import { createHash } from "node:crypto";
import { SatSession } from "@swaraj/smt";
import type { AgentMandate, UnifiedAction, MandateRule, MandatePredicate } from "@swaraj/schemas";
import { evaluateParsedMandate, type MandateDecision } from "./index.js";

/**
 * Compiles a decision to SMT so Z3 checks it independently. Callers must fail closed on disagreement.
 * Strings hash to integers; a collision can only cause a disagreement.
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

type FieldKind = "string" | "number" | "bigint" | "boolean";

/** Fields each action type exposes, written out independently of the TS engine. */
const ACTION_FIELDS: Record<UnifiedAction["action"], readonly string[]> = {
  SPOT_TRADE: ["resource.venue", "context.amount", "context.assetIn", "context.assetOut", "context.slippageBps"],
  PAYMENT: ["resource.service", "context.amount", "context.currency", "context.recipient"],
  DEPLOY: ["resource.repo", "context.branch", "context.commitHash", "context.environment"],
  DELETE: ["resource.service", "resource.objectType", "resource.objectId", "context.hardDelete", "context.reason"],
  REFUND: ["resource.service", "context.amount", "context.currency", "context.recipient", "context.originalPaymentId"],
  APP_ACTION: ["resource.app", "resource.target", "context.name"],
};

interface Binding { values: Map<string, bigint>; kinds: Map<string, FieldKind> }

/** Ground integer values of the action's fields, with each field's runtime type.
 * Absent fields are not bound, and a predicate whose type differs from the
 * field's compiles to FALSE: both match the TS engine, which never matches an
 * absent or mistyped field. Params are keyed by type (param / paramString /
 * paramBool), as each param predicate kind reads only its own type. */
function actionBinding(action: UnifiedAction): Binding {
  const values = new Map<string, bigint>([[DUMMY_FIELD, 1n]]);
  const kinds = new Map<string, FieldKind>();
  const put = (name: string, value: unknown) => {
    if (typeof value === "string") { values.set(name, stringCode(value)); kinds.set(name, "string"); }
    else if (typeof value === "bigint") { values.set(name, value); kinds.set(name, "bigint"); }
    else if (typeof value === "number" && Number.isSafeInteger(value)) { values.set(name, BigInt(value)); kinds.set(name, "number"); }
    else if (typeof value === "boolean") { values.set(name, value ? 1n : 0n); kinds.set(name, "boolean"); }
  };
  put("agent", action.agent);
  put("timestamp", action.timestamp);
  put("expiry", action.expiry);
  put("provenance.untrusted", action.provenance?.untrusted);
  const parts = { resource: action.resource as Record<string, unknown>, context: action.context as Record<string, unknown> };
  for (const field of ACTION_FIELDS[action.action]) {
    const [part, key] = field.split(".") as ["resource" | "context", string];
    put(field, parts[part][key]);
  }
  if (action.action === "APP_ACTION") {
    for (const [name, value] of Object.entries(action.context.params)) {
      const prefix = typeof value === "bigint" ? "context.param" : typeof value === "string" ? "context.paramString" : "context.paramBool";
      put(`${prefix}.${name}`, value);
    }
  }
  return { values, kinds };
}

function compareTerm(name: string, op: "EQ" | "LT" | "LTE" | "GT" | "GTE", constant: bigint): BoolTerm {
  return { kind: "compare", op: OP_MAP[op], left: { kind: "field", name }, right: { kind: "const", value: constant } };
}

function predicateTerm(predicate: MandatePredicate, binding: Binding): BoolTerm {
  const key = "name" in predicate ? `${predicate.field}.${predicate.name}` : predicate.field;
  const kind = binding.kinds.get(key);
  if (kind === undefined) return FALSE;
  if (predicate.operator === "IN") {
    return kind === "string"
      ? { kind: "any", parts: predicate.values.map((value) => compareTerm(key, "EQ", stringCode(value))) }
      : FALSE;
  }
  const value = predicate.value;
  if (typeof value !== kind) return FALSE;
  if (typeof value === "bigint" || typeof value === "number") return compareTerm(key, predicate.operator, BigInt(value));
  if (typeof value === "boolean") return compareTerm(key, "EQ", value ? 1n : 0n);
  return compareTerm(key, "EQ", stringCode(value));
}

function ruleTerm(rule: MandateRule, binding: Binding, action: UnifiedAction): BoolTerm {
  // The TS engine requires the action type to match before any predicate
  // (ruleMatches: action.action === rule.action) — bake it in as a constant.
  const kindOk: BoolTerm = rule.action === action.action ? TRUE : FALSE;
  if (rule.predicates.length === 0) return kindOk;
  return { kind: "all", parts: [kindOk, ...rule.predicates.map((predicate) => predicateTerm(predicate, binding))] };
}

/** The decision formula: allow iff (no forbid or approval rule matches) ∧ (some permit matches). */
export function mandateDecisionTerm(mandate: AgentMandate, action: UnifiedAction): BoolTerm {
  const binding = actionBinding(action);
  const forbids = mandate.rules.filter((rule) => rule.effect !== "PERMIT").map((rule) => ruleTerm(rule, binding, action));
  const permits = mandate.rules.filter((rule) => rule.effect === "PERMIT").map((rule) => ruleTerm(rule, binding, action));
  const forbidAny: BoolTerm = { kind: "any", parts: forbids };
  const noForbid: BoolTerm = forbids.length === 0 ? TRUE : { kind: "not", part: forbidAny };
  const somePermit: BoolTerm = permits.length === 0 ? FALSE : { kind: "any", parts: permits };
  // The engine checks the validity window and the subject before any rule.
  const active: BoolTerm = {
    kind: "all",
    parts: [
      compareTerm("timestamp", "GTE", BigInt(mandate.validFrom)),
      compareTerm("timestamp", "LT", BigInt(mandate.validUntil)),
      mandate.agent === "*" ? TRUE : compareTerm("agent", "EQ", stringCode(mandate.agent)),
    ],
  };
  const formula: BoolTerm = { kind: "all", parts: [active, noForbid, somePermit] };
  return formula;
}

/** Z3's independent verdict on the mandate decision. */
export async function z3MandateDecision(
  mandate: AgentMandate,
  action: UnifiedAction,
): Promise<"ALLOW" | "BLOCK"> {
  const { values } = actionBinding(action);
  const session = await SatSession.open(values.keys(), 10_000);
  session.assertBinding(values);
  session.assert(mandateDecisionTerm(mandate, action));
  const verdict = await session.check();
  if (verdict === "sat") return "ALLOW";
  if (verdict === "unsat") return "BLOCK";
  throw new Error(`z3 returned ${verdict}`);
}

/** One Z3 session per action, with push/pop per mandate. Verdict order matches `mandates`. */
export async function z3VerdictsForAction(
  action: UnifiedAction,
  mandates: AgentMandate[],
): Promise<Array<"ALLOW" | "BLOCK">> {
  const { values } = actionBinding(action);
  const session = await SatSession.open(values.keys(), 10_000);
  session.assertBinding(values);
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
