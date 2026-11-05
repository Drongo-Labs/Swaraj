import {
  NEAR_FINAL_TX_HASH,
  NEAR_KNOWN_TX_HASH,
  type EvidenceVenue,
  type ExecutionRef,
  type NearExpectation,
} from "@swaraj/evidence";
import { Account, JsonRpcProvider, KeyPairSigner, actions, baseDecode, type KeyPairString } from "near-api-js";
import type { CapabilityService } from "./service.js";
import type { CapabilityToken } from "./types.js";
import type { ExecutionAdapter } from "./execution.js";

export type NearMockExecutionOptions = {
  /** When true (or SWARAJ_EVIDENCE_FINALITY=FINAL), return FINAL fixture hash. */
  declareFinal?: boolean;
  /** Venue the fixture reports. Default REF_FINANCE_NEAR. */
  venue?: EvidenceVenue;
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
  /** Verifies and consumes the capability, then sends exactly `expect` on chain. */
  execute(params: {
    token: CapabilityToken;
    intentHash: string;
    policyHash: string;
    accountRef: string;
    expect: NearExpectation;
  }): Promise<ExecutionRef>;
};

const FT_TRANSFER_GAS = 30_000_000_000_000n;
const ONE_YOCTO = 1n;

/** Live NEAR payments. The capability is consumed before signing, so a retry can never pay twice. */
export function createNearPaymentExecutor(options: NearLiveOptions): NearPaymentExecutor {
  const provider = new JsonRpcProvider({ url: options.rpcUrl });
  const signer = KeyPairSigner.fromSecretKey(options.privateKey as KeyPairString);
  const account = new Account(options.accountId, provider, signer);
  return {
    accountId: options.accountId,
    async execute({ token, intentHash, policyHash, accountRef, expect }) {
      await options.capabilities.verify(token, { intentHash, policyHash, accountRef });
      await options.capabilities.consume(token.capabilityId);
      const receiverId = expect.kind === "transfer" ? expect.receiverId : expect.contractId;
      const action =
        expect.kind === "transfer"
          ? actions.transfer(BigInt(expect.amount))
          : actions.functionCall(
              "ft_transfer",
              { receiver_id: expect.receiverId, amount: expect.amount },
              FT_TRANSFER_GAS,
              ONE_YOCTO,
            );
      const sent = await account.signAndSendTransaction({ receiverId, actions: [action], throwOnFailure: false });
      await options.capabilities.commitReservation(token.capabilityId);
      const hash = sent.transaction.hash;
      return {
        txHash: `0x${Buffer.from(baseDecode(hash)).toString("hex")}` as ExecutionRef["txHash"],
        venue: "NEAR_PAYMENT",
        executedAt: Math.floor(Date.now() / 1000),
        near: { hash, signerId: options.accountId, expect },
      };
    },
  };
}
