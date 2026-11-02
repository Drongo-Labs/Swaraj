import { createHash } from "node:crypto";
import {
  Account,
  actions,
  baseDecode,
  KeyPair,
  type KeyPairString,
} from "near-api-js";
import type { ExecutionRef } from "@swaraj/evidence";
import { CapabilityError, type CapabilityService } from "./service.js";
import type { ExecutionAdapter } from "./execution.js";
import type { CapabilityToken } from "./types.js";

/** Logical NEAR action passed from the unified-action path (not EVM trade fields). */
export type NearExecutionAction = {
  kind: "SPOT_TRADE" | "PAYMENT";
  /** Atomic amount as decimal string (e.g. USDC 6dp). */
  amount: string;
  /** Payment recipient or trade counterparty/sink. */
  receiverId: string;
  assetIn?: string;
  assetOut?: string;
  memo?: string;
};

export type NearLiveExecutionOptions = {
  rpcUrl?: string;
  accountId?: string;
  privateKey?: string;
  /**
   * Optional NEP-141 contract. When set, payments/trades use `ft_transfer`.
   * When unset, settles with native NEAR using `nativeYoctoPerUnit`.
   */
  ftContract?: string;
  /**
   * yoctoNEAR per 1 atomic unit of the logical amount
   * (default: 1e9 → 1 USDC = 0.001 NEAR, 50 USDC trade ≈ 0.05 NEAR).
   * Only used when `ftContract` is unset.
   */
  nativeYoctoPerUnit?: bigint;
  /** Optional Account injector for tests. */
  account?: Account;
};

const DEFAULT_YOCTO_PER_UNIT = 10n ** 9n;
const FT_GAS = 30n * 10n ** 12n; // 30 TGas
const FT_DEPOSIT = 1n; // 1 yocto for storage-checked ft_transfer

/** Map a NEAR account id into the capability `accountRef` hex slot. */
export function nearAccountRef(accountId: string): `0x${string}` {
  const digest = createHash("sha256").update(`near:${accountId}`).digest("hex");
  return `0x${digest}`;
}

/** Convert a 32-byte NEAR crypto hash (base58) into schema HexHash. */
export function nearTxHashToHex(nearHash: string): `0x${string}` {
  if (/^0x[0-9a-f]{64}$/i.test(nearHash)) {
    return nearHash.toLowerCase() as `0x${string}`;
  }
  const bytes = baseDecode(nearHash);
  if (bytes.length !== 32) {
    // Fail closed on unexpected shapes — hash the raw string into 32 bytes.
    const digest = createHash("sha256").update(nearHash).digest("hex");
    return `0x${digest}`;
  }
  return `0x${Buffer.from(bytes).toString("hex")}`;
}

function requireNearAction(action: NearExecutionAction | undefined): NearExecutionAction {
  if (!action) {
    throw new CapabilityError("NEAR execution requires nearAction fields");
  }
  if (!/^(0|[1-9][0-9]*)$/.test(action.amount) || BigInt(action.amount) <= 0n) {
    throw new CapabilityError("NEAR execution amount must be a positive decimal string");
  }
  if (!action.receiverId.trim()) {
    throw new CapabilityError("NEAR execution requires receiverId");
  }
  return action;
}

function resolveAccount(options: NearLiveExecutionOptions): Account {
  if (options.account) return options.account;
  const rpcUrl = options.rpcUrl ?? process.env.NEAR_RPC_URL ?? "https://rpc.testnet.near.org";
  const accountId = options.accountId ?? process.env.NEAR_ACCOUNT_ID;
  const privateKey = options.privateKey ?? process.env.NEAR_PRIVATE_KEY;
  if (!accountId?.trim() || !privateKey?.trim()) {
    throw new CapabilityError(
      "Live NEAR execution requires NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY",
    );
  }
  const key = privateKey.startsWith("ed25519:")
    ? (privateKey as KeyPairString)
    : (`ed25519:${privateKey}` as KeyPairString);
  // Validate key early (throws on bad format).
  KeyPair.fromString(key);
  return new Account(accountId, rpcUrl, key);
}

