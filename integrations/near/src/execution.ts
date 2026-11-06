import type { CapabilityService, CapabilityToken, ExecutionAdapter } from "@swaraj/capability";
import type { ExecutionRef } from "@swaraj/evidence";
import { Account, JsonRpcProvider, KeyPairSigner, actions, baseDecode, type KeyPairString } from "near-api-js";
import { NEAR_FINAL_TX_HASH, NEAR_KNOWN_TX_HASH } from "./fixtures.js";
import type { NearExecutionRef, NearExpectation, NearVenue } from "./types.js";

export type NearMockExecutionOptions = {
  /** When true (or SWARAJ_EVIDENCE_FINALITY=FINAL), return FINAL fixture hash. */
  declareFinal?: boolean;
  /** Venue the fixture reports. Default REF_FINANCE_NEAR. */
  venue?: NearVenue;
};

/**
 * Fixture NEAR execution adapter (Phase 2).
 * Verifies + consumes a capability, then returns a REF_FINANCE_NEAR ExecutionRef.
 * Never talks to NEAR RPC.
 */
export function createNearMockExecutionAdapter(
  capabilities: CapabilityService,
  options: NearMockExecutionOptions = {},
): ExecutionAdapter {
  const declareFinal =
    options.declareFinal === true || process.env.SWARAJ_EVIDENCE_FINALITY === "FINAL";
  return {
    async execute(params: {
      token: CapabilityToken;
      intentHash: string;
      policyHash: string;
      accountRef: string;
      now?: number;
    }): Promise<ExecutionRef> {
      await capabilities.verify(params.token, {
        intentHash: params.intentHash,
        policyHash: params.policyHash,
        accountRef: params.accountRef,
        ...(params.now !== undefined ? { now: params.now } : {}),
      });
      await capabilities.consume(params.token.capabilityId);
      await capabilities.commitReservation(params.token.capabilityId);
      return {
        txHash: declareFinal ? NEAR_FINAL_TX_HASH : NEAR_KNOWN_TX_HASH,
        venue: options.venue ?? "REF_FINANCE_NEAR",
        executedAt: params.now ?? Math.floor(Date.now() / 1000),
      };
    },
  };
}

export type NearLiveOptions = {
  capabilities: CapabilityService;
  rpcUrl: string;
  accountId: string;
  privateKey: string;
};

export type NearPaymentExecutor = {
  accountId: string;
  /** The swap to send for an amount, with min_amount_out set from a live pool quote. */
  quoteSwap(params: {
    refContract: string;
    poolId: number;
    tokenIn: string;
    tokenOut: string;
    amount: string;
    slippageBps: number;
  }): Promise<NearExpectation>;
  /** Verifies and consumes the capability, then sends exactly `expect` on chain. */
  execute(params: {
    token: CapabilityToken;
    intentHash: string;
    policyHash: string;
    accountRef: string;
    expect: NearExpectation;
  }): Promise<NearExecutionRef>;
};

const FT_TRANSFER_GAS = 30_000_000_000_000n;
const SWAP_GAS = 180_000_000_000_000n;
const ONE_YOCTO = 1n;
const BPS = 10_000n;

function nearAction(expect: NearExpectation): { receiverId: string; action: ReturnType<typeof actions.transfer> } {
  switch (expect.kind) {
    case "transfer":
      return { receiverId: expect.receiverId, action: actions.transfer(BigInt(expect.amount)) };
    case "ft_transfer":
      return {
        receiverId: expect.contractId,
        action: actions.functionCall(
          "ft_transfer",
          { receiver_id: expect.receiverId, amount: expect.amount },
          FT_TRANSFER_GAS,
          ONE_YOCTO,
        ),
      };
    case "ref_swap":
      return {
        receiverId: expect.tokenIn,
        action: actions.functionCall(
          "ft_transfer_call",
          {
            receiver_id: expect.refContract,
            amount: expect.amount,
            msg: JSON.stringify({
              force: 0,
              actions: [{
                pool_id: expect.poolId,
                token_in: expect.tokenIn,
                token_out: expect.tokenOut,
                amount_in: expect.amount,
                min_amount_out: expect.minAmountOut,
              }],
            }),
          },
          SWAP_GAS,
          ONE_YOCTO,
        ),
      };
  }
}

/** One-time setup a swapping account needs: wrapped NEAR and storage on each contract. */
export async function prepareNearSwapAccount(
  options: Omit<NearLiveOptions, "capabilities"> & { tokens: string[]; refContract: string; wrapContract: string; wrapAmount: bigint },
): Promise<void> {
  const provider = new JsonRpcProvider({ url: options.rpcUrl });
  const signer = KeyPairSigner.fromSecretKey(options.privateKey as KeyPairString);
  const account = new Account(options.accountId, provider, signer);
  for (const contractId of [...options.tokens, options.refContract]) {
    await account.signAndSendTransaction({
      receiverId: contractId,
      actions: [actions.functionCall("storage_deposit", { account_id: options.accountId, registration_only: true }, FT_TRANSFER_GAS, 125_000_000_000_000_000_000_000n)],
    });
  }
  await account.signAndSendTransaction({
    receiverId: options.wrapContract,
    actions: [actions.functionCall("near_deposit", {}, FT_TRANSFER_GAS, options.wrapAmount)],
  });
}

/** Live NEAR payments and Ref Finance swaps. The capability is consumed before signing, so a retry can never pay twice. */
export function createNearPaymentExecutor(options: NearLiveOptions): NearPaymentExecutor {
  const provider = new JsonRpcProvider({ url: options.rpcUrl });
  const signer = KeyPairSigner.fromSecretKey(options.privateKey as KeyPairString);
  const account = new Account(options.accountId, provider, signer);
  return {
    accountId: options.accountId,
    async quoteSwap({ refContract, poolId, tokenIn, tokenOut, amount, slippageBps }) {
      const quoted = await provider.callFunction({
        contractId: refContract,
        method: "get_return",
        args: { pool_id: poolId, token_in: tokenIn, amount_in: amount, token_out: tokenOut },
      });
      const minAmountOut = (BigInt(String(quoted)) * (BPS - BigInt(slippageBps))) / BPS;
      if (minAmountOut <= 0n) throw new Error("swap quote is too small to protect");
      return { kind: "ref_swap", refContract, poolId, tokenIn, tokenOut, amount, minAmountOut: minAmountOut.toString() };
    },
    async execute({ token, intentHash, policyHash, accountRef, expect }) {
      await options.capabilities.verify(token, { intentHash, policyHash, accountRef });
      await options.capabilities.consume(token.capabilityId);
      const { receiverId, action } = nearAction(expect);
      const sent = await account.signAndSendTransaction({ receiverId, actions: [action], throwOnFailure: false });
      await options.capabilities.commitReservation(token.capabilityId);
      const hash = sent.transaction.hash;
      return {
        txHash: `0x${Buffer.from(baseDecode(hash)).toString("hex")}` as ExecutionRef["txHash"],
        venue: expect.kind === "ref_swap" ? "REF_FINANCE_NEAR" : "NEAR_PAYMENT",
        executedAt: Math.floor(Date.now() / 1000),
        near: { hash, signerId: options.accountId, expect },
      };
    },
  };
}
