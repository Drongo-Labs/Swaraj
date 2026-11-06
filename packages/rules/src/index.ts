import {
  AgentMandateSchema,
  UnifiedActionSchema,
  type AgentMandate,
  type MandatePredicate,
  type MandateRule,
  type UnifiedAction,
} from "@swaraj/schemas";

export type MandateDecisionReason =
  | "PERMIT_MATCH"
  | "FORBID_MATCH"
  | "APPROVAL_REQUIRED"
  | "DEFAULT_DENY"
  | "MANDATE_INACTIVE"
  | "SUBJECT_MISMATCH"
  | "INVALID_MANDATE"
  | "INVALID_ACTION"
  /** The mandate names an agentSigner and the action's signature does not verify. */
  | "INVALID_SIGNATURE"
  /** The mandate names a programCertifier and the target has no valid certificate. */
  | "UNVERIFIED_PROGRAM"
  /** Dual-engine cross-check failed: the predicate engine and Z3 disagree,
   * or the solver could not settle. Fail closed. */
  | "ENGINE_DISAGREEMENT";

export interface MandateDecision {
  decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL";
  reason: MandateDecisionReason;
  matchedRuleIds: string[];
  matchedPermitRuleIds: string[];
  matchedForbidRuleIds: string[];
  /** Present only on NEEDS_APPROVAL. */
  matchedApprovalRuleIds?: string[];
}

function blocked(reason: MandateDecisionReason): MandateDecision {
  return {
    decision: "BLOCK",
    reason,
    matchedRuleIds: [],
    matchedPermitRuleIds: [],
    matchedForbidRuleIds: [],
  };
}

type Comparable = string | number | bigint | boolean | undefined;

function fieldValue(action: UnifiedAction, predicate: MandatePredicate): Comparable {
  const field = predicate.field;
  switch (field) {
    case "agent": return action.agent;
    case "timestamp": return action.timestamp;
    case "expiry": return action.expiry;
    case "resource.venue": return action.action === "SPOT_TRADE" ? action.resource.venue : undefined;
    case "resource.service": return action.action === "PAYMENT" || action.action === "DELETE" || action.action === "REFUND"
      ? action.resource.service : undefined;
    case "resource.repo": return action.action === "DEPLOY" ? action.resource.repo : undefined;
    case "resource.objectType": return action.action === "DELETE" ? action.resource.objectType : undefined;
    case "resource.objectId": return action.action === "DELETE" ? action.resource.objectId : undefined;
    case "context.amount": return action.action === "SPOT_TRADE" || action.action === "PAYMENT" || action.action === "REFUND"
      ? action.context.amount : undefined;
    case "context.assetIn": return action.action === "SPOT_TRADE" ? action.context.assetIn : undefined;
    case "context.assetOut": return action.action === "SPOT_TRADE" ? action.context.assetOut : undefined;
    case "context.slippageBps": return action.action === "SPOT_TRADE" ? action.context.slippageBps : undefined;
    case "context.currency": return action.action === "PAYMENT" || action.action === "REFUND"
      ? action.context.currency : undefined;
    case "context.recipient": return action.action === "PAYMENT" || action.action === "REFUND"
      ? action.context.recipient : undefined;
    case "context.branch": return action.action === "DEPLOY" ? action.context.branch : undefined;
    case "context.commitHash": return action.action === "DEPLOY" ? action.context.commitHash : undefined;
    case "context.environment": return action.action === "DEPLOY" ? action.context.environment : undefined;
    case "context.hardDelete": return action.action === "DELETE" ? action.context.hardDelete : undefined;
    case "context.reason": return action.action === "DELETE" ? action.context.reason : undefined;
    case "context.originalPaymentId": return action.action === "REFUND" ? action.context.originalPaymentId : undefined;
    case "resource.app": return action.action === "APP_ACTION" ? action.resource.app : undefined;
    case "resource.target": return action.action === "APP_ACTION" ? action.resource.target : undefined;
    case "context.name": return action.action === "APP_ACTION" ? action.context.name : undefined;
    case "context.param":
    case "context.paramString":
    case "context.paramBool": {
      if (action.action !== "APP_ACTION") return undefined;
      const value = action.context.params[predicate.name];
      if (value === undefined) return undefined;
      // The predicate kind fixes the expected param type; a mismatched type
      // fails closed (the predicate does not match) rather than comparing
      // across types.
      if (field === "context.param") return typeof value === "bigint" ? value : undefined;
      if (field === "context.paramString") return typeof value === "string" ? value : undefined;
      return typeof value === "boolean" ? value : undefined;
    }
  }
}

