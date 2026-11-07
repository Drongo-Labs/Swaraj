import { base, baseSepolia, type Chain } from "viem/chains";

export type BaseNetworkId = "base" | "base-sepolia";

export type BaseNetworkConfig = {
  id: BaseNetworkId;
  chain: Chain;
  chainId: number;
  /** Public RPC hint (override with BASE_RPC_URL). */
  defaultRpcUrl: string;
  weth: `0x${string}`;
  usdc: `0x${string}`;
  swapRouter02: `0x${string}`;
  /** Default confirmations before FINAL evidence. */
  defaultConfirmations: number;
};

/** Canonical Base mainnet + Base Sepolia addresses used by Swaraj. */
export const BASE_NETWORKS: Record<BaseNetworkId, BaseNetworkConfig> = {
  base: {
    id: "base",
    chain: base,
    chainId: base.id,
    defaultRpcUrl: "https://mainnet.base.org",
    weth: "0x4200000000000000000000000000000000000006",
    usdc: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    swapRouter02: "0x2626664c2603336e57b271c5c0b26f421741e481",
    defaultConfirmations: 12,
  },
  "base-sepolia": {
    id: "base-sepolia",
    chain: baseSepolia,
    chainId: baseSepolia.id,
    defaultRpcUrl: "https://sepolia.base.org",
    weth: "0x4200000000000000000000000000000000000006",
    /** Circle USDC on Base Sepolia */
    usdc: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
    /** Uniswap V3 SwapRouter02 on Base Sepolia */
    swapRouter02: "0x94cc0aac535ccdb3c01d6787d6413c739ae12bc4",
    defaultConfirmations: 6,
  },
};

/** Network from `SWARAJ_BASE_NETWORK`, else from `BASE_RPC_URL`, else Base mainnet. */
export function resolveBaseNetwork(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): BaseNetworkConfig {
  const raw = (env.SWARAJ_BASE_NETWORK ?? env.BASE_NETWORK ?? "").trim().toLowerCase();
  if (raw === "base-sepolia" || raw === "sepolia" || raw === "basesepolia") {
    return BASE_NETWORKS["base-sepolia"];
  }
  if (raw === "base" || raw === "mainnet") {
    return BASE_NETWORKS.base;
  }
  const rpc = (env.BASE_RPC_URL ?? "").toLowerCase();
  if (rpc.includes("sepolia")) {
    return BASE_NETWORKS["base-sepolia"];
  }
  return BASE_NETWORKS.base;
}

export function sortedDemoAssets(network: BaseNetworkConfig): [`0x${string}`, `0x${string}`] {
  const assets = [network.weth, network.usdc].map((a) => a.toLowerCase() as `0x${string}`);
  assets.sort();
  return assets as [`0x${string}`, `0x${string}`];
}
