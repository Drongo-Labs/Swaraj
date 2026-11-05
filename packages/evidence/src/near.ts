import { createHash } from "node:crypto";
import { normalizeRawArtifacts } from "./normalize.js";
import { buildEvidenceBundle } from "./bundle.js";
import { EvidenceValidationError } from "./validate.js";
import type { ExecutionRef, FinalityResult, HexHash, MockEvidenceFixture, NearExpectation, VenueAdapter } from "./types.js";
import { NEAR_KNOWN_TX_HASH, NEAR_FINAL_TX_HASH, NEAR_MISSING_TX_HASH, DEFAULT_NEAR_MOCK_FIXTURES } from "./nearFixtures.js";

export { NEAR_KNOWN_TX_HASH, NEAR_FINAL_TX_HASH, NEAR_MISSING_TX_HASH, DEFAULT_NEAR_MOCK_FIXTURES };

/**
 * Fixture NEAR venue adapter (Phase 2). Exact-input by txHash.
 * Unknown / missing evidence fails closed — never invents FINAL.
 */
export function createNearMockVenueAdapter(
  fixtures: Readonly<Record<string, MockEvidenceFixture>> = DEFAULT_NEAR_MOCK_FIXTURES,
): VenueAdapter {
  return {
    async collectEvidence(ref: ExecutionRef) {
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
  if (tx.receiver_id !== expect.contractId || call?.method_name !== "ft_transfer") return false;
  try {
    const args = JSON.parse(Buffer.from(call.args, "base64").toString("utf8")) as Record<string, unknown>;
    return args.receiver_id === expect.receiverId && args.amount === expect.amount;
  } catch {
    return false;
  }
}

/**
 * Live NEAR evidence over JSON-RPC. FINAL is claimed only when the chain says
 * FINAL, the transaction matches the approved action, and nothing failed.
 * ponytail: proofHash commits to the RPC's light-client proof but does not
 * verify its Merkle path; verify it here or in the guest to drop RPC trust.
 */
export function createNearVenueAdapter(options: {
  rpcUrl: string;
  fetchImpl?: typeof fetch;
}): VenueAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const rpc = async <T>(method: string, params: unknown): Promise<T> => {
    const response = await fetchImpl(options.rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: "swaraj", method, params }),
    });
    if (!response.ok) throw new EvidenceValidationError(`NEAR RPC ${method} returned ${response.status}`);
    const body = (await response.json()) as { result?: T; error?: unknown };
    if (body.result === undefined) {
      throw new EvidenceValidationError(`NEAR RPC ${method} failed: ${JSON.stringify(body.error).slice(0, 200)}`);
    }
    return body.result;
  };

  return {
    async collectEvidence(ref: ExecutionRef) {
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

      const failed = "Failure" in tx.status || tx.receipts_outcome.some((r) => "Failure" in r.outcome.status);
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
