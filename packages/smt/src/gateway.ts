import {
  bindAction,
  checkPolicy,
  policyDigest,
  type BoundAction,
  type PolicyDoc,
} from "./policy.js";
import { renderSmtScript } from "./render.js";
import { SatSession } from "./z3.js";

export type BlockCause =
  | "RULE_VIOLATION"
  | "MALFORMED_ACTION"
  | "INVALID_POLICY"
  | "SOLVER_UNSAFE";

export interface GatewayDecision {
  outcome: "ALLOW" | "BLOCK";
  policyId: string;
  policyRevision: number;
  policyDigest: string;
  /** Identical SMT-LIB text for every gateway that saw the same inputs. */
  smtScript: string;
  violatedRuleIds: string[];
  cause?: BlockCause;
  detail?: string;
}

export interface DecideOptions {
  /** Solver timeout per check, milliseconds. Default 5000. */
  timeoutMs?: number;
}

/**
 * Evaluate a ground action against a policy document.
 *
 * Semantics: the action is ALLOWed iff the conjunction of assumptions,
 * rules, and the ground binding is satisfiable. The binding is ground, so
 * satisfiability reduces to "every rule holds".
 *
 * Fail-closed: an invalid policy, a malformed or incomplete action, an
 * "unknown" solver verdict, or any solver error produces BLOCK. A
 * BLOCK-with-RULE_VIOLATION carries the exact rule ids that the action
 * contradicts, found by re-solving each rule's negation under the
 * binding; failures that cannot be attributed list no rule ids.
 */
export async function decide(
  doc: PolicyDoc,
  action: BoundAction,
  options: DecideOptions = {},
): Promise<GatewayDecision> {
  const digest = policyDigest(doc);
  const header = {
    policyId: doc.policyId,
    policyRevision: doc.revision,
    policyDigest: digest,
  };

  const problems = checkPolicy(doc);
  if (problems.length > 0) {
    return {
      ...header,
      outcome: "BLOCK",
      smtScript: "",
      violatedRuleIds: [],
      cause: "INVALID_POLICY",
      detail: problems.map((p) => `${p.code}: ${p.detail}`).join("; "),
    };
  }

  const bound = bindAction(doc, action);
  if ("reject" in bound) {
    return {
      ...header,
      outcome: "BLOCK",
      smtScript: "",
      violatedRuleIds: [],
      cause: "MALFORMED_ACTION",
      detail: bound.reject,
    };
  }

  const smtScript = renderSmtScript(doc, { binding: bound.binding });

  try {
    const session = await SatSession.open(doc.fields, options.timeoutMs);
    for (const assumption of doc.assumptions) session.assert(assumption.assertion);
    for (const rule of doc.rules) session.assert(rule.assertion);
    session.assertBinding(bound.binding);

    const whole = await session.check();
    if (whole === "sat") {
      return { ...header, outcome: "ALLOW", smtScript, violatedRuleIds: [] };
    }
    if (whole === "unknown") {
      return unsafeBlock(header, smtScript, "whole-policy check returned unknown");
    }

    // unsat: attribute the violation by negating rules one at a time under
    // the same ground binding.
    const violated: string[] = [];
    for (const rule of doc.rules) {
      const probe = await SatSession.open(doc.fields, options.timeoutMs);
      for (const assumption of doc.assumptions) probe.assert(assumption.assertion);
      probe.assertBinding(bound.binding);
      probe.assert({ kind: "not", part: rule.assertion });
      const verdict = await probe.check();
      if (verdict === "sat") violated.push(rule.ruleId);
      if (verdict === "unknown") {
        return unsafeBlock(header, smtScript, `rule ${rule.ruleId} probe returned unknown`);
      }
    }
    return {
      ...header,
      outcome: "BLOCK",
      smtScript,
      violatedRuleIds: violated.length > 0 ? violated : doc.rules.map((r) => r.ruleId),
      cause: "RULE_VIOLATION",
    };
  } catch (err) {
    return unsafeBlock(header, smtScript, String(err));
  }
}

function unsafeBlock(
  header: { policyId: string; policyRevision: number; policyDigest: string },
  smtScript: string,
  detail: string,
): GatewayDecision {
  return {
    ...header,
    outcome: "BLOCK",
    smtScript,
    violatedRuleIds: [],
    cause: "SOLVER_UNSAFE",
    detail,
  };
}

/**
 * Pure satisfiability query over a policy without a ground binding — used
 * by policy authoring tools to check that a rule set is not vacuous or
 * self-contradictory.
 */
export async function checkPolicySatisfiable(doc: PolicyDoc): Promise<SatVerdictResult> {
  const problems = checkPolicy(doc);
  if (problems.length > 0) return { verdict: "invalid", problems };
  const session = await SatSession.open(doc.fields);
  for (const assumption of doc.assumptions) session.assert(assumption.assertion);
  for (const rule of doc.rules) session.assert(rule.assertion);
  return { verdict: await session.check(), problems: [] };
}

export type SatVerdictResult = {
  verdict: "sat" | "unsat" | "unknown" | "invalid";
  problems: Array<{ code: string; detail: string }>;
};

export type { BoolTerm, FieldBinding, PolicyDoc, BoundAction } from "./policy.js";
export { policyDigest, checkPolicy, bindAction } from "./policy.js";
export { renderSmtScript } from "./render.js";
export { SatSession, type SatVerdict } from "./z3.js";
