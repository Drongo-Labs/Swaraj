import { z } from "zod";
import {
  AtomicAmount,
  BoundedId,
  Bps,
  HexHash,
  IdempotencyKey,
  SignatureHex,
  UnixMilliseconds,
  parseWith,
} from "./primitives.js";

/** Stable action vocabulary. APP_ACTION lets apps add actions without a schema change. */
export const UnifiedActionType = z.enum([
  "SPOT_TRADE",
  "PAYMENT",
  "DEPLOY",
  "DELETE",
  "REFUND",
  "APP_ACTION",
]);

const AgentIdentifier = z.string().min(1).max(128).regex(/^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/);
const ResourceIdentifier = z.string().min(1).max(256).regex(/^[A-Za-z0-9][A-Za-z0-9._:@/+\-]*$/);
const CurrencyCode = z.string().regex(/^[A-Z][A-Z0-9]{1,11}$/);
const CommitHash = z.string().regex(/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/);

const common = {
  intentId: BoundedId,
  agent: AgentIdentifier,
  policyHash: HexHash,
  timestamp: UnixMilliseconds,
  expiry: UnixMilliseconds,
  idempotencyKey: IdempotencyKey,
  signature: SignatureHex,
  /** Whether outside content (tool results, web pages) reached the agent before this action.
   * Recorded by the MCP gateway; the API blocks a clean claim when its own record says otherwise. */
  provenance: z.strictObject({ untrusted: z.boolean() }).optional(),
};

const SpotTradeActionSchema = z.strictObject({
  ...common,
  action: z.literal("SPOT_TRADE"),
  resource: z.strictObject({ venue: ResourceIdentifier }),
  context: z.strictObject({
    amount: AtomicAmount,
    assetIn: ResourceIdentifier,
    assetOut: ResourceIdentifier,
    slippageBps: Bps,
  }).refine((context) => context.assetIn !== context.assetOut, {
    path: ["assetOut"],
    message: "assetIn and assetOut must differ",
  }),
});

const PaymentActionSchema = z.strictObject({
  ...common,
  action: z.literal("PAYMENT"),
  resource: z.strictObject({ service: ResourceIdentifier }),
  context: z.strictObject({
    amount: AtomicAmount,
    currency: CurrencyCode,
    recipient: ResourceIdentifier,
  }),
});

const DeployActionSchema = z.strictObject({
  ...common,
  action: z.literal("DEPLOY"),
  resource: z.strictObject({ repo: ResourceIdentifier }),
  context: z.strictObject({
    branch: ResourceIdentifier,
    commitHash: CommitHash,
    environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  }),
});

const DeleteActionSchema = z.strictObject({
  ...common,
  action: z.literal("DELETE"),
  resource: z.strictObject({
    service: ResourceIdentifier,
    objectType: z.enum(["FILE", "RECORD", "DEPLOYMENT"]),
    objectId: ResourceIdentifier,
  }),
  context: z.strictObject({
    hardDelete: z.boolean(),
    reason: z.string().min(1).max(256).optional(),
  }),
});

const RefundActionSchema = z.strictObject({
  ...common,
  action: z.literal("REFUND"),
  resource: z.strictObject({ service: ResourceIdentifier }),
  context: z.strictObject({
    amount: AtomicAmount,
    currency: CurrencyCode,
    recipient: ResourceIdentifier,
    originalPaymentId: BoundedId,
  }),
});

/** Generic app action with up to 16 params. Integers are decimal strings, so hashes stay float-free. */
const AppActionName = z.string().min(1).max(64).regex(/^[A-Za-z][A-Za-z0-9_-]*$/);
export const AppParamName = z.string().min(1).max(64).regex(/^[A-Za-z][A-Za-z0-9_-]*$/);
export const AppParamValue = z.union([AtomicAmount, z.string().min(1).max(256), z.boolean()]);

const AppActionSchema = z.strictObject({
  ...common,
  action: z.literal("APP_ACTION"),
  resource: z.strictObject({
    app: ResourceIdentifier,
    target: ResourceIdentifier,
  }),
  context: z.strictObject({
    name: AppActionName,
    params: z.record(AppParamName, AppParamValue),
  }).superRefine((context, ctx) => {
    const entries = Object.entries(context.params);
    if (entries.length > 16) {
      ctx.addIssue({ code: "custom", path: ["params"], message: "at most 16 params" });
    }
  }),
});

export const UnifiedActionSchema = z.discriminatedUnion("action", [
  SpotTradeActionSchema,
  PaymentActionSchema,
  DeployActionSchema,
  DeleteActionSchema,
  RefundActionSchema,
  AppActionSchema,
]).superRefine((action, ctx) => {
  if (action.expiry <= action.timestamp) {
    ctx.addIssue({ code: "custom", path: ["expiry"], message: "expiry must be after timestamp" });
  }
});

export type UnifiedAction = z.output<typeof UnifiedActionSchema>;
export type UnifiedActionJson = z.input<typeof UnifiedActionSchema>;
export type UnifiedActionType = z.infer<typeof UnifiedActionType>;

export const parseUnifiedAction = (input: unknown): UnifiedAction =>
  parseWith(UnifiedActionSchema, input, "UnifiedAction");

function wireValue(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(wireValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, wireValue(entry)]),
    );
  }
  return value;
}

/** Canonical JSON: keys sorted recursively and atomic amounts emitted as decimal strings. */
export function serializeUnifiedAction(action: UnifiedAction): string {
  return JSON.stringify(wireValue(action));
}

export function deserializeUnifiedAction(serialized: string): UnifiedAction {
  return parseUnifiedAction(JSON.parse(serialized) as unknown);
}

/** Canonical payload signed by the agent; excludes the signature itself. */
export function unifiedActionSigningPayload(action: UnifiedAction): string {
  const { signature: _signature, ...unsigned } = action;
  return JSON.stringify(wireValue(unsigned));
}
