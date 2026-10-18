/** Demo venue constants. Tokens follow VITE_SWARAJ_BASE_NETWORK / default mainnet. */

const MAINNET = {
  usdc: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  weth: "0x4200000000000000000000000000000000000006",
} as const;

const SEPOLIA = {
  usdc: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
  weth: "0x4200000000000000000000000000000000000006",
} as const;

function networkTokens() {
  const raw = (import.meta.env.VITE_SWARAJ_BASE_NETWORK ?? "").toLowerCase();
  if (raw === "base-sepolia" || raw === "sepolia") return SEPOLIA;
  return MAINNET;
}

const tokens = networkTokens();
export const USDC = tokens.usdc;
export const WETH = tokens.weth;
export const ACCOUNT_REF =
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;
export const LIMIT_PRICE = "400000000000000";
export const USDC_DECIMALS = 6;

export function usdcToAtomic(amountUsdc: number): string {
  if (!Number.isFinite(amountUsdc) || amountUsdc < 0) return "0";
  const atomic = Math.round(amountUsdc * 10 ** USDC_DECIMALS);
  return String(atomic);
}

export function buildDemoIntent(params: {
  amountAtomic: string;
  maxSlippageBps: number;
  idempotencyKey: string;
  policyVersion?: number;
}): Record<string, unknown> {
  const now = Math.floor(Date.now() / 1000);
  return {
    intentId: `intent_${params.idempotencyKey}`.slice(0, 64),
    actionType: "SPOT_TRADE",
    venue: "UNISWAP_V3_BASE",
    accountRef: ACCOUNT_REF,
    assetIn: USDC,
    assetOut: WETH,
    amount: params.amountAtomic,
    maxSlippageBps: params.maxSlippageBps,
    limitPrice: LIMIT_PRICE,
    expiry: now + 300,
    idempotencyKey: params.idempotencyKey,
    policyVersion: params.policyVersion ?? 1,
  };
}
