import {
  createPublicClient,
  encodeAbiParameters,
  http,
  keccak256,
  parseAbiParameters,
  type Hex,
  type TransactionReceipt,
} from "viem";
import type { Chain } from "viem/chains";
import { buildEvidenceBundle } from "./bundle.js";
import { EvidenceValidationError } from "./validate.js";
import { resolveBaseNetwork } from "./networks.js";
import type { ExecutionRef, VenueAdapter } from "./types.js";

const ERC20_TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" as const;

/** Narrow RPC surface so tests can inject mocks without PublicClient version clashes. */
export type BaseRpcClient = {
  getBlockNumber: () => Promise<bigint>;
  getTransactionReceipt: (args: { hash: Hex }) => Promise<TransactionReceipt>;
};

export type BaseVenueAdapterOptions = {
  rpcUrl?: string;
  /** viem chain (Base mainnet or Base Sepolia). Defaults from SWARAJ_BASE_NETWORK / RPC URL. */
  chain?: Chain;
  /** Required confirmations before FINAL. Default from network config. */
  confirmations?: number;
  pollMs?: number;
  timeoutMs?: number;
  /** Injected client for tests (skips rpcUrl). */
  client?: BaseRpcClient;
  /** Injected sleep for tests. */
  sleep?: (ms: number) => Promise<void>;
};

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function asHexHash(value: Hex): `0x${string}` {
  return value.toLowerCase() as `0x${string}`;
}

function receiptPayloadHash(receipt: TransactionReceipt): `0x${string}` {
  return asHexHash(
    keccak256(
      encodeAbiParameters(parseAbiParameters("bytes32, bytes32, uint256, uint256, uint256"), [
        receipt.transactionHash,
        receipt.blockHash,
        receipt.blockNumber,
        receipt.status === "success" ? 1n : 0n,
        receipt.gasUsed,
      ]),
    ),
  );
}

function logPayloadHash(log: TransactionReceipt["logs"][number], index: number): `0x${string}` {
  const topic0 = (log.topics[0] ?? "0x0") as Hex;
  const topic1 = (log.topics[1] ?? "0x0") as Hex;
  return asHexHash(
    keccak256(
      encodeAbiParameters(parseAbiParameters("address, bytes32, bytes32, bytes, uint256"), [
        log.address,
        topic0,
        topic1,
        log.data,
        BigInt(index),
      ]),
    ),
  );
}

async function waitForConfirmations(params: {
  client: BaseRpcClient;
  txBlock: bigint;
  confirmations: number;
  pollMs: number;
  timeoutMs: number;
  sleep: (ms: number) => Promise<void>;
}): Promise<void> {
  const deadline = Date.now() + params.timeoutMs;
  for (;;) {
    const head = await params.client.getBlockNumber();
    const confirmed = head >= params.txBlock && head - params.txBlock + 1n >= BigInt(params.confirmations);
    if (confirmed) return;
    if (Date.now() >= deadline) {
      throw new EvidenceValidationError(
        `Base finality timeout: need ${params.confirmations} confirmations for block ${params.txBlock}`,
      );
    }
    await params.sleep(params.pollMs);
  }
}

/**
 * Live Base venue adapter: loads tx receipt/logs over RPC and sets FINAL only after N confirmations.
 * Fail-closed on missing/reverted txs and finality timeout. Does not invent FINAL.
 */
export function createBaseVenueAdapter(options: BaseVenueAdapterOptions = {}): VenueAdapter {
  const network = resolveBaseNetwork(process.env);
  const chain = options.chain ?? network.chain;
  const confirmations = options.confirmations ?? network.defaultConfirmations;
  const pollMs = options.pollMs ?? 2_000;
  const timeoutMs = options.timeoutMs ?? 180_000;
  const sleep = options.sleep ?? defaultSleep;

  const client: BaseRpcClient =
    options.client ??
    (() => {
      if (!options.rpcUrl) {
        throw new EvidenceValidationError("createBaseVenueAdapter requires rpcUrl or client");
      }
      const publicClient = createPublicClient({
        chain,
        transport: http(options.rpcUrl),
      });
      return {
        getBlockNumber: () => publicClient.getBlockNumber(),
        getTransactionReceipt: (args) => publicClient.getTransactionReceipt(args),
      };
    })();

  return {
    async collectEvidence(ref: ExecutionRef) {
      if (ref.venue !== "UNISWAP_V3_BASE") {
        throw new EvidenceValidationError(`unsupported venue: ${ref.venue}`);
      }
      if (!/^0x[0-9a-f]{64}$/.test(ref.txHash)) {
        throw new EvidenceValidationError(`invalid txHash: ${ref.txHash}`);
      }

      let receipt: TransactionReceipt;
      try {
        receipt = await client.getTransactionReceipt({ hash: ref.txHash as Hex });
      } catch {
        throw new EvidenceValidationError(`missing transaction receipt: ${ref.txHash}`);
      }
      if (receipt.status !== "success") {
        throw new EvidenceValidationError(`transaction reverted: ${ref.txHash}`);
      }
      if (receipt.blockNumber === null || receipt.blockHash === null) {
        throw new EvidenceValidationError(`receipt not yet mined: ${ref.txHash}`);
      }

      await waitForConfirmations({
        client,
        txBlock: receipt.blockNumber,
        confirmations,
        pollMs,
        timeoutMs,
        sleep,
      });

      const blockHash = asHexHash(receipt.blockHash);
      const timestamp = ref.executedAt;
      const transferLog = receipt.logs.find(
        (log) => log.topics[0]?.toLowerCase() === ERC20_TRANSFER_TOPIC,
      );
      if (!transferLog) {
        throw new EvidenceValidationError(`no ERC20 Transfer log in tx ${ref.txHash}`);
      }
      const transferIndex = receipt.logs.indexOf(transferLog);

      const items = [
        {
          itemId: "item_0001_receipt",
          sourceClass: "CANONICAL_CHAIN_STATE" as const,
          tag: "TX_RECEIPT" as const,
          timestamp,
          payloadHash: receiptPayloadHash(receipt),
          integrity: {
            method: "CHAIN_STATE_PROOF" as const,
            proofHash: blockHash,
          },
        },
        {
          itemId: "item_0002_log",
          sourceClass: "CANONICAL_CHAIN_STATE" as const,
          tag: "TRANSFER_LOG" as const,
          timestamp,
          payloadHash: logPayloadHash(transferLog, transferIndex),
          integrity: {
            method: "CHAIN_STATE_PROOF" as const,
            proofHash: blockHash,
          },
        },
      ];

      return buildEvidenceBundle({
        items,
        collectedAt: timestamp,
        finalityResult: "FINAL",
      });
    },
  };
}
