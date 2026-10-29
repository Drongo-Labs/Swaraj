import { z } from "zod";

/**
 * Local mirror of Swaraj's Agent Mandate wire format
 * (packages/schemas/src/agentMandate.ts) for the subset Zunno uses. The real
 * validation happens at `POST /v1/applications/:id/mandates`; this mirror
 * keeps the fixture honest offline and documents the rule vocabulary.
 */

const BoundedId = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
const AtomicAmount = z.string().max(78).regex(/^(0|[1-9][0-9]*)$/);
const ResourceIdentifier = z.string().min(1).max(256).regex(/^[A-Za-z0-9][A-Za-z0-9._:@/+\-]*$/);
const CurrencyCode = z.string().regex(/^[A-Z][A-Z0-9]{1,11}$/);
const SafeUint = z.number().int().nonnegative();

export const MandatePredicateSchema = z.union([
  z.strictObject({
    field: z.enum(["agent", "resource.service", "context.currency", "context.recipient"]),
    operator: z.literal("EQ"),
    value: z.string().min(1).max(256),
  }),
  z.strictObject({
    field: z.literal("context.amount"),
    operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
    value: AtomicAmount,
  }),
  z.strictObject({
    field: z.enum(["context.handIndex", "context.cardValue", "context.chosenColor"]),
    operator: z.enum(["EQ", "LT", "LTE", "GT", "GTE"]),
    value: SafeUint,
  }),
]);

export const MandateRuleSchema = z.strictObject({
  ruleId: BoundedId,
  effect: z.enum(["PERMIT", "FORBID"]),
  action: z.enum(["PAYMENT", "PLAY_CARD", "DRAW_CARD"]),
  predicates: z.array(MandatePredicateSchema).max(32),
});

export const AgentMandateWireSchema = z.strictObject({
  mandateId: BoundedId,
  version: z.number().int().positive(),
  rules: z.array(MandateRuleSchema).min(1),
}).superRefine((mandate, ctx) => {
  const ids = new Set<string>();
  for (const [index, rule] of mandate.rules.entries()) {
    if (ids.has(rule.ruleId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rules", index, "ruleId"], message: "duplicate ruleId" });
    }
    ids.add(rule.ruleId);
  }
});

export type AgentMandateWire = z.infer<typeof AgentMandateWireSchema>;
export type MandatePredicate = z.infer<typeof MandatePredicateSchema>;
export type MandateRule = z.infer<typeof MandateRuleSchema>;
export type { ResourceIdentifier, CurrencyCode };
