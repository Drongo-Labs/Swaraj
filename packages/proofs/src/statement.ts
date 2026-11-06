import { createHash } from "node:crypto";
import { policyDigest, type PolicyDoc } from "@swaraj/smt";
import type { GroundBinding, GroundDecision } from "./verifier.js";

/** What proofs commit to. The text must stay byte-identical to engine/src/statement.rs. */

export interface GateStatement {
  policyId: string;
  revision: number;
  policyDocDigest: string;
  binding: Array<{ name: string; value: string }>;
  outcome: GroundDecision["outcome"];
  violatedRuleIds: string[];
}

export function buildStatement(
  policy: PolicyDoc,
  action: GroundBinding,
  decision: GroundDecision,
): GateStatement {
  const binding = policy.fields
    .slice()
    .sort((a, b) => (a < b ? -1 : 1))
    .map((name) => ({ name, value: String(action.values[name]) }));
  return {
    policyId: policy.policyId,
    revision: policy.revision,
    policyDocDigest: policyDigest(policy),
    binding,
    outcome: decision.outcome,
    violatedRuleIds: decision.violatedRuleIds.slice().sort(),
  };
}

export function canonicalStatementText(statement: GateStatement): string {
  const binding = statement.binding
    .map((entry) => `${entry.name}:${entry.value}`)
    .join(";");
  const violated = statement.violatedRuleIds.length > 0
    ? statement.violatedRuleIds.join(",")
    : "-";
  return [
    "swaraj/statement/v1",
    `policy=${statement.policyId}`,
    `revision=${statement.revision}`,
    `digest=${statement.policyDocDigest}`,
    `binding=${binding}`,
    `outcome=${statement.outcome}`,
    `violated=${violated}`,
  ].join("\n");
}

export function statementId(statement: GateStatement): string {
  const hash = createHash("sha256").update(canonicalStatementText(statement)).digest("hex");
  return `stmt_${hash}`;
}
