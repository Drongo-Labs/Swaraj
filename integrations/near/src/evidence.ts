import { createHash } from "node:crypto";
import {
  buildEvidenceBundle,
  EvidenceValidationError,
  normalizeRawArtifacts,
  type EvidenceBundle,
  type FinalityResult,
  type HexHash,
  type MockEvidenceFixture,
} from "@swaraj/evidence";
import { DEFAULT_NEAR_MOCK_FIXTURES } from "./fixtures.js";
import type { NearExecutionRef, NearExpectation } from "./types.js";

export type NearVenueAdapter = {
  collectEvidence(ref: NearExecutionRef): Promise<EvidenceBundle>;
};

/** Fixture adapter keyed by txHash. Unknown evidence fails closed and never invents FINAL. */
export function createNearMockVenueAdapter(
  fixtures: Readonly<Record<string, MockEvidenceFixture>> = DEFAULT_NEAR_MOCK_FIXTURES,
): NearVenueAdapter {
  return {
    async collectEvidence(ref: NearExecutionRef) {
      if (ref.venue !== "REF_FINANCE_NEAR" && ref.venue !== "NEAR_PAYMENT") {
        throw new EvidenceValidationError(`unsupported venue for NEAR adapter: ${ref.venue}`);
      }
      const fixture = fixtures[ref.txHash];
      if (fixture === undefined) {
        throw new EvidenceValidationError(`unknown NEAR execution txHash: ${ref.txHash}`);
      }
      const items = normalizeRawArtifacts(fixture.artifacts);
      const finalityResult =
        fixture.finalityResult ?? (fixture.conflict === true ? "CONFLICT" : "PENDING");
      return buildEvidenceBundle({
        items,
        collectedAt: ref.executedAt,
        finalityResult,
      });
    },
  };
}

type NearTxAction = {
  Transfer?: { deposit: string };
  FunctionCall?: { method_name: string; args: string };
};

type NearTxResult = {
  final_execution_status?: string;
  status: Record<string, unknown>;
  transaction: { receiver_id: string; actions: Array<NearTxAction | string> };
  receipts_outcome: Array<{ id: string; outcome: { status: Record<string, unknown> } }>;
};

const RPC_ATTEMPTS = 6;

function sha256(text: string): HexHash {
  return `0x${createHash("sha256").update(text).digest("hex")}` as HexHash;
}

/** True only when the on-chain transaction is exactly the approved action. */
export function nearTxMatches(tx: NearTxResult["transaction"], expect: NearExpectation): boolean {
  if (tx.actions.length !== 1) return false;
  const action = tx.actions[0];
  if (action === undefined || typeof action === "string") return false;
  if (expect.kind === "transfer") {
    return tx.receiver_id === expect.receiverId && action.Transfer?.deposit === expect.amount;
  }
  const call = action.FunctionCall;
  if (call === undefined) return false;
  try {
    const args = JSON.parse(Buffer.from(call.args, "base64").toString("utf8")) as Record<string, unknown>;
    if (expect.kind === "ft_transfer") {
      return tx.receiver_id === expect.contractId
        && call.method_name === "ft_transfer"
        && args.receiver_id === expect.receiverId
        && args.amount === expect.amount;
    }
    if (tx.receiver_id !== expect.tokenIn || call.method_name !== "ft_transfer_call") return false;
    if (args.receiver_id !== expect.refContract || args.amount !== expect.amount) return false;
    const msg = JSON.parse(String(args.msg)) as { actions?: Array<Record<string, unknown>> };
    const step = msg.actions?.[0];
    return msg.actions?.length === 1
      && step?.pool_id === expect.poolId
      && step.token_in === expect.tokenIn
      && step.token_out === expect.tokenOut
      && step.min_amount_out === expect.minAmountOut;
  } catch {
    return false;
  }
}

