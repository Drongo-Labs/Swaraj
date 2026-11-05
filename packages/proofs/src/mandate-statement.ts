import { createHash } from "node:crypto";

/**
 * The statement a mandate-decision proof commits to. Canonical text mirrors
 * the gate statement style (fixed line order, sorted ids); the statement id
 * is the SHA-256 of the text, so TypeScript and any future Rust/Lean port
 * derive the same id from the same inputs.
 */

export interface MandateStatement {
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL";
  matchedRuleIds: string[];
  /** Who approved a NEEDS_APPROVAL decision. */
  approvedBy?: string;
  /** Root of the on-chain evidence, when the action actually executed. */
  evidenceDigest?: string;
}

export function buildMandateStatement(input: {
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL";
  matchedRuleIds: string[];
  approvedBy?: string;
  evidenceDigest?: string;
}): MandateStatement {
  return {
    intentHash: input.intentHash,
    mandateHash: input.mandateHash,
    decision: input.decision,
    matchedRuleIds: input.matchedRuleIds.slice().sort(),
    ...(input.approvedBy !== undefined ? { approvedBy: input.approvedBy } : {}),
    ...(input.evidenceDigest !== undefined ? { evidenceDigest: input.evidenceDigest } : {}),
  };
}

export function canonicalMandateStatementText(statement: MandateStatement): string {
  const matched = statement.matchedRuleIds.length > 0 ? statement.matchedRuleIds.join(",") : "-";
  return [
    "swaraj/statement/mandate/v1",
    `intent=${statement.intentHash}`,
    `mandate=${statement.mandateHash}`,
    `decision=${statement.decision}`,
    `matched=${matched}`,
    ...(statement.approvedBy !== undefined ? [`approved_by=${statement.approvedBy}`] : []),
    ...(statement.evidenceDigest !== undefined ? [`evidence=${statement.evidenceDigest}`] : []),
  ].join("\n");
}

export function mandateStatementId(statement: MandateStatement): string {
  const hash = createHash("sha256").update(canonicalMandateStatementText(statement)).digest("hex");
  return `stmt_${hash}`;
}
