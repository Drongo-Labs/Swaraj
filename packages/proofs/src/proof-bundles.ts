import { deriveGuestOutput } from "./public-values.js";

type ObjectValue = Record<string, unknown>;

function object(value: unknown): ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ObjectValue
    : {};
}

function withoutCommittedHash(value: unknown, key: string): ObjectValue {
  const { [key]: _hash, ...rest } = object(value);
  return rest;
}

export interface LegacyGuestBundle extends ObjectValue {
  schemaVersion: 1;
  referenceTime: number;
}

export interface PlannedDecisionReceipt {
  decisionLogEntryHash: string;
  intentHash: string;
  policyHash: string;
  stateHash: string;
  decision: "BLOCK";
  violatedRuleIds: number[];
  referenceTime: number;
  verifierVersion: string;
  solverStatus: string;
}

export function buildTradeProofBundle(input: {
  intent: unknown;
  policy: unknown;
  state: unknown;
  evidence: unknown;
  receipt: unknown;
}): LegacyGuestBundle {
  const receipt = object(input.receipt);
  const state = withoutCommittedHash(input.state, "stateHash");
  return {
    schemaVersion: 1,
    referenceTime: typeof state.timestamp === "number" ? state.timestamp : 0,
    intent: withoutCommittedHash(input.intent, "intentHash"),
    policy: withoutCommittedHash(input.policy, "policyHash"),
    state,
    evidence: withoutCommittedHash(input.evidence, "evidenceRoot"),
    receiptBinding: {
      receiptId: receipt.receiptId,
      createdAt: receipt.createdAt,
    },
  };
}

export function buildDecisionProofBundle(input: {
  intent: unknown;
  policy: unknown;
  state: unknown;
  decisionLogEntryHash: string;
}): LegacyGuestBundle {
  const state = withoutCommittedHash(input.state, "stateHash");
  return {
    schemaVersion: 1,
    referenceTime: typeof state.timestamp === "number" ? state.timestamp : 0,
    intent: withoutCommittedHash(input.intent, "intentHash"),
    policy: withoutCommittedHash(input.policy, "policyHash"),
    state,
    decisionLogEntryHash: input.decisionLogEntryHash,
  };
}

export function planDecisionReceipt(input: {
  bundle: LegacyGuestBundle;
  decision: unknown;
  decisionLogEntryHash: string;
}):
  | { provable: true; receipt: PlannedDecisionReceipt; smtViolatedRuleIds: number[] }
  | { provable: false; reasonCode: string; detail?: string; guestRuleIds?: number[] } {
  const decision = object(input.decision);
  if (decision.solverStatus !== "sat" && decision.solverStatus !== "unsat") {
    return { provable: false, reasonCode: "OPERATIONAL_FAILURE" };
  }
  const output = deriveGuestOutput(input.bundle);
  const smtRules = Array.isArray(decision.violatedRuleIds)
    ? decision.violatedRuleIds.filter((value): value is number => typeof value === "number")
    : [];
  if (output.decisionAllow || output.violatedRuleIds.length === 0) {
    return {
      provable: false,
      reasonCode: "GUEST_DECISION_MISMATCH",
      guestRuleIds: output.violatedRuleIds,
    };
  }
  return {
    provable: true,
    smtViolatedRuleIds: smtRules,
    receipt: {
      decisionLogEntryHash: input.decisionLogEntryHash,
      intentHash: String(decision.intentHash),
      policyHash: String(decision.policyHash),
      stateHash: String(decision.stateHash),
      decision: "BLOCK",
      violatedRuleIds: output.violatedRuleIds,
      referenceTime: input.bundle.referenceTime,
      verifierVersion: "0.1.0",
      solverStatus: String(decision.solverStatus),
    },
  };
}
