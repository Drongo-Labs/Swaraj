import type { ActionRequest } from "@swaraj/contracts";
import { createHash } from "node:crypto";
import {
  serializeUnifiedAction,
  unifiedActionSigningPayload,
  type UnifiedAction,
} from "@swaraj/schemas";
import { recoverAddress } from "viem";

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
 * The action `signature` is verified when the mandate names an `agentSigner`
 * (see agentSignatureValid). A mandate without one trusts the API bearer token
 * alone, so the signature is only schema-validated there.
 */

/** Policy id the mandate registry reuses (the policy store persists mandates like policies). */
export const MANDATE_POLICY_ID = "mandate";

/** sha256 over the canonical unified action serialization (sorted keys, amounts as decimal strings). */
export function unifiedActionHash(action: UnifiedAction): string {
  return `0x${createHash("sha256").update(serializeUnifiedAction(action)).digest("hex")}`;
}

/** True when `action.signature` recovers to `signer`. Never throws: malformed means invalid. */
export async function agentSignatureValid(action: UnifiedAction, signer: string): Promise<boolean> {
  try {
    const hash = `0x${createHash("sha256").update(unifiedActionSigningPayload(action)).digest("hex")}` as const;
    const recovered = await recoverAddress({ hash, signature: action.signature as `0x${string}` });
    return recovered.toLowerCase() === signer.toLowerCase();
  } catch {
    return false;
  }
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
