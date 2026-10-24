import { resolveBaseNetwork, sortedDemoAssets } from "@swaraj/evidence";

/** Shared demo policy / state / intents. Asset addresses follow SWARAJ_BASE_NETWORK. */

const MAINNET_USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" as const;
const WETH = "0x4200000000000000000000000000000000000006" as const;

/** Mainnet fixture used by unit tests (stable addresses). */
export const DEMO_POLICY = {
  policyVersion: 1,
  allowedVenues: ["UNISWAP_V3_BASE"],
  allowedAssets: [WETH, MAINNET_USDC],
  maxAmountPerAction: "100000000",
  // Atomic units of assetOut (WETH wei). Must exceed existing wallet WETH + expected out.
  positionCap: "100000000000000000000",
  dailyTurnoverCap: "500000000",
  maxSlippageBps: 100,
  reserveRequirement: "5000000",
  quoteFreshnessSeconds: 30,
  cooldownSeconds: 60,
  finalityRule: "BASE_CONFIRMATIONS_12",
  policyExpiry: 1800000000,
  paused: false,
} as const;

/** Live demo policy for the active Base network (mainnet or Sepolia). */
export function demoPolicyForEnv(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, unknown> {
  const network = resolveBaseNetwork(env);
  const allowedAssets = [...sortedDemoAssets(network)];
  return {
    ...DEMO_POLICY,
    allowedAssets,
    finalityRule:
      network.id === "base-sepolia" ? "BASE_CONFIRMATIONS_12" : DEMO_POLICY.finalityRule,
  };
}

export function demoAssetsForEnv(env: NodeJS.ProcessEnv = process.env): {
  usdc: `0x${string}`;
  weth: `0x${string}`;
  networkId: string;
} {
  const network = resolveBaseNetwork(env);
  return { usdc: network.usdc, weth: network.weth, networkId: network.id };
}

export const DEMO_STATE = {
  balances: [
    { asset: WETH, amount: "0" },
    { asset: MAINNET_USDC, amount: "250000000" },
  ],
  reservedBudget: "0",
  usedDailyTurnover: "100000000",
  lastActionTime: 1789999000,
  policyStatus: "ACTIVE",
  freshnessSeconds: 5,
  timestamp: 1790000000,
} as const;

export const DEMO_ALLOW_INTENT = {
  intentId: "intent_allow",
  actionType: "SPOT_TRADE",
  venue: "UNISWAP_V3_BASE",
  accountRef: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  assetIn: MAINNET_USDC,
  assetOut: WETH,
  amount: "10000000",
  maxSlippageBps: 50,
  limitPrice: "400000000000000",
  expiry: 1790000300,
  idempotencyKey: "idem_allow",
  policyVersion: 1,
} as const;

/** Amount over caps → SMT BLOCK. */
export const DEMO_BLOCK_INTENT = {
  ...DEMO_ALLOW_INTENT,
  intentId: "intent_block",
  amount: "600000000",
  maxSlippageBps: 500,
  idempotencyKey: "idem_block",
} as const;

/** Live intents use the network USDC/WETH pair. */
export function demoAllowIntentForEnv(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, unknown> {
  const { usdc, weth } = demoAssetsForEnv(env);
  return { ...DEMO_ALLOW_INTENT, assetIn: usdc, assetOut: weth };
}

export function demoBlockIntentForEnv(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, unknown> {
  const { usdc, weth } = demoAssetsForEnv(env);
  return { ...DEMO_BLOCK_INTENT, assetIn: usdc, assetOut: weth };
}