/** ft_transfer_call can report success after refunding, so the amount used shows whether the swap ran. */
function swapConsumedAmount(status: NearTxResult["status"], amount: string): boolean {
  const value = status.SuccessValue;
  if (typeof value !== "string") return false;
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8")) === amount;
  } catch {
    return false;
  }
}

/**
 * FINAL only when the chain says so, the transaction matches and nothing failed.
 * ponytail: proofHash does not verify the Merkle path; do that here or in the guest to drop RPC trust.
 */
export function createNearVenueAdapter(options: {
  rpcUrl: string;
  fetchImpl?: typeof fetch;
  /** First retry delay; doubles each attempt. */
  retryDelayMs?: number;
}): NearVenueAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const retryDelayMs = options.retryDelayMs ?? 1000;
  const rpc = async <T>(method: string, params: unknown): Promise<T> => {
    // By now the transaction is on chain, so a busy RPC must not turn it into cant_prove.
    for (let attempt = 1; ; attempt += 1) {
      let response: Response | undefined;
      try {
        response = await fetchImpl(options.rpcUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: "swaraj", method, params }),
        });
      } catch (error) {
        if (attempt >= RPC_ATTEMPTS) throw error;
      }
      if (response?.ok) {
        const body = (await response.json()) as { result?: T; error?: unknown };
        if (body.result === undefined) {
          throw new EvidenceValidationError(`NEAR RPC ${method} failed: ${JSON.stringify(body.error).slice(0, 200)}`);
        }
        return body.result;
      }
      if (response && response.status !== 429 && response.status < 500) {
        throw new EvidenceValidationError(`NEAR RPC ${method} returned ${response.status}`);
      }
      if (attempt >= RPC_ATTEMPTS) {
        throw new EvidenceValidationError(`NEAR RPC ${method} returned ${response?.status ?? "no response"}`);
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * 2 ** (attempt - 1)));
    }
  };

  return {
    async collectEvidence(ref: NearExecutionRef) {
      if (ref.near === undefined) throw new EvidenceValidationError("live NEAR evidence needs a NEAR transaction reference");
      const { hash, signerId, expect } = ref.near;
      const tx = await rpc<NearTxResult>("tx", { tx_hash: hash, sender_account_id: signerId, wait_until: "FINAL" });
      if (!nearTxMatches(tx.transaction, expect)) {
        throw new EvidenceValidationError(`NEAR transaction ${hash} does not match the approved action`);
      }
      const head = await rpc<{ header: { hash: string } }>("block", { finality: "final" });
      const proof = await rpc<unknown>("EXPERIMENTAL_light_client_proof", {
        type: "transaction",
        transaction_hash: hash,
        sender_id: signerId,
        light_client_head: head.header.hash,
      });

      const failed = "Failure" in tx.status
        || tx.receipts_outcome.some((r) => "Failure" in r.outcome.status)
        || (expect.kind === "ref_swap" && !swapConsumedAmount(tx.status, expect.amount));
      const finalityResult: FinalityResult = failed
        ? "CONFLICT"
        : tx.final_execution_status === "FINAL" ? "FINAL" : "PENDING";
      const proofHash = sha256(JSON.stringify(proof));
      const integrity = { method: "CHAIN_STATE_PROOF" as const, proofHash };
      return buildEvidenceBundle({
        items: normalizeRawArtifacts([
          {
            itemId: "near_item_0001_receipt",
            sourceClass: "CANONICAL_CHAIN_STATE",
            tag: "TX_RECEIPT",
            timestamp: ref.executedAt,
            payloadHash: ref.txHash,
            integrity,
          },
          {
            itemId: "near_item_0002_log",
            sourceClass: "CANONICAL_CHAIN_STATE",
            tag: "TRANSFER_LOG",
            timestamp: ref.executedAt,
            payloadHash: sha256(tx.receipts_outcome.map((r) => r.id).sort().join(",")),
            integrity,
          },
        ]),
        collectedAt: Math.floor(Date.now() / 1000),
        finalityResult,
      });
    },
  };
}
