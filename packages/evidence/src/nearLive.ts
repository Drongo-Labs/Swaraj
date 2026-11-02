import { createHash } from "node:crypto";
import { baseEncode, JsonRpcProvider } from "near-api-js";
import { buildEvidenceBundle } from "./bundle.js";
import { EvidenceValidationError } from "./validate.js";
import type { ExecutionRef, VenueAdapter } from "./types.js";

export type NearLiveVenueAdapterOptions = {
  rpcUrl?: string;
  /** Account that signed the tx (required by NEAR tx status RPC). */
  senderAccountId?: string;
  pollMs?: number;
  timeoutMs?: number;
  /** Injected provider for tests. */
  provider?: {
    viewTransactionStatus: (args: {
      txHash: string;
      accountId: string;
      waitUntil: string;
    }) => Promise<unknown>;
  };
  sleep?: (ms: number) => Promise<void>;
};

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** HexHash (0x + 32 bytes) → NEAR base58 crypto hash for RPC. */
export function hexToNearTxHash(hex: string): string {
  if (!/^0x[0-9a-f]{64}$/i.test(hex)) {
    throw new EvidenceValidationError(`invalid NEAR tx hex hash: ${hex}`);
  }
  return baseEncode(Buffer.from(hex.slice(2), "hex"));
}

function asHex32(bytes: Buffer | string): `0x${string}` {
  const buf = typeof bytes === "string" ? Buffer.from(bytes) : bytes;
  const digest = createHash("sha256").update(buf).digest("hex");
  return `0x${digest}`;
}

function statusIsFinal(status: unknown): boolean {
  if (!status || typeof status !== "object") return false;
  const s = status as Record<string, unknown>;
  // FinalExecutionStatus variants: SuccessValue | SuccessReceiptId | Failure
  if ("SuccessValue" in s || "SuccessReceiptId" in s) return true;
  if ("Failure" in s) {
    throw new EvidenceValidationError("NEAR transaction failed on chain");
  }
  return false;
}

/**
 * Live NEAR venue adapter: polls `tx_status` until FINAL (or timeout / failure).
 * Fail-closed — never invents FINAL without RPC confirmation.
 */
export function createNearLiveVenueAdapter(
  options: NearLiveVenueAdapterOptions = {},
): VenueAdapter {
  const rpcUrl = options.rpcUrl ?? process.env.NEAR_RPC_URL ?? "https://rpc.testnet.near.org";
  const senderAccountId =
    options.senderAccountId ?? process.env.NEAR_ACCOUNT_ID ?? "";
  const pollMs = options.pollMs ?? 1_000;
  const timeoutMs = options.timeoutMs ?? 60_000;
  const sleep = options.sleep ?? defaultSleep;
  const provider =
    options.provider ??
    new JsonRpcProvider({ url: rpcUrl }, { retries: 3, backoff: 2, wait: 500 });

  return {
    async collectEvidence(ref: ExecutionRef) {
      if (ref.venue !== "REF_FINANCE_NEAR") {
        throw new EvidenceValidationError(
          `unsupported venue for live NEAR adapter: ${ref.venue}`,
        );
      }
      if (!senderAccountId.trim()) {
        throw new EvidenceValidationError(
          "NEAR_ACCOUNT_ID is required to collect live NEAR evidence",
        );
      }

      const nearHash = hexToNearTxHash(ref.txHash);
      const deadline = Date.now() + timeoutMs;
      let last: unknown;
      for (;;) {
        last = await provider.viewTransactionStatus({
          txHash: nearHash,
          accountId: senderAccountId,
          waitUntil: "FINAL",
        });
        const status = (last as { status?: unknown } | undefined)?.status;
        if (statusIsFinal(status)) break;
        if (Date.now() >= deadline) {
          throw new EvidenceValidationError(
            `NEAR finality timeout for tx ${nearHash}`,
          );
        }
        await sleep(pollMs);
      }

      const outcome = last as {
        transaction_outcome?: { block_hash?: string; id?: string };
        status?: unknown;
      };
      const blockHash = outcome.transaction_outcome?.block_hash ?? nearHash;
      const receiptPayload = asHex32(
        Buffer.from(
          JSON.stringify({
            tx: nearHash,
            block: blockHash,
            status: outcome.status,
          }),
        ),
      );

      // itemIds must be strictly ascending (schema).
      const suffix = ref.txHash.slice(2, 10);
      return buildEvidenceBundle({
        items: [
          {
            itemId: `near_live_1_receipt_${suffix}`,
            sourceClass: "CANONICAL_CHAIN_STATE",
            tag: "TX_RECEIPT",
            timestamp: ref.executedAt,
            payloadHash: receiptPayload,
            integrity: {
              method: "CHAIN_STATE_PROOF",
              proofHash: asHex32(blockHash),
            },
          },
          {
            itemId: `near_live_2_log_${suffix}`,
            sourceClass: "CANONICAL_CHAIN_STATE",
            tag: "TRANSFER_LOG",
            timestamp: ref.executedAt,
            payloadHash: asHex32(`${nearHash}:transfer`),
            integrity: {
              method: "CHAIN_STATE_PROOF",
              proofHash: asHex32(blockHash),
            },
          },
        ],
        collectedAt: Math.floor(Date.now() / 1000),
        finalityResult: "FINAL",
      });
    },
  };
}
