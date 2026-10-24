/** Legacy hash-map mocks — prefer real SMT + @swaraj/capability. Kept for unit tests of exact maps. */
import { KNOWN_TX_HASH, type ExecutionRef } from "@swaraj/evidence";

export const MOCK_ALLOW_INTENT_HASH =
  "0x1111111111111111111111111111111111111111111111111111111111111111" as const;
export const MOCK_BLOCK_INTENT_HASH =
  "0x2222222222222222222222222222222222222222222222222222222222222222" as const;
export const MOCK_POLICY_HASH =
  "0x3333333333333333333333333333333333333333333333333333333333333333" as const;

export type MockSmtInput = {
  intentHash: string;
  policyHash: string;
  stateHash?: string;
};

export type MockSmtResult =
  | { decision: "ALLOW" }
  | { decision: "BLOCK"; violations: Array<{ ruleId: string; reason: string }> };

export type MockCapability = {
  capabilityId: string;
  intentHash: string;
  expiresAt: number;
};

export function mockSmtCheck(input: MockSmtInput): MockSmtResult {
  if (input.intentHash === MOCK_BLOCK_INTENT_HASH) {
    return {
      decision: "BLOCK",
      violations: [{ ruleId: "amount_cap", reason: "mock policy: amount exceeds cap" }],
    };
  }
  if (input.intentHash === MOCK_ALLOW_INTENT_HASH) {
    return { decision: "ALLOW" };
  }
  return {
    decision: "BLOCK",
    violations: [{ ruleId: "unknown_intent", reason: "mock SMT: unrecognized intentHash" }],
  };
}

export function mockIssueCapability(intentHash: string, now = Math.floor(Date.now() / 1000)): MockCapability {
  return {
    capabilityId: `cap_${intentHash.slice(2, 10)}`,
    intentHash,
    expiresAt: now + 60,
  };
}

const CAPABILITY_TO_TX: Readonly<Record<string, string>> = {
  [`cap_${MOCK_ALLOW_INTENT_HASH.slice(2, 10)}`]: KNOWN_TX_HASH,
};

export function mockExecute(capabilityId: string, executedAt = Math.floor(Date.now() / 1000)): ExecutionRef {
  const txHash = CAPABILITY_TO_TX[capabilityId];
  if (txHash === undefined) {
    throw new Error(`mock execute: unknown capabilityId ${capabilityId}`);
  }
  return {
    txHash: txHash as ExecutionRef["txHash"],
    venue: "UNISWAP_V3_BASE",
    executedAt,
  };
}
