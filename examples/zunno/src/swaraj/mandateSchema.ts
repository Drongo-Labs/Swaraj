import { z } from "zod";

/**
 * Local mirror of Swaraj's Agent Mandate wire format
 * (packages/schemas/src/agentMandate.ts) for the subset Zunno uses. The real
 * validation happens at `POST /v1/applications/:id/mandates`; this mirror
 * keeps the fixture honest offline and documents the rule vocabulary,
 * including the generic APP_ACTION param predicates.
 */

const BoundedId = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
const AtomicAmount = z.string().max(78).regex(/^(0|[1-9][0-9]*)$/);
const ResourceIdentifier = z.string().min(1).max(256).regex(/^[A-Za-z0-9][A-Za-z0-9._:@/+\-]*$/);
const CurrencyCode = z.string().regex(/^[A-Z][A-Z0-9]{1,11}$/);
const UnixMilliseconds = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const PredicateString = z.string().min(1).max(256);
const ParamName = z.string().min(1).max(64).regex(/^[A-Za-z][A-Za-z0-9_-]*$/);
const compareStrings = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const ascending = (values: string[]) => values.every((value, i) => i === 0 || compareStrings(values[i - 1]!, value) < 0);

const MandateStringField = z.enum([
  "agent",
  "resource.service",
  "resource.app",
  "resource.target",
  "context.currency",
  "context.recipient",
  "context.name",
]);

export const MandatePredicateSchema = z.union([
  z.strictObject({
    field: MandateStringField,
    operator: z.literal("EQ"),
    value: PredicateString,
  }),
  z.strictObject({
    field: MandateStringField,
    operator: z.literal("IN"),
    values: z.array(PredicateString).min(1).max(128),
  }).refine((p) => ascending(p.values), { message: "predicate values must be strictly ascending" }),
  z.strictObject({
    field: z.literal("context.amount"),
    operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
    value: AtomicAmount,
  }),
  z.strictObject({
    field: z.literal("context.param"),
    name: ParamName,
    operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
    value: AtomicAmount,
  }),
  z.strictObject({
    field: z.literal("context.paramString"),
    name: ParamName,
    operator: z.literal("EQ"),
    value: PredicateString,
  }),
  z.strictObject({
    field: z.literal("context.paramBool"),
    name: ParamName,
    operator: z.literal("EQ"),
    value: z.boolean(),
  }),
]);

export const MandateRuleSchema = z.strictObject({
  ruleId: BoundedId,
  effect: z.enum(["PERMIT", "FORBID"]),
  action: z.enum(["PAYMENT", "APP_ACTION"]),
  predicates: z.array(MandatePredicateSchema).max(32),
});

export const AgentMandateWireSchema = z
  .strictObject({
    mandateId: BoundedId,
    version: z.number().int().positive(),
    agent: z.union([z.literal("*"), z.string().min(1).max(128)]),
    defaultEffect: z.literal("DENY"),
    validFrom: UnixMilliseconds,
    validUntil: UnixMilliseconds,
    rules: z.array(MandateRuleSchema).min(1),
  })
  .superRefine((mandate, ctx) => {
    if (mandate.validUntil <= mandate.validFrom) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["validUntil"], message: "validUntil must be after validFrom" });
    }
    const ids = mandate.rules.map((rule) => rule.ruleId);
    if (!ascending(ids)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rules"], message: "rule ids must be strictly ascending" });
    }
  });

export type AgentMandateWire = z.infer<typeof AgentMandateWireSchema>;
export type MandatePredicate = z.infer<typeof MandatePredicateSchema>;
export type MandateRule = z.infer<typeof MandateRuleSchema>;
export type { ResourceIdentifier, CurrencyCode };
