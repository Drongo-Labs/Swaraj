import { createPublicClient, erc20Abi, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { resolveBaseNetwork } from "@swaraj/evidence";

export type LiveStateOracle = {
  accountAddress: `0x${string}`;
  networkId: string;
  snapshot: (opts?: {
    reservedBudget?: string;
    usedDailyTurnover?: string;
    lastActionTime?: number;
  }) => Promise<Record<string, unknown>>;
};

export type LiveStateOracleOptions = {
  rpcUrl: string;
  privateKey: Hex;
  usdc?: `0x${string}`;
  weth?: `0x${string}`;
};

/**
 * Live portfolio state for the execution wallet on Base mainnet or Base Sepolia.
 * Client-supplied fixture balances must not be used in base mode.
 */
export function createLiveStateOracle(options: LiveStateOracleOptions): LiveStateOracle {
  const network = resolveBaseNetwork(process.env);
  const account = privateKeyToAccount(options.privateKey);
  const usdc = (options.usdc ?? network.usdc).toLowerCase() as `0x${string}`;
  const weth = (options.weth ?? network.weth).toLowerCase() as `0x${string}`;
  const publicClient = createPublicClient({
    chain: network.chain,
    transport: http(options.rpcUrl),
  });

  return {
    accountAddress: account.address,
    networkId: network.id,
    async snapshot(opts = {}) {
      const [wethBal, usdcBal] = await Promise.all([
        publicClient.readContract({
          address: weth,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [account.address],
        }),
        publicClient.readContract({
          address: usdc,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [account.address],
        }),
      ]);
      const now = Math.floor(Date.now() / 1000);
      const balances = [
        { asset: weth, amount: wethBal.toString() },
        { asset: usdc, amount: usdcBal.toString() },
      ].sort((a, b) => (a.asset < b.asset ? -1 : a.asset > b.asset ? 1 : 0));

      return {
        balances,
        reservedBudget: opts.reservedBudget ?? "0",
        usedDailyTurnover: opts.usedDailyTurnover ?? "0",
        lastActionTime: opts.lastActionTime ?? now - 120,
        policyStatus: "ACTIVE",
        freshnessSeconds: 5,
        timestamp: now,
      };
    },
  };
}

/** @deprecated use resolveBaseNetwork().usdc */
export const LIVE_USDC = resolveBaseNetwork().usdc;
/** @deprecated use resolveBaseNetwork().weth */
export const LIVE_WETH = resolveBaseNetwork().weth;
