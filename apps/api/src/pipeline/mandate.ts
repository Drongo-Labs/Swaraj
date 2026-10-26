import { createHash } from "node:crypto";
import type { Hex, Signer } from "@swaraj/crypto";
import { evaluateParsedMandate, type MandateDecision } from "@swaraj/rules";
import {
  AgentMandateSchema,
  UnifiedActionSchema,
  unifiedActionSigningPayload,
  type AgentMandate,
  type UnifiedAction,
} from "@swaraj/schemas";
import type {
  PolicyDecision,
  PolicyGateway,
  PolicyGatewayInput,
  PolicyViolation,
} from "@swaraj/smt";

/**
 * Task 2.2 — connect the permit/forbid rules engine (`@swaraj/rules`) to the
 * gateway decision path. Every action must survive BOTH gates: the mandate
 * engine contributes FORBID_MATCH / DEFAULT_DENY (fail-closed) decisions on
 * top of the SMT policy gateway, which keeps the existing provable
 * decision/receipt pipeline intact.
 *
 * Adapter seam: until the gateway accepts the unified action format directly
 * (task 2.1), the legacy trade intent is converted to a SPOT_TRADE
 * `UnifiedAction` and the mandate is derived from the same ACTIVE policy
 * definition the SMT gateway evaluates, so the two gates stay consistent.
 */

/** Agent the adapter signs converted intents for; task 2.1 binds the real agent. */
export const DEMO_AGENT = "agent:demo";

const ZERO_SIGNATURE = ("0x" + "00".repeat(65)) as UnifiedAction["signature"];
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function asObject(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Canonical JSON — must stay identical to the SMT gateway's digest algorithm. */
function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    if (typeof value === "bigint") return JSON.stringify(value.toString());
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
}

/** sha256 over the canonical JSON — same hashes the SMT gateway would compute. */
function stableDigest(value: unknown): string {
  return `0x${createHash("sha256").update(stableJson(value)).digest("hex")}`;
}

function decimalString(value: unknown): string | undefined {
  if (typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value)) return value;
  if (typeof value === "bigint") return value.toString();
  return undefined;
}

