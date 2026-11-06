import type { UnifiedAction } from "@swaraj/schemas";
import { createNearVenueAdapter } from "./evidence.js";
import type { NearExecution, NearExecutionRef } from "./types.js";

/** True when the recorded transaction targets exactly what the action approved. */
export function nearExecutionMatchesAction(near: NearExecution, action: UnifiedAction): boolean {
  const { expect } = near;
  if (expect.kind === "ref_swap") {
    return action.action === "SPOT_TRADE"
      && expect.tokenIn === action.context.assetIn
      && expect.tokenOut === action.context.assetOut
      && expect.amount === action.context.amount.toString();
  }
  return action.action === "PAYMENT"
    && expect.receiverId === action.context.recipient
    && expect.amount === action.context.amount.toString();
}

/** Re-reads the transaction from chain and returns its finality. Throws if it does not match. */
export async function nearFinality(
  near: NearExecution,
  options: { rpcUrl: string; fetchImpl?: typeof fetch },
): Promise<string> {
  const ref: NearExecutionRef = {
    txHash: `0x${"00".repeat(32)}` as NearExecutionRef["txHash"],
    venue: near.expect.kind === "ref_swap" ? "REF_FINANCE_NEAR" : "NEAR_PAYMENT",
    executedAt: Math.floor(Date.now() / 1000),
    near,
  };
  const evidence = await createNearVenueAdapter(options).collectEvidence(ref);
  return evidence.finalityResult ?? "PENDING";
}
