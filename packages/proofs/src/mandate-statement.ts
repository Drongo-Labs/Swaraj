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
  decision: "ALLOW" | "BLOCK";
  matchedRuleIds: string[];
}

export function buildMandateStatement(input: {
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW" | "BLOCK";
  matchedRuleIds: string[];
}): MandateStatement {
  return {
    intentHash: input.intentHash,
    mandateHash: input.mandateHash,
    decision: input.decision,
    matchedRuleIds: input.matchedRuleIds.slice().sort(),
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
  ].join("\n");
}

export function mandateStatementId(statement: MandateStatement): string {
  const hash = createHash("sha256").update(canonicalMandateStatementText(statement)).digest("hex");
  return `stmt_${hash}`;
}