function safeInt(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

function sanitizeId(raw: string, fallback: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * Derive an Agent Mandate from the ACTIVE policy-profile definition the SMT
 * gateway evaluates: permit known venues, forbid over the per-action amount
 * and slippage caps, deny everything else. Fail closed on a malformed policy:
 * a mandate with no permit rule default-denies every action.
 */
export function agentMandateFromPolicyProfile(policy: Record<string, unknown>): Record<string, unknown> {
  const version = safeInt(policy.policyVersion) ?? 1;
  const rules: Array<Record<string, unknown>> = [];
  const maxAmount = decimalString(policy.maxAmountPerAction);
  if (maxAmount !== undefined) {
    rules.push({
      ruleId: "forbid_trade_amount",
      effect: "FORBID",
      action: "SPOT_TRADE",
      predicates: [{ field: "context.amount", operator: "GT", value: maxAmount }],
    });
  }
  const maxSlippage = safeInt(policy.maxSlippageBps);
  if (maxSlippage !== undefined) {
    rules.push({
      ruleId: "forbid_trade_slippage",
      effect: "FORBID",
      action: "SPOT_TRADE",
      predicates: [{ field: "context.slippageBps", operator: "GT", value: maxSlippage }],
    });
  }
  const venues = Array.isArray(policy.allowedVenues) && policy.allowedVenues.every((v) => typeof v === "string")
    ? [...new Set(policy.allowedVenues as string[])].sort()
    : undefined;
  if (venues !== undefined && venues.length > 0) {
    rules.push({
      ruleId: "permit_trade_venue",
      effect: "PERMIT",
      action: "SPOT_TRADE",
      predicates: [{ field: "resource.venue", operator: "IN", values: venues }],
    });
  }
  const policyExpiry = safeInt(policy.policyExpiry);
  const validUntil =
    policyExpiry !== undefined && policyExpiry > 0 && policyExpiry < 4102444800 // looks like epoch seconds
      ? policyExpiry * 1000
      : Date.now() + ONE_YEAR_MS;
  return {
    mandateId: `mandate_policy_v${version}`,
    version: 1,
    agent: "*",
    defaultEffect: "DENY",
    validFrom: 0,
    validUntil,
    rules,
  };
}

/** Convert a legacy trade intent into a SPOT_TRADE unified action. Undefined if it cannot be represented. */
export async function unifiedActionFromIntent(
  intent: Record<string, unknown>,
  options: { policyHash: string; signer: Signer; now?: number },
): Promise<UnifiedAction | undefined> {
  const amount = decimalString(intent.amount);
  const assetIn = typeof intent.assetIn === "string" ? intent.assetIn : undefined;
  const assetOut = typeof intent.assetOut === "string" ? intent.assetOut : undefined;
  const slippageBps = safeInt(intent.maxSlippageBps);
  const venue = typeof intent.venue === "string" ? intent.venue : "UNISWAP_V3_BASE";
  if (amount === undefined || assetIn === undefined || assetOut === undefined || slippageBps === undefined) {
    return undefined;
  }
  const idempotencyKey =
    typeof intent.idempotencyKey === "string"
      ? sanitizeId(intent.idempotencyKey, "idem")
      : `idem_${stableDigest(intent).slice(2, 34)}`;
  const now = options.now ?? Date.now();
  const draft = {
    intentId: sanitizeId(
      typeof intent.intentId === "string" ? intent.intentId : `intent_${idempotencyKey}`,
      "intent",
    ),
    agent: DEMO_AGENT,
    action: "SPOT_TRADE",
    resource: { venue },
    context: { amount, assetIn, assetOut, slippageBps },
    policyHash: options.policyHash,
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey,
    signature: ZERO_SIGNATURE,
  };
  const parsed = UnifiedActionSchema.safeParse(draft);
  if (!parsed.success) return undefined;
  // The adapter signs the converted action so the intent binding is attested;
  // task 2.1 replaces this with the agent-supplied signature.
  const payload = unifiedActionSigningPayload(parsed.data);
  const digest = `0x${createHash("sha256").update(payload).digest("hex")}`;
  const signature = await options.signer.signDigest(digest as Hex);
  return { ...parsed.data, signature: signature as UnifiedAction["signature"] };
}

function mandateViolations(decision: MandateDecision): PolicyViolation[] {
  const matched =
    decision.reason === "FORBID_MATCH"
      ? decision.matchedForbidRuleIds
      : [...decision.matchedForbidRuleIds, ...decision.matchedPermitRuleIds];
  const detail = matched.length > 0 ? ` (${matched.join(", ")})` : "";
  return [{ ruleId: 0, reason: `MANDATE:${decision.reason}${detail}` }];
}

export type MandatePolicyGateway = {
  /**
   * @param input SMT gateway input (policy/state/intent)
   * @param unifiedAction when the request was a unified action, evaluate it
   *   directly instead of converting the legacy intent (task 2.1 path)
   * @param mandateDefinition when the application has a registered Agent
   *   Mandate, evaluate against it instead of deriving one from the policy
   */
  check(
    input: PolicyGatewayInput,
    unifiedAction?: UnifiedAction,
    mandateDefinition?: unknown,
  ): Promise<PolicyDecision>;
};

export type MandatePolicyGateOptions = {
  base: Pick<PolicyGateway, "check">;
  signer: Signer;
};

/**
 * Mandate-first semantics over the SMT gateway: every action must survive BOTH
 * gates. The SMT gateway still anchors its decision in the decision log and
 * keeps the Phase 9 provable Decision Receipt path (solverStatus, violated
 * rule ids); a mandate BLOCK is layered on top, so FORBID_MATCH and
 * DEFAULT_DENY reasons surface in the violations alongside the SMT reasons.
 * A mandate-only block (SMT ALLOW) stays honest: the guest bundle cannot
 * reproduce it, so it records as a NON_PROVABLE Decision Receipt.
 */
export function createMandatePolicyGate(options: MandatePolicyGateOptions): MandatePolicyGateway {
  return {
    async check(
      input: PolicyGatewayInput,
      unifiedAction?: UnifiedAction,
      mandateDefinition?: unknown,
    ): Promise<PolicyDecision> {
      const baseDecision = await options.base.check(input);
      const policy = asObject(input.policy);
      const intent = asObject(input.intent);
      const action =
        unifiedAction ??
        (intent !== undefined
          ? await unifiedActionFromIntent(intent, {
              policyHash: baseDecision.policyHash,
              signer: options.signer,
            })
          : undefined);
      // Parse the mandate once; evaluateParsedMandate takes the typed action
      // (schema output, amounts as bigint) without re-parsing it.
      const mandate = AgentMandateSchema.safeParse(
        mandateDefinition ?? agentMandateFromPolicyProfile(policy ?? {}),
      );
      const evaluated: MandateDecision = (() => {
        if (action === undefined) {
          return {
            decision: "BLOCK",
            reason: "INVALID_ACTION",
            matchedRuleIds: [],
            matchedPermitRuleIds: [],
            matchedForbidRuleIds: [],
          };
        }
        if (!mandate.success) {
          return {
            decision: "BLOCK",
            reason: "INVALID_MANDATE",
            matchedRuleIds: [],
            matchedPermitRuleIds: [],
            matchedForbidRuleIds: [],
          };
        }
        return evaluateParsedMandate(mandate.data as AgentMandate, action);
      })();
      if (evaluated.decision === "ALLOW") {
        return baseDecision;
      }
      return {
        ...baseDecision,
        decision: "BLOCK",
        violations: [...mandateViolations(evaluated), ...baseDecision.violations],
      };
    },
  };
}
