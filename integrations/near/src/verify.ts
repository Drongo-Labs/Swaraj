import type { UnifiedAction } from "@swaraj/schemas";
import { createNearVenueAdapter } from "./evidence.js";
import { NEAR_FT_TRANSFER_SERVICE, NEAR_TRANSFER_SERVICE } from "./settler.js";
import type { NearExecution, NearExecutionRef } from "./types.js";

/**
 * True when the recorded transaction targets exactly what the action approved: the same kind of
 * transfer the action's service names, the same recipient and amount, and for token payments the
 * token contract the operator expects. Without `ftContract` a token payment never matches (fail closed).
 */
export function nearExecutionMatchesAction(
  near: NearExecution,
  action: UnifiedAction,
  options: { ftContract?: string } = {},
): boolean {
  const { expect } = near;
  if (expect.kind === "ref_swap") {
    return action.action === "SPOT_TRADE"
      && action.resource.venue === "REF_FINANCE_NEAR"
      && expect.tokenIn === action.context.assetIn
      && expect.tokenOut === action.context.assetOut
      && expect.amount === action.context.amount.toString()
      // a zero minimum would accept any output, so the slippage bound must be real
      && /^\d+$/.test(expect.minAmountOut) && BigInt(expect.minAmountOut) > 0n;
  }
  if (action.action !== "PAYMENT"
    || expect.receiverId !== action.context.recipient
    || expect.amount !== action.context.amount.toString()) return false;
  if (expect.kind === "transfer") return action.resource.service === NEAR_TRANSFER_SERVICE && action.context.currency === "NEAR";
  return action.resource.service === NEAR_FT_TRANSFER_SERVICE
    && options.ftContract !== undefined && expect.contractId === options.ftContract;
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
