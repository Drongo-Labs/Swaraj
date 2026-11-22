import { z } from "zod";
import {
  AtomicAmount,
  BoundedId,
  SafeUint,
  UnixMilliseconds,
  compareStrings,
  parseWith,
  requireStrictlyAscending,
} from "./primitives.js";
import { UnifiedActionType } from "./unifiedAction.js";

/** FORBID beats REQUIRE_APPROVAL, which beats PERMIT. */
export const MandateRuleEffect = z.enum(["PERMIT", "FORBID", "REQUIRE_APPROVAL"]);

export const MandateStringField = z.enum([
  "agent",
  "resource.venue",
  "resource.service",
  "resource.repo",
  "resource.objectType",
  "resource.objectId",
  "context.assetIn",
  "context.assetOut",
  "context.currency",
  "context.recipient",
  "context.branch",
  "context.commitHash",
  "context.environment",
  "context.originalPaymentId",
  "context.reason",
  "resource.app",
  "resource.target",
  "context.name",
]);

export const MandateAtomicField = z.literal("context.amount");
export const MandateIntegerField = z.enum(["context.slippageBps", "timestamp", "expiry"]);
export const MandateBooleanField = z.literal("context.hardDelete");

const PredicateString = z.string().min(1).max(256);
const StringEqualsPredicate = z.strictObject({
  field: MandateStringField,
  operator: z.literal("EQ"),
  value: PredicateString,
});
const StringInPredicate = z.strictObject({
  field: MandateStringField,
  operator: z.literal("IN"),
  values: z.array(PredicateString).min(1).max(128),
}).superRefine((predicate, ctx) =>
  requireStrictlyAscending(predicate.values, ctx, ["values"], "predicate values")
);
const AtomicPredicate = z.strictObject({
  field: MandateAtomicField,
  operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
  value: AtomicAmount,
});
const IntegerPredicate = z.strictObject({
  field: MandateIntegerField,
  operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
  value: SafeUint,
});
const BooleanPredicate = z.strictObject({
  field: MandateBooleanField,
  operator: z.literal("EQ"),
  value: z.boolean(),
});

/** APP_ACTION param predicates: address one named param by its type. */
const ParamName = z.string().min(1).max(64).regex(/^[A-Za-z][A-Za-z0-9_-]*$/);
const ParamPredicate = z.strictObject({
  field: z.literal("context.param"),
  name: ParamName,
  operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
  value: AtomicAmount,
});
const ParamStringPredicate = z.strictObject({
  field: z.literal("context.paramString"),
  name: ParamName,
  operator: z.literal("EQ"),
  value: PredicateString,
});
const ParamBoolPredicate = z.strictObject({
  field: z.literal("context.paramBool"),
  name: ParamName,
  operator: z.literal("EQ"),
  value: z.boolean(),
});

export const MandatePredicateSchema = z.union([
  StringEqualsPredicate,
  StringInPredicate,
  AtomicPredicate,
  IntegerPredicate,
  BooleanPredicate,
  ParamPredicate,
  ParamStringPredicate,
  ParamBoolPredicate,
]);

const commonFields = new Set(["agent", "timestamp", "expiry"]);
const fieldsByAction: Record<z.infer<typeof UnifiedActionType>, ReadonlySet<string>> = {
  SPOT_TRADE: new Set(["resource.venue", "context.amount", "context.assetIn", "context.assetOut", "context.slippageBps"]),
  PAYMENT: new Set(["resource.service", "context.amount", "context.currency", "context.recipient"]),
  DEPLOY: new Set(["resource.repo", "context.branch", "context.commitHash", "context.environment"]),
  DELETE: new Set(["resource.service", "resource.objectType", "resource.objectId", "context.hardDelete", "context.reason"]),
  REFUND: new Set(["resource.service", "context.amount", "context.currency", "context.recipient", "context.originalPaymentId"]),
  APP_ACTION: new Set(["resource.app", "resource.target", "context.name", "context.param", "context.paramString", "context.paramBool"]),
};

export const MandateRuleSchema = z.strictObject({
  ruleId: BoundedId,
  effect: MandateRuleEffect,
  action: UnifiedActionType,
  predicates: z.array(MandatePredicateSchema).max(32),
}).superRefine((rule, ctx) => {
  const actionFields = fieldsByAction[rule.action];
  for (const [index, predicate] of rule.predicates.entries()) {
    if (!commonFields.has(predicate.field) && !actionFields.has(predicate.field)) {
      ctx.addIssue({
        code: "custom",
        path: ["predicates", index, "field"],
        message: `${predicate.field} is not valid for ${rule.action}`,
      });
    }
  }
});

/** Per-agent spend cap for PAYMENT / REFUND. Optional; existing mandates omit it. */
export const MandateBudgetSchema = z.strictObject({
  budgetId: BoundedId,
  action: z.enum(["PAYMENT", "REFUND"]),
  currency: z.string().min(1).max(64),
  window: z.enum(["DAILY", "WEEKLY"]),
  limit: AtomicAmount,
});

export const AgentMandateSchema = z.strictObject({
  mandateId: BoundedId,
  version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  agent: z.union([z.literal("*"), z.string().min(1).max(128).regex(/^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/)]),
  /** When set, every action must carry a valid signature from this secp256k1 address. */
  agentSigner: z.string().regex(/^0x[0-9a-fA-F]{40}$/).optional(),
  /** When set, actions may only reach programs certified by this secp256k1 address. */
  programCertifier: z.string().regex(/^0x[0-9a-fA-F]{40}$/).optional(),
  defaultEffect: z.literal("DENY"),
  validFrom: UnixMilliseconds,
  validUntil: UnixMilliseconds,
  rules: z.array(MandateRuleSchema).max(512),
  /** Daily/weekly spend caps; budgetIds must be strictly ascending. */
  budgets: z.array(MandateBudgetSchema).max(16).optional(),
}).superRefine((mandate, ctx) => {
  if (mandate.validUntil <= mandate.validFrom) {
    ctx.addIssue({ code: "custom", path: ["validUntil"], message: "validUntil must be after validFrom" });
  }
  const ids = mandate.rules.map((rule) => rule.ruleId);
  requireStrictlyAscending(ids, ctx, ["rules"], "rule ids");
  if (mandate.budgets) {
    requireStrictlyAscending(
      mandate.budgets.map((budget) => budget.budgetId),
      ctx,
      ["budgets"],
      "budget ids",
    );
  }
});

export type MandateRuleEffect = z.infer<typeof MandateRuleEffect>;
export type MandatePredicate = z.output<typeof MandatePredicateSchema>;
export type MandateRule = z.output<typeof MandateRuleSchema>;
export type MandateBudget = z.output<typeof MandateBudgetSchema>;
export type AgentMandate = z.output<typeof AgentMandateSchema>;
export type AgentMandateJson = z.input<typeof AgentMandateSchema>;

export const parseAgentMandate = (input: unknown): AgentMandate =>
  parseWith(AgentMandateSchema, input, "AgentMandate");

export function normalizeAgentMandate<
  T extends { rules: Array<{ ruleId: string }>; budgets?: Array<{ budgetId: string }> },
>(raw: T): T {
  const next: T = {
    ...raw,
    rules: [...raw.rules].sort((left, right) => compareStrings(left.ruleId, right.ruleId)),
  };
  if (raw.budgets) {
    next.budgets = [...raw.budgets].sort((left, right) => compareStrings(left.budgetId, right.budgetId));
  }
  return next;
}
