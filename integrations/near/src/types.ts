import type { ExecutionRef } from "@swaraj/evidence";

/** Venues NEAR actions execute on. */
export type NearVenue = "REF_FINANCE_NEAR" | "NEAR_PAYMENT";

/** What the chain must show for a NEAR execution to count as the approved action. */
export type NearExpectation =
  | { kind: "transfer"; receiverId: string; amount: string }
  | { kind: "ft_transfer"; contractId: string; receiverId: string; amount: string }
  | {
      kind: "ref_swap";
      refContract: string;
      poolId: number;
      tokenIn: string;
      tokenOut: string;
      amount: string;
      minAmountOut: string;
    };

/** The on-chain transaction behind an execution. */
export type NearExecution = { hash: string; signerId: string; expect: NearExpectation };

/** An execution reference with live NEAR lookup data; absent on fixture executions. */
export type NearExecutionRef = ExecutionRef & { near?: NearExecution };