function compare(left: number | bigint, operator: "EQ" | "LT" | "LTE" | "GT" | "GTE", right: number | bigint): boolean {
  switch (operator) {
    case "EQ": return left === right;
    case "LT": return left < right;
    case "LTE": return left <= right;
    case "GT": return left > right;
    case "GTE": return left >= right;
  }
}

export function predicateMatches(action: UnifiedAction, predicate: MandatePredicate): boolean {
  const actual = fieldValue(action, predicate);
  if (actual === undefined) return false;
  if (predicate.operator === "IN") {
    return typeof actual === "string" && predicate.values.includes(actual);
  }
  if (typeof predicate.value === "number" || typeof predicate.value === "bigint") {
    return (typeof actual === "number" || typeof actual === "bigint")
      && typeof actual === typeof predicate.value
      && compare(actual, predicate.operator, predicate.value);
  }
  return predicate.operator === "EQ" && actual === predicate.value;
}

export function ruleMatches(action: UnifiedAction, rule: MandateRule): boolean {
  return action.action === rule.action
    && rule.predicates.every((predicate) => predicateMatches(action, predicate));
}

/** FORBID first, then REQUIRE_APPROVAL, then PERMIT. No match is BLOCK (default deny). */
export function evaluateParsedMandate(mandate: AgentMandate, action: UnifiedAction): MandateDecision {
  if (action.timestamp < mandate.validFrom || action.timestamp >= mandate.validUntil) {
    return blocked("MANDATE_INACTIVE");
  }
  if (mandate.agent !== "*" && mandate.agent !== action.agent) {
    return blocked("SUBJECT_MISMATCH");
  }

  const matching = mandate.rules.filter((rule) => ruleMatches(action, rule));
  const matchedForbidRuleIds = matching
    .filter((rule) => rule.effect === "FORBID")
    .map((rule) => rule.ruleId);
  const matchedPermitRuleIds = matching
    .filter((rule) => rule.effect === "PERMIT")
    .map((rule) => rule.ruleId);

  if (matchedForbidRuleIds.length > 0) {
    return {
      decision: "BLOCK",
      reason: "FORBID_MATCH",
      matchedRuleIds: matchedForbidRuleIds,
      matchedPermitRuleIds,
      matchedForbidRuleIds,
    };
  }
  const matchedApprovalRuleIds = matching
    .filter((rule) => rule.effect === "REQUIRE_APPROVAL")
    .map((rule) => rule.ruleId);
  if (matchedApprovalRuleIds.length > 0) {
    return {
      decision: "NEEDS_APPROVAL",
      reason: "APPROVAL_REQUIRED",
      matchedRuleIds: matchedApprovalRuleIds,
      matchedPermitRuleIds,
      matchedForbidRuleIds,
      matchedApprovalRuleIds,
    };
  }
  if (matchedPermitRuleIds.length > 0) {
    return {
      decision: "ALLOW",
      reason: "PERMIT_MATCH",
      matchedRuleIds: matchedPermitRuleIds,
      matchedPermitRuleIds,
      matchedForbidRuleIds,
    };
  }
  return blocked("DEFAULT_DENY");
}

/** Parse at the trust boundary and fail closed without exposing rejected values. */
export function evaluateMandate(mandateInput: unknown, actionInput: unknown): MandateDecision {
  const mandate = AgentMandateSchema.safeParse(mandateInput);
  if (!mandate.success) return blocked("INVALID_MANDATE");
  const action = UnifiedActionSchema.safeParse(actionInput);
  if (!action.success) return blocked("INVALID_ACTION");
  return evaluateParsedMandate(mandate.data, action.data);
}
export * from "./crosscheck.js";
export { diffMandates, lintMandate, ruleCanNeverMatch, type MandateDiff, type MandateIssue } from "./analysis.js";
