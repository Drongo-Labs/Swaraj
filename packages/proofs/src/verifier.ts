import { createHash } from "node:crypto";
import type { BoolTerm, IntTerm, PolicyDoc } from "@swaraj/smt";

/**
 * Ground re-evaluation of a policy over a bound action — the deterministic
 * counterpart of the SMT gateway. The SP1 guest runs the identical
 * algorithm (packages/proofs/engine, Rust), so any disagreement between
 * the gateway and the guest is a parity failure, not a policy question.
 */

export interface GroundDecision {
  outcome: "ALLOW" | "BLOCK";
  violatedRuleIds: string[];
}

export class EvaluationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvaluationError";
  }
}

export interface GroundBinding {
  values: Record<string, string>;
}

function evalInt(term: IntTerm, values: Record<string, bigint>): bigint {
  switch (term.kind) {
    case "const":
      return term.value;
    case "field": {
      const found = values[term.name];
      if (found === undefined) throw new EvaluationError(`unbound field ${term.name}`);
      return found;
    }
    case "sum":
      return term.parts.reduce((acc, part) => acc + evalInt(part, values), 0n);
    case "prod":
      return term.parts.reduce((acc, part) => acc * evalInt(part, values), 1n);
    case "diff":
      return evalInt(term.left, values) - evalInt(term.right, values);
  }
}

function evalBool(term: BoolTerm, values: Record<string, bigint>): boolean {
  switch (term.kind) {
    case "compare": {
      const left = evalInt(term.left, values);
      const right = evalInt(term.right, values);
      switch (term.op) {
        case "eq":
          return left === right;
        case "ne":
          return left !== right;
        case "lt":
          return left < right;
        case "le":
          return left <= right;
        case "gt":
          return left > right;
        case "ge":
          return left >= right;
      }
    }
    case "all":
      return term.parts.every((part) => evalBool(part, values));
    case "any":
      return term.parts.some((part) => evalBool(part, values));
    case "not":
      return !evalBool(term.part, values);
    case "implies":
      return !evalBool(term.when, values) || evalBool(term.then, values);
  }
}

/**
 * Evaluate assumptions and rules over a fully bound action. Missing or
 * non-integer values raise EvaluationError — callers must treat that as
 * a proof failure, never as an allow.
 */
export function reevaluateGround(policy: PolicyDoc, action: GroundBinding): GroundDecision {
  const values: Record<string, bigint> = {};
  for (const name of policy.fields) {
    const raw = action.values[name];
    if (raw === undefined) throw new EvaluationError(`missing value for ${name}`);
    const text = String(raw).trim();
    if (!/^-?\d+$/.test(text)) throw new EvaluationError(`${name} is not an integer`);
    values[name] = BigInt(text);
  }
  for (const name of Object.keys(action.values)) {
    if (!policy.fields.includes(name)) throw new EvaluationError(`unknown field ${name}`);
  }
  for (const assumption of policy.assumptions) {
    if (!evalBool(assumption.assertion, values)) {
      throw new EvaluationError(`assumption ${assumption.ruleId} does not hold`);
    }
  }
  const violatedRuleIds = policy.rules
    .filter((rule) => !evalBool(rule.assertion, values))
    .map((rule) => rule.ruleId);
  return { outcome: violatedRuleIds.length === 0 ? "ALLOW" : "BLOCK", violatedRuleIds };
}

/**
 * Wire form of a policy for JSON transports (job queue, SP1 host): the
 * bigint constants of the in-memory AST become JSON numbers, which is
 * exactly the shape the Rust engine deserializes (i64).
 */
export function toWirePolicy(policy: PolicyDoc): PolicyDoc {
  return JSON.parse(
    JSON.stringify(policy, (_key, value: unknown) =>
      typeof value === "bigint" ? Number(value) : value),
  ) as PolicyDoc;
}

/** Restore the in-memory bigint AST from a wire policy. */
export function fromWirePolicy(wire: PolicyDoc): PolicyDoc {
  const reviveInt = (term: IntTerm): IntTerm => {
    switch (term.kind) {
      case "const":
        return { kind: "const", value: BigInt(term.value) };
      case "field":
        return term;
      case "sum":
      case "prod":
        return { kind: term.kind, parts: term.parts.map(reviveInt) };
      case "diff":
        return { kind: "diff", left: reviveInt(term.left), right: reviveInt(term.right) };
    }
  };
  const reviveBool = (term: BoolTerm): BoolTerm => {
    switch (term.kind) {
      case "compare":
        return {
          kind: "compare",
          op: term.op,
          left: reviveInt(term.left),
          right: reviveInt(term.right),
        };
      case "all":
      case "any":
        return { kind: term.kind, parts: term.parts.map(reviveBool) };
      case "not":
        return { kind: "not", part: reviveBool(term.part) };
      case "implies":
        return { kind: "implies", when: reviveBool(term.when), then: reviveBool(term.then) };
    }
  };
  return {
    ...wire,
    assumptions: wire.assumptions.map((a) => ({ ruleId: a.ruleId, assertion: reviveBool(a.assertion) })),
    rules: wire.rules.map((r) => ({ ruleId: r.ruleId, assertion: reviveBool(r.assertion) })),
  };
}
