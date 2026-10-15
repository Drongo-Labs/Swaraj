import { FINAL_TX_HASH, KNOWN_TX_HASH, type ExecutionRef } from "@swaraj/evidence";
import type { CapabilityService } from "./service.js";
import type { CapabilityToken } from "./types.js";

/** Trade fields required for live Uniswap execution (from ActionIntent). */
export type ExecutionTrade = {
  assetIn: `0x${string}`;
  assetOut: `0x${string}`;
  /** Atomic amount of assetIn as decimal string. */
  amount: string;
  maxSlippageBps: number;
  /** Atomic assetOut per 1e18 atomic assetIn, decimal string. */
  limitPrice: string;
};

export type ExecutionAdapter = {
  /** Validates the capability, then submits the trade. */
  execute(params: {
    token: CapabilityToken;
    intentHash: string;
    policyHash: string;
    accountRef: string;
    now?: number;
    /** Required by live Base adapter; ignored by mock. */
    trade?: ExecutionTrade;
  }): Promise<ExecutionRef>;
};

export type MockExecutionOptions = {
  /**
   * When true (or SWARAJ_EVIDENCE_FINALITY=FINAL), return FINAL_TX_HASH so the evidence
   * mock can declare FINAL for Phase 7 prove demos. Still not real Base finality.
   */
  declareFinal?: boolean;
};

/**
 * Mock Base/Uniswap execution adapter.
 * Only a verified, unused, unexpired capability can produce an ExecutionRef.
 * Never talks to chain RPC — returns a fixture tx hash.
 */
export function createMockExecutionAdapter(
  capabilities: CapabilityService,
  options: MockExecutionOptions = {},
): ExecutionAdapter {
  const declareFinal =
    options.declareFinal === true || process.env.SWARAJ_EVIDENCE_FINALITY === "FINAL";
  return {
    async execute(params) {
      await capabilities.verify(params.token, {
        intentHash: params.intentHash,
        policyHash: params.policyHash,
        accountRef: params.accountRef,
        ...(params.now !== undefined ? { now: params.now } : {}),
      });
      await capabilities.consume(params.token.capabilityId);
      await capabilities.commitReservation(params.token.capabilityId);
      return {
        txHash: declareFinal ? FINAL_TX_HASH : KNOWN_TX_HASH,
        venue: "UNISWAP_V3_BASE",
        executedAt: params.now ?? Math.floor(Date.now() / 1000),
      };
    },
  };
}
