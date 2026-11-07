import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  erc20Abi,
  http,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { Chain } from "viem/chains";
import { resolveBaseNetwork, type ExecutionRef } from "@swaraj/evidence";
import { CapabilityError, type CapabilityService } from "./service.js";
import type { ExecutionAdapter, ExecutionTrade } from "./execution.js";

/** Uniswap V3 SwapRouter02 on Base mainnet (override via network / UNISWAP_V3_ROUTER). */
export const DEFAULT_SWAP_ROUTER_02 = "0x2626664c2603336E57B271c5C0b26F421741e481" as const;

const swapRouterAbi = [
  {
    type: "function",
    name: "exactInputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
] as const;

/** Narrow surfaces for tests / DI without PublicClient version clashes. */
export type BaseExecutionPublicClient = {
  readContract: (args: {
    address: `0x${string}`;
    abi: typeof erc20Abi;
    functionName: "allowance";
    args: readonly [`0x${string}`, `0x${string}`];
  }) => Promise<bigint>;
  waitForTransactionReceipt: (args: {
    hash: Hex;
  }) => Promise<{ status: "success" | "reverted"; transactionHash?: Hex }>;
};

export type BaseExecutionWalletClient = {
  account: { address: `0x${string}` };
  writeContract: (args: {
    address: `0x${string}`;
    abi: typeof erc20Abi;
    functionName: "approve";
    args: readonly [`0x${string}`, bigint];
    chain?: unknown;
    account?: unknown;
  }) => Promise<Hex>;
  sendTransaction: (args: {
    to: `0x${string}`;
    data: Hex;
    account?: unknown;
    chain?: unknown;
  }) => Promise<Hex>;
};

export type BaseUniswapExecutionOptions = {
  rpcUrl?: string;
  privateKey?: Hex;
  routerAddress?: `0x${string}`;
  /** viem chain (Base mainnet or Base Sepolia). Defaults from SWARAJ_BASE_NETWORK. */
  chain?: Chain;
  /** Uniswap v3 fee tier. Default 500. */
  feeTier?: number;
  publicClient?: BaseExecutionPublicClient;
  walletClient?: BaseExecutionWalletClient;
};

const SCALE_1E18 = 10n ** 18n;

/** amountOutMinimum from limitPrice (assetOut per 1e18 assetIn) and slippage bps. */
export function computeAmountOutMinimum(
  amountIn: string,
  limitPrice: string,
  maxSlippageBps: number,
): bigint {
  if (!/^(0|[1-9][0-9]*)$/.test(amountIn) || !/^(0|[1-9][0-9]*)$/.test(limitPrice)) {
    throw new CapabilityError("invalid trade amount or limitPrice");
  }
  if (!Number.isInteger(maxSlippageBps) || maxSlippageBps < 0 || maxSlippageBps > 10_000) {
    throw new CapabilityError("invalid maxSlippageBps");
  }
  const expectedOut = (BigInt(amountIn) * BigInt(limitPrice)) / SCALE_1E18;
  return (expectedOut * BigInt(10_000 - maxSlippageBps)) / 10_000n;
}

function requireTrade(trade: ExecutionTrade | undefined): ExecutionTrade {
  if (!trade) {
    throw new CapabilityError("Base execution requires trade fields (assetIn, assetOut, amount, …)");
  }
  if (!/^0x[0-9a-f]{40}$/.test(trade.assetIn) || !/^0x[0-9a-f]{40}$/.test(trade.assetOut)) {
    throw new CapabilityError("trade asset addresses must be lowercase 0x + 40 hex");
  }
  if (trade.assetIn === trade.assetOut) {
    throw new CapabilityError("assetIn and assetOut must differ");
  }
  return trade;
}

/** Live Uniswap v3 execution: verify → approve → exactInputSingle → consume/commit. */
export function createBaseUniswapExecutionAdapter(
  capabilities: CapabilityService,
  options: BaseUniswapExecutionOptions = {},
): ExecutionAdapter {
  const network = resolveBaseNetwork(process.env);
  const chain = options.chain ?? network.chain;
  const router = (
    options.routerAddress ?? network.swapRouter02 ?? DEFAULT_SWAP_ROUTER_02
  ).toLowerCase() as `0x${string}`;
  const feeTier = options.feeTier ?? 500;

  let publicClient = options.publicClient;
  let walletClient = options.walletClient;
  let recipient: `0x${string}` | undefined = walletClient?.account.address.toLowerCase() as
    | `0x${string}`
    | undefined;

  if (!publicClient || !walletClient) {
    if (!options.rpcUrl || !options.privateKey) {
      throw new CapabilityError(
        "createBaseUniswapExecutionAdapter requires rpcUrl+privateKey or injected clients",
      );
    }
    const account = privateKeyToAccount(options.privateKey);
    recipient = account.address.toLowerCase() as `0x${string}`;
    const viemPublic = createPublicClient({ chain, transport: http(options.rpcUrl) });
    const viemWallet = createWalletClient({
      account,
      chain,
      transport: http(options.rpcUrl),
    });
    publicClient = {
      readContract: (args) => viemPublic.readContract(args),
      waitForTransactionReceipt: (args) => viemPublic.waitForTransactionReceipt(args),
    };
    walletClient = {
      account: { address: recipient },
      writeContract: (args) =>
        viemWallet.writeContract({
          address: args.address,
          abi: args.abi,
          functionName: args.functionName,
          args: args.args,
          chain,
          account,
        }),
      sendTransaction: (args) =>
        viemWallet.sendTransaction({
          to: args.to,
          data: args.data,
          account,
          chain,
        }),
    };
  }

  if (!recipient) {
    throw new CapabilityError("execution wallet address unavailable");
  }

  const rpc = publicClient;
  const wallet = walletClient;
  const from = recipient;

  return {
    async execute(params): Promise<ExecutionRef> {
      const trade = requireTrade(params.trade);

      await capabilities.verify(params.token, {
        intentHash: params.intentHash,
        policyHash: params.policyHash,
        accountRef: params.accountRef,
        ...(params.now !== undefined ? { now: params.now } : {}),
      });

      const amountIn = BigInt(trade.amount);
      const amountOutMinimum = computeAmountOutMinimum(
        trade.amount,
        trade.limitPrice,
        trade.maxSlippageBps,
      );

      const allowance = await rpc.readContract({
        address: trade.assetIn,
        abi: erc20Abi,
        functionName: "allowance",
        args: [from, router],
      });

      if (allowance < amountIn) {
        const approveHash = await wallet.writeContract({
          address: trade.assetIn,
          abi: erc20Abi,
          functionName: "approve",
          args: [router, amountIn],
        });
        const approveReceipt = await rpc.waitForTransactionReceipt({ hash: approveHash });
        if (approveReceipt.status !== "success") {
          throw new CapabilityError(`ERC20 approve reverted: ${approveHash}`);
        }
      }

      const data = encodeFunctionData({
        abi: swapRouterAbi,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: trade.assetIn,
            tokenOut: trade.assetOut,
            fee: feeTier,
            recipient: from,
            amountIn,
            amountOutMinimum,
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      const txHash = await wallet.sendTransaction({
        to: router,
        data,
      });

      const receipt = await rpc.waitForTransactionReceipt({ hash: txHash });
      if (receipt.status !== "success") {
        throw new CapabilityError(`Uniswap swap reverted: ${txHash}`);
      }

      await capabilities.consume(params.token.capabilityId);
      await capabilities.commitReservation(params.token.capabilityId);

      return {
        txHash: txHash.toLowerCase() as `0x${string}`,
        venue: "UNISWAP_V3_BASE",
        executedAt: params.now ?? Math.floor(Date.now() / 1000),
      };
    },
  };
}
