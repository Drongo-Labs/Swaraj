import { createHash } from "node:crypto";
import { Account, actions, type KeyPairString } from "near-api-js";
import type { BundleProof, VerificationBundle } from "./artifacts.js";
import type { ProofSink, SinkAttestation } from "./zkverify.js";

function asKey(privateKey: string): KeyPairString {
  return (privateKey.startsWith("ed25519:")
    ? privateKey
    : `ed25519:${privateKey}`) as KeyPairString;
}

/** Groth16 payload the on-chain receipts `prove` method expects (hex from host export). */
export type NearGroth16Proof = BundleProof;

export type NearProofSinkConfig = {
  rpcUrl?: string;
  accountId: string;
  privateKey: string;
  /** Deployed `swaraj-receipts` account. */
  receiptsContractId: string;
  /**
   * Resolve the Groth16 bytes for this bundle. When omitted, the bundle's own
   * `proof` (attached by the worker after proving) is used.
   */
  resolveProof?: (bundle: VerificationBundle) => NearGroth16Proof | Promise<NearGroth16Proof>;
  /** Optional app_id stored on the receipt (default app_demo). */
  appId?: string;
  pollIntervalMs?: number;
  timeoutMs?: number;
  /** Gas for `prove` (needs room for the verifier callback). Default 100 Tgas. */
  proveGas?: bigint;
};

export type NearReceiptRecord = {
  receipt_id: string;
  app_id: string;
  intent_digest: string;
  claim_hash: string;
  state: "Pending" | "Proved" | "NonProvable" | "Invalidated" | string;
  proof_ref: string | null;
  updated_at: number | string;
};

function hexToBase64(hex: string): string {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Buffer.from(clean, "hex").toString("base64");
}

/** Lowercase hex SHA-256 of the statement bytes — must match the receipts contract. */
export function claimHashFromStatement(statement: string): string {
  return createHash("sha256").update(statement, "utf8").digest("hex");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Proof sink that records a PENDING receipt on NEAR, then calls `prove` so the
 * receipt reaches PROVED only after Ayush's verifier accepts the Groth16 proof.
 */
export class NearProofSink implements ProofSink {
  private readonly rpcUrl: string;
  private readonly pollIntervalMs: number;
  private readonly timeoutMs: number;
  private readonly proveGas: bigint;
  private readonly appId: string;

  constructor(private readonly config: NearProofSinkConfig) {
    this.rpcUrl = config.rpcUrl ?? "https://rpc.testnet.near.org";
    this.pollIntervalMs = config.pollIntervalMs ?? 2_000;
    this.timeoutMs = config.timeoutMs ?? 120_000;
    this.proveGas = config.proveGas ?? 100_000_000_000_000n;
    this.appId = config.appId ?? "app_demo";
  }

  private account(): Account {
    return new Account(this.config.accountId, this.rpcUrl, asKey(this.config.privateKey));
  }

  async submit(bundle: VerificationBundle): Promise<SinkAttestation> {
    const proof = this.config.resolveProof
      ? await this.config.resolveProof(bundle)
      : bundle.proof;
    if (!proof) {
      throw new Error("no Groth16 proof: the bundle carries none and no resolveProof is configured");
    }
    const claimHash = claimHashFromStatement(bundle.canonicalText);
    const receiptId = `receipt_${bundle.statementId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
    const account = this.account();
    const contractId = this.config.receiptsContractId;

    try {
      await account.callFunction({
        contractId,
        methodName: "create_pending",
        args: {
          receipt_id: receiptId,
          app_id: this.appId,
          intent_digest: bundle.statementId,
          claim_hash: claimHash,
        },
        gas: 30_000_000_000_000n,
        deposit: 0n,
        waitUntil: "FINAL",
      });
    } catch (error) {
      // A retry after a successful create_pending must reuse the receipt.
      if (!String(error).includes("already exists")) throw error;
    }

    // A retry after a successful prove must not prove again.
    const existing = (await account.callFunction({
      contractId,
      methodName: "get",
      args: { receipt_id: receiptId },
    })) as NearReceiptRecord | null;
    if (existing?.state === "Proved" && existing.proof_ref) return { ref: existing.proof_ref, sink: "near" };

    await account.callFunction({
      contractId,
      methodName: "prove",
      args: {
        receipt_id: receiptId,
        program: proof.program,
        public_values: hexToBase64(proof.publicValuesHex),
        proof: hexToBase64(proof.proofHex),
      },
      gas: this.proveGas,
      deposit: 0n,
      waitUntil: "FINAL",
    });

    const deadline = Date.now() + this.timeoutMs;
    for (;;) {
      const record = (await account.callFunction({
        contractId,
        methodName: "get",
        args: { receipt_id: receiptId },
      })) as NearReceiptRecord | null;

      if (record?.state === "Proved" && record.proof_ref) {
        return { ref: record.proof_ref, sink: "near" };
      }
      if (record?.state === "NonProvable" || record?.state === "Invalidated") {
        throw new Error(`NEAR receipt ended in ${record.state}`);
      }
      if (Date.now() >= deadline) {
        throw new Error(
          `NEAR receipt ${receiptId} not PROVED within ${this.timeoutMs}ms (state=${record?.state ?? "missing"})`,
        );
      }
      await delay(this.pollIntervalMs);
    }
  }
}

/** Deploy helper kept next to the sink for one-shot testnet scripts. */
export async function deployNearWasm(params: {
  accountId: string;
  privateKey: string;
  rpcUrl?: string;
  wasm: Uint8Array;
  initMethod: string;
  initArgs: Record<string, unknown>;
}): Promise<string> {
  const account = new Account(
    params.accountId,
    params.rpcUrl ?? "https://rpc.testnet.near.org",
    asKey(params.privateKey),
  );
  const deployRes = await account.signAndSendTransaction({
    receiverId: params.accountId,
    actions: [actions.deployContract(Buffer.from(params.wasm))],
    waitUntil: "FINAL",
  });
  await account.callFunction({
    contractId: params.accountId,
    methodName: params.initMethod,
    args: params.initArgs,
    gas: 30_000_000_000_000n,
    deposit: 0n,
    waitUntil: "FINAL",
  });
  const hash =
    (deployRes as { transaction?: { hash?: string } }).transaction?.hash ??
    (deployRes as { transaction_outcome?: { id?: string } }).transaction_outcome?.id;
  if (!hash) throw new Error("deploy missing tx hash");
  return hash;
}
