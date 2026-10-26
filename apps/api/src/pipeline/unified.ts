import type { ActionRequest } from "@swaraj/contracts";
import { createHash } from "node:crypto";
import {
  serializeUnifiedAction,
  type UnifiedAction,
} from "@swaraj/schemas";

/**
 * Task 2.1 — gateway input handling for the unified action format.
 *
 * `POST /v1/applications/:applicationId/unified-actions` accepts a strict
 * `UnifiedAction` (who/what/resource/context + mandate binding), evaluates it
 * against the application's ACTIVE Agent Mandate with the same rules engine
 * as every other decision (permit/forbid, default deny, fail closed), and —
 * for SPOT_TRADE — feeds the existing execution/receipt pipeline by
 * converting the action into the legacy trade request the SMT gateway and
 * adapters consume.
 *
 * The action `signature` is schema-validated but not cryptographically
 * verified yet: agent key registration/verification is out of 2.1 scope.
 */

/** Policy id the mandate registry reuses (the policy store persists mandates like policies). */
export const MANDATE_POLICY_ID = "mandate";

/** sha256 over the canonical unified action serialization (sorted keys, amounts as decimal strings). */
export function unifiedActionHash(action: UnifiedAction): string {
  return `0x${createHash("sha256").update(serializeUnifiedAction(action)).digest("hex")}`;
}

/**
 * Convert a SPOT_TRADE unified action into the legacy ActionRequest the
 * pipeline (SMT gateway, capability, execution, receipts) consumes. Other
 * action types have no execution adapter yet and are mandate-only.
 */
export function unifiedActionToActionRequest(
  action: UnifiedAction,
  policyVersion: number,
): ActionRequest | undefined {
  if (action.action !== "SPOT_TRADE") return undefined;
  return {
    action: "trade.spot",
    idempotencyKey: action.idempotencyKey,
    input: {
      policyId: "policy_demo",
      intent: {
        intentId: action.intentId,
        actionType: "SPOT_TRADE",
        venue: action.resource.venue,
        assetIn: action.context.assetIn,
        assetOut: action.context.assetOut,
        amount: action.context.amount.toString(),
        maxSlippageBps: action.context.slippageBps,
        expiry: Math.floor(action.expiry / 1000),
        idempotencyKey: action.idempotencyKey,
        policyVersion,
      },
    },
  };
}