function extractTxHash(result: unknown): string {
  const r = result as {
    transaction?: { hash?: string };
    transaction_outcome?: { id?: string };
  };
  const hash = r.transaction?.hash ?? r.transaction_outcome?.id;
  if (!hash || typeof hash !== "string") {
    throw new CapabilityError("NEAR RPC response missing transaction hash");
  }
  return hash;
}

/**
 * Live NEAR execution adapter.
 * verify → sign+broadcast on NEAR testnet/mainnet → consume/commit → ExecutionRef.
 *
 * Settlement:
 * - If NEAR_FT_CONTRACT / ftContract is set: NEP-141 `ft_transfer` of `amount`.
 * - Else: native NEAR transfer of `amount * nativeYoctoPerUnit` (demo scale).
 *
 * Always returns venue `REF_FINANCE_NEAR` so the NEAR evidence adapter collects finality.
 */
export function createNearLiveExecutionAdapter(
  capabilities: CapabilityService,
  options: NearLiveExecutionOptions = {},
): ExecutionAdapter & {
  executeNear(params: {
    token: CapabilityToken;
    intentHash: string;
    policyHash: string;
    accountRef: string;
    now?: number;
    nearAction: NearExecutionAction;
  }): Promise<ExecutionRef>;
} {
  const ftContract =
    options.ftContract?.trim() || process.env.NEAR_FT_CONTRACT?.trim() || undefined;
  const yoctoPerUnit =
    options.nativeYoctoPerUnit ??
    (process.env.NEAR_YOCTO_PER_UNIT
      ? BigInt(process.env.NEAR_YOCTO_PER_UNIT)
      : DEFAULT_YOCTO_PER_UNIT);

  const run = async (params: {
    token: CapabilityToken;
    intentHash: string;
    policyHash: string;
    accountRef: string;
    now?: number;
    nearAction?: NearExecutionAction;
  }): Promise<ExecutionRef> => {
    const nearAction = requireNearAction(params.nearAction);
    await capabilities.verify(params.token, {
      intentHash: params.intentHash,
      policyHash: params.policyHash,
      accountRef: params.accountRef,
      ...(params.now !== undefined ? { now: params.now } : {}),
    });

    const account = resolveAccount(options);
    let rpcResult: unknown;
    if (ftContract) {
      rpcResult = await account.signAndSendTransaction({
        receiverId: ftContract,
        actions: [
          actions.functionCall(
            "ft_transfer",
            {
              receiver_id: nearAction.receiverId,
              amount: nearAction.amount,
              memo: nearAction.memo ?? `swaraj:${nearAction.kind}`,
            },
            FT_GAS,
            FT_DEPOSIT,
          ),
        ],
        waitUntil: "EXECUTED_OPTIMISTIC",
      });
    } else {
      const yocto = BigInt(nearAction.amount) * yoctoPerUnit;
      rpcResult = await account.transfer({
        receiverId: nearAction.receiverId,
        amount: yocto,
      });
    }

    const nearHash = extractTxHash(rpcResult);
    await capabilities.consume(params.token.capabilityId);
    await capabilities.commitReservation(params.token.capabilityId);
    return {
      txHash: nearTxHashToHex(nearHash),
      venue: "REF_FINANCE_NEAR",
      executedAt: params.now ?? Math.floor(Date.now() / 1000),
    };
  };

  return {
    async execute(params) {
      // Pipeline-compatible entry: nearAction must be supplied by the NEAR path.
      return run(params as Parameters<typeof run>[0]);
    },
    async executeNear(params) {
      return run(params);
    },
  };
}

/** True when live NEAR credentials are present in env. */
export function isNearLiveConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.NEAR_ACCOUNT_ID?.trim() && env.NEAR_PRIVATE_KEY?.trim());
}
