import { z } from "zod";

export const Identifier = z.string().regex(/^[a-zA-Z0-9_-]+$/).max(128);
export const ActionRequestSchema = z.strictObject({
  action: z.string().trim().min(1).max(128),
  input: z.record(z.string(), z.json()),
  idempotencyKey: z.string().min(1).max(256),
});
export const ActionResultSchema = z.discriminatedUnion("decision", [
  z.object({
    decision: z.literal("ALLOW"),
    receiptId: Identifier,
    status: z.enum(["PENDING", "NON_PROVABLE", "DEV_UNVERIFIED"]),
    /** Phase 2 product status — honest mapping of engine state. */
    productStatus: z.enum(["allowed", "blocked", "proved", "cant_prove"]).optional(),
    capabilityId: z.string().optional(),
    intentHash: z.string().optional(),
    policyHash: z.string().optional(),
    decisionId: z.string().optional(),
  }),
  z.object({
    decision: z.literal("BLOCK"),
    violations: z.array(z.object({ ruleId: z.string(), reason: z.string() })).min(1),
    productStatus: z.literal("blocked").optional(),
    intentHash: z.string().optional(),
    policyHash: z.string().optional(),
    decisionId: z.string().optional(),
  }),
]);
export const ReceiptSchema = z.object({
  receiptId: Identifier,
  status: z.enum(["PENDING", "PROVED", "NON_PROVABLE", "INVALIDATED", "DEV_UNVERIFIED"]),
  productStatus: z.enum(["allowed", "blocked", "proved", "cant_prove"]).optional(),
  claim: z.string().optional(),
  reason: z.string().optional(),
  reasonCode: z.string().optional(),
}).passthrough();

export const PolicyRecordSchema = z.object({
  applicationId: Identifier,
  policyId: Identifier,
  version: z.number().int().positive(),
  status: z.enum(["DRAFT", "ACTIVE", "RETIRED"]),
  definition: z.record(z.string(), z.json()),
  policyHash: z.string().regex(/^0x[0-9a-f]{64}$/).optional(),
});

export const DecisionViewSchema = z.object({
  decisionId: z.string().optional(),
  decision: z.enum(["ALLOW", "BLOCK"]),
  intentHash: z.string(),
  policyHash: z.string(),
  stateHash: z.string().optional(),
  violatedRuleIds: z.array(z.union([z.number(), z.string()])),
  violations: z.array(z.object({ ruleId: z.string(), reason: z.string() })),
  createdAt: z.number().int().nonnegative().optional(),
});

export type ActionRequest = z.infer<typeof ActionRequestSchema>;
export type ActionResult = z.infer<typeof ActionResultSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
export type PolicyRecord = z.infer<typeof PolicyRecordSchema>;
export type DecisionView = z.infer<typeof DecisionViewSchema>;

export {
  ProductStatus,
  productStatusFromDecision,
  productStatusFromReceipt,
  PRODUCT_STATUS_GLOSSARY,
  type EngineReceiptStatus,
} from "./productStatus.js";
export type { ProductStatus as ProductStatusName } from "./productStatus.js";

// ponytail: initial cross-language model uses u64; widen the Rust model and vectors together.
const uint64 = z.string().max(20).regex(/^(0|[1-9][0-9]*)$/)
  .refine((value) => /^(0|[1-9][0-9]*)$/.test(value) && BigInt(value) <= 18446744073709551615n);

/** Isolated policy predicate. This is not an execution authorization or evidence claim. */
export const AmountCheckSchema = z.strictObject({
  amount: uint64,
  maxAmount: uint64,
  usedBudget: uint64,
  reservedBudget: uint64,
  budgetLimit: uint64,
  paused: z.boolean(),
});
export type AmountCheck = z.infer<typeof AmountCheckSchema>;
