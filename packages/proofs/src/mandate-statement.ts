import { createHash } from "node:crypto";

/** What a mandate proof commits to. The id is the SHA-256 of the canonical text. */

export interface MandateStatement {
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW" | "BLOCK";
  matchedRuleIds: string[];
  /** Root of the on-chain evidence, when the action actually executed. */
  evidenceDigest?: string;
}

export function buildMandateStatement(input: {
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW" | "BLOCK";
  matchedRuleIds: string[];
  evidenceDigest?: string;
}): MandateStatement {
  return {
    intentHash: input.intentHash,
    mandateHash: input.mandateHash,
    decision: input.decision,
    matchedRuleIds: input.matchedRuleIds.slice().sort(),
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
    ...(statement.evidenceDigest !== undefined ? [`evidence=${statement.evidenceDigest}`] : []),
  ].join("\n");
}

export function mandateStatementId(statement: MandateStatement): string {
  const hash = createHash("sha256").update(canonicalMandateStatementText(statement)).digest("hex");
  return `stmt_${hash}`;
}
