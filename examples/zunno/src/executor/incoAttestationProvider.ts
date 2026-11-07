import { createPublicClient, createWalletClient, http, type Hex } from "viem";

function createReadClient(rpcUrl?: string) {
  return createPublicClient({ chain: baseSepolia, transport: http(rpcUrl) });
}
type ReadClient = ReturnType<typeof createReadClient>;

function createSignClient(account: ReturnType<typeof privateKeyToAccount>, rpcUrl?: string) {
  return createWalletClient({ account, chain: baseSepolia, transport: http(rpcUrl) });
}
type SignClient = ReturnType<typeof createSignClient>;
import { baseSepolia } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { AttestationProvider } from "./viemExecutor.js";

/**
 * Inco attestation provider — a TS port of zunno-inco's
 * `server/bot/incoHand.js`: one voucher-session (re-granted on expiry)
 * covers every game, and `attestedDecryptWithVoucher` returns each card's
 * plaintext value plus its covalidator signatures.
 *
 * `signaturesFor(cardValue)` reads the bot's hand handles on-chain, decrypts
 * them through the session, and returns the signatures bound to that card.
 * A card the agent does not hold throws — fail closed; the rules engine will
 * also reject the play on-chain, so an ALLOW must never be based on a lie
 * about the hand.
 */

const DEFAULT_SESSION_VERIFIER = "0xc34569efc25901bdd6b652164a2c8a7228b23005";
const HAND_SESSION_MS = 10 * 60 * 1000;

const GAME_ABI = [
  {
    type: "function",
    name: "getMyHandHandles",
    stateMutability: "view",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [{ name: "out", type: "bytes32[]" }],
  },
] as const;

interface Zap {
  grantSessionKeyAllowanceVoucher(
    walletClient: unknown,
    sessionAddress: `0x${string}`,
    expiresAt: Date,
    verifier: string,
  ): Promise<unknown>;
  attestedDecryptWithVoucher(
    account: { address: `0x${string}` },
    voucher: unknown,
    handles: readonly `0x${string}`[],
  ): Promise<Array<{ handle: string; plaintext: { value: bigint }; covalidatorSignatures: Uint8Array[] }>>;
}

export interface DecryptedCard {
  handle: string;
  value: bigint;
  signatures: string[];
}

export class IncoAttestationProvider implements AttestationProvider {
  private readonly walletClient: SignClient;
  private readonly publicClient: ReadClient;
  private zapPromise: Promise<Zap> | undefined;
  private session: { account: ReturnType<typeof privateKeyToAccount>; voucher: unknown; expiresAt: number } | undefined;
  private decrypted: DecryptedCard[] | undefined;

  constructor(private readonly options: {
    privateKey: `0x${string}`;
    contractAddress: `0x${string}`;
    gameId: bigint;
    rpcUrl?: string;
  }) {
    const account = privateKeyToAccount(options.privateKey);
    this.walletClient = createSignClient(account, options.rpcUrl);
    this.publicClient = createReadClient(options.rpcUrl);
  }

  /** Lazily import the Inco SDK so dry-run mode has no optional dependency. */
  private async getZap(): Promise<Zap> {
    this.zapPromise ??= (async () => {
      const mod = (await import("@inco/lightning-js/lite")) as unknown as {
        Lightning: { baseSepoliaTestnet: () => Promise<Zap> };
      };
      return mod.Lightning.baseSepoliaTestnet();
    })();
    return this.zapPromise;
  }

  private async getSession() {
    if (this.session && this.session.expiresAt > Date.now()) return this.session;
    const zap = await this.getZap();
    // Fresh ephemeral session key per voucher, exactly like incoHand.js.
    const account = privateKeyToAccount(generatePrivateKey());
    const expiresAt = Date.now() + HAND_SESSION_MS;
    const voucher = await zap.grantSessionKeyAllowanceVoucher(
      this.walletClient,
      account.address,
      new Date(expiresAt),
      DEFAULT_SESSION_VERIFIER,
    );
    this.session = { account, voucher, expiresAt };
    return this.session;
  }

  private async decryptHand(): Promise<DecryptedCard[]> {
    if (this.decrypted) return this.decrypted;
    const handles = (await this.publicClient.readContract({
      address: this.options.contractAddress,
      abi: GAME_ABI,
      functionName: "getMyHandHandles",
      args: [this.options.gameId],
      account: privateKeyToAccount(this.options.privateKey).address,
    })) as readonly `0x${string}`[];
    if (handles.length === 0) return [];
    const zap = await this.getZap();
    const session = await this.getSession();
    let results: Awaited<ReturnType<Zap["attestedDecryptWithVoucher"]>>;
    try {
      results = await zap.attestedDecryptWithVoucher(session.account, session.voucher, handles);
    } catch (cause) {
      this.session = undefined; // voucher rejected/expired server-side — re-grant next time
      throw cause;
    }
    this.decrypted = results.map((result) => ({
      handle: result.handle,
      value: result.plaintext.value,
      signatures: result.covalidatorSignatures.map((sig) => bytesToHex(sig)),
    }));
    return this.decrypted;
  }

  async signaturesFor(cardValue: number): Promise<Hex[]> {
    const hand = await this.decryptHand();
    return signaturesFromHand(hand, cardValue) as Hex[];
  }

  /** Called between turns: the hand changes after every play/draw. */
  invalidate(): void {
    this.decrypted = undefined;
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("").replace(/^/, "0x");
}

/** Pure hand→signatures resolution: a card the agent does not hold never attests. */
export function signaturesFromHand(hand: DecryptedCard[], cardValue: number): string[] {
  const card = hand.find((entry) => entry.value === BigInt(cardValue));
  if (!card) {
    throw new Error(`card ${cardValue} is not in the agent's hand — refusing to attest`);
  }
  return card.signatures;
}
