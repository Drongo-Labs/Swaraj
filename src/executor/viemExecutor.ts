import { createPublicClient, createWalletClient, encodeFunctionData, http, type Hex } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";

/** Inferred client types: keeps viem's generics intact instead of fighting them. */
function createBotWalletClient(account: PrivateKeyAccount, rpcUrl?: string) {
  return createWalletClient({ account, chain: baseSepolia, transport: http(rpcUrl) });
}
type BotWalletClient = ReturnType<typeof createBotWalletClient>;

function createBotPublicClient(rpcUrl?: string) {
  return createPublicClient({ chain: baseSepolia, transport: http(rpcUrl) });
}
type BotPublicClient = ReturnType<typeof createBotPublicClient>;
import type { MoveExecutor } from "../agent/bridge.js";

/**
 * Real move executor on the zunno-inco gameBot path: viem-encoded calls to
 * ZunnoInco (Base Sepolia) from the bot's own wallet — the same
 * `encodeFunctionData` + `sendTransaction` flow server/bot/gameBot.js uses.
 *
 * - stake → `joinGame(gameId, joinee) {value: amountWei}` (the payable join)
 * - playCard → `playCard(gameId, handIndex, claimedValue, sigs, chosenColor)`
 *   — live mode requires an attestation provider for the card's covalidator
 *   sigs (the Inco decrypt flow); dry-run encodes with empty sigs.
 * - drawCard → `drawCard(gameId)`
 *
 * Dry-run (default) encodes calldata and returns a `dryrun:` marker instead
 * of broadcasting — enough to verify the wiring without a funded wallet.
 */

const GAME_ABI = [
  {
    type: "function",
    name: "joinGame",
    stateMutability: "payable",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "joinee", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "playCard",
    stateMutability: "nonpayable",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "handIndex", type: "uint256" },
      { name: "claimedValue", type: "uint256" },
      { name: "sigs", type: "bytes[]" },
      { name: "chosenColor", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "drawCard",
    stateMutability: "nonpayable",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
  },
] as const;

export interface AttestationProvider {
  /** Covalidator signatures for a card the agent holds (Inco decrypt flow). */
  signaturesFor(cardValue: number): Promise<Hex[]>;
}

export interface ViemExecutorConfig {
  contractAddress: `0x${string}`;
  gameId: bigint;
  /** Bot wallet private key; required for live mode. */
  privateKey?: `0x${string}`;
  rpcUrl?: string;
  /** Encode only, never broadcast (default when no key is set). */
  dryRun: boolean;
  attestationProvider?: AttestationProvider;
}

export class ViemMoveExecutor implements MoveExecutor {
  private readonly wallet: PrivateKeyAccount | undefined;
  private readonly walletClient: BotWalletClient | undefined;
  private readonly publicClient: BotPublicClient;

  constructor(private readonly config: ViemExecutorConfig) {
    if (!config.dryRun && !config.privateKey) {
      throw new Error("live mode requires ZUNNO_BOT_PRIVATE_KEY");
    }
    if (!config.dryRun && !config.attestationProvider) {
      throw new Error("live playCard requires an attestation provider (Inco sigs)");
    }
    const account = config.privateKey ? privateKeyToAccount(config.privateKey) : undefined;
    this.wallet = account;
    this.walletClient = account ? createBotWalletClient(account, config.rpcUrl) : undefined;
    this.publicClient = createBotPublicClient(config.rpcUrl);
  }

  private async send(data: Hex, label: string, value?: bigint): Promise<{ txHash: string }> {
    if (this.config.dryRun || !this.walletClient || !this.wallet) {
      return { txHash: `dryrun:${label}:${data.slice(0, 26)}…` };
    }
    const hash = await this.walletClient.sendTransaction({
      to: this.config.contractAddress,
      data,
      ...(value !== undefined ? { value } : {}),
    });
    await this.publicClient.waitForTransactionReceipt({ hash });
    return { txHash: hash };
  }

  async stake(amountWei: string, _recipient: string): Promise<{ txHash: string }> {
    const joinee = this.wallet?.address ?? "0x0000000000000000000000000000000000000000";
    const data = encodeFunctionData({
      abi: GAME_ABI,
      functionName: "joinGame",
      args: [this.config.gameId, joinee],
    });
    return this.send(data, "joinGame", BigInt(amountWei));
  }

  async playCard(handIndex: number, cardValue: number, chosenColor: number): Promise<{ txHash: string }> {
    const sigs = this.config.dryRun
      ? []
      : await this.config.attestationProvider!.signaturesFor(cardValue);
    const data = encodeFunctionData({
      abi: GAME_ABI,
      functionName: "playCard",
      args: [this.config.gameId, BigInt(handIndex), BigInt(cardValue), sigs, chosenColor],
    });
    return this.send(data, "playCard");
  }

  async drawCard(): Promise<{ txHash: string }> {
    const data = encodeFunctionData({
      abi: GAME_ABI,
      functionName: "drawCard",
      args: [this.config.gameId],
    });
    return this.send(data, "drawCard");
  }
}
