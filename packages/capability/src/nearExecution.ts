import {
  NEAR_FINAL_TX_HASH,
  NEAR_KNOWN_TX_HASH,
  type ExecutionRef,
} from "@swaraj/evidence";
import type { CapabilityService } from "./service.js";
import type { CapabilityToken } from "./types.js";
import type { ExecutionAdapter } from "./execution.js";

export type NearMockExecutionOptions = {
  /** When true (or SWARAJ_EVIDENCE_FINALITY=FINAL), return FINAL fixture hash. */
  declareFinal?: boolean;
};

/**
 * Fixture NEAR execution adapter (Phase 2).
 * Verifies + consumes a capability, then returns a REF_FINANCE_NEAR ExecutionRef.
 * Never talks to NEAR RPC.
 */
export function createNearMockExecutionAdapter(
  capabilities: CapabilityService,
  options: NearMockExecutionOptions = {},
): ExecutionAdapter {
  const declareFinal =
    options.declareFinal === true || process.env.SWARAJ_EVIDENCE_FINALITY === "FINAL";
  return {
    async execute(params: {
      token: CapabilityToken;
      intentHash: string;
      policyHash: string;
      accountRef: string;
      now?: number;
    }): Promise<ExecutionRef> {
      await capabilities.verify(params.token, {
        intentHash: params.intentHash,
        policyHash: params.policyHash,
        accountRef: params.accountRef,
        ...(params.now !== undefined ? { now: params.now } : {}),
      });
      await capabilities.consume(params.token.capabilityId);
      await capabilities.commitReservation(params.token.capabilityId);
      return {
        txHash: declareFinal ? NEAR_FINAL_TX_HASH : NEAR_KNOWN_TX_HASH,
        venue: "REF_FINANCE_NEAR",
        executedAt: params.now ?? Math.floor(Date.now() / 1000),
      };
    },
  };
}
