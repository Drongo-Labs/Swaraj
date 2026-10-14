import type pg from "pg";
import type { PoolHandle } from "./pool.js";

export type DecisionOutcome = "ALLOW" | "BLOCK";

export interface DecisionRecord {
  decisionId: number;
  appId: string;
  intentDigest: string;
  policyId: string;
  policyRevision: number;
  outcome: DecisionOutcome;
  violatedRules: string[];
  smtScript: string;
  decidedAt: string;
}

interface DecisionRow {
  decision_id: string | number;
  app_id: string;
  intent_digest: string;
  policy_id: string;
  policy_revision: number;
  outcome: DecisionOutcome;
  violated_rules: string[] | string;
  smt_script: string;
  decided_at: Date;
}

function toRecord(row: DecisionRow): DecisionRecord {
  const violated = typeof row.violated_rules === "string"
    ? (JSON.parse(row.violated_rules) as string[])
    : row.violated_rules;
  return {
    decisionId: Number(row.decision_id),
    appId: row.app_id,
    intentDigest: row.intent_digest,
    policyId: row.policy_id,
    policyRevision: Number(row.policy_revision),
    outcome: row.outcome,
    violatedRules: violated ?? [],
    smtScript: row.smt_script,
    decidedAt: new Date(row.decided_at).toISOString(),
  };
}

export async function insertDecision(
  handle: PoolHandle,
  decision: {
    appId: string;
    intentDigest: string;
    policyId: string;
    policyRevision: number;
    outcome: DecisionOutcome;
    violatedRules: string[];
    smtScript: string;
  },
): Promise<DecisionRecord> {
  const result = await handle.raw.query<DecisionRow>(
    `INSERT INTO authz_decisions
       (app_id, intent_digest, policy_id, policy_revision, outcome, violated_rules, smt_script)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
     ON CONFLICT (app_id, intent_digest) DO UPDATE SET outcome = EXCLUDED.outcome
     RETURNING decision_id, app_id, intent_digest, policy_id, policy_revision,
               outcome, violated_rules, smt_script, decided_at`,
    [
      decision.appId,
      decision.intentDigest,
      decision.policyId,
      decision.policyRevision,
      decision.outcome,
      JSON.stringify(decision.violatedRules),
      decision.smtScript,
    ],
  );
  return toRecord(result.rows[0]!);
}

export async function findDecisionByIntent(
  handle: PoolHandle,
  appId: string,
  intentDigest: string,
): Promise<DecisionRecord | undefined> {
  const result = await handle.raw.query<DecisionRow>(
    `SELECT decision_id, app_id, intent_digest, policy_id, policy_revision,
            outcome, violated_rules, smt_script, decided_at
     FROM authz_decisions WHERE app_id = $1 AND intent_digest = $2`,
    [appId, intentDigest],
  );
  const row = result.rows[0];
  return row ? toRecord(row) : undefined;
}
