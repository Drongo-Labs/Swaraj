import { Account, type KeyPairString } from "near-api-js";
import { parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import type { ZunnoAgentConfig } from "../config.js";

/**
 * Settles a finished match through a proof. The referee asks the live Swaraj
 * API to allow a `payout` of the whole pot to the winner, waits until that
 * decision's receipt is PROVED on NEAR, then calls the escrow, which pays only
 * against that proved receipt (contracts/wager).
 */

export interface SettleConfig {
  escrow: string;
  refereeAccountId: string;
  refereePrivateKey: string;
  rpcUrl: string;
  apiToken: string;
}

export function settleConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SettleConfig | undefined {
  const escrow = env.ZUNNO_WAGER_ESCROW?.trim();
  const refereeAccountId = env.ZUNNO_REFEREE_ACCOUNT_ID?.trim();
  const refereePrivateKey = env.ZUNNO_REFEREE_PRIVATE_KEY?.trim();
  const apiToken = env.SWARAJ_DEV_TOKEN?.trim();
  if (!escrow || !refereeAccountId || !refereePrivateKey || !apiToken) return undefined;
  return { escrow, refereeAccountId, refereePrivateKey, apiToken, rpcUrl: env.NEAR_RPC_URL?.trim() || "https://rpc.testnet.near.org" };
}

export interface SettleDeps {
  fetchImpl: typeof fetch;
  /** Reads the escrow's pot (yoctoNEAR, decimal string). */
  pot: () => Promise<string>;
  /** Calls the escrow's payout; returns the transaction hash. */
  payout: (args: { winner: string; receipt_id: string; statement: string; action_wire: string }) => Promise<string>;
  sleep: (ms: number) => Promise<void>;
  pollMs?: number;
  timeoutMs?: number;
}

export function nearDeps(config: SettleConfig): Pick<SettleDeps, "pot" | "payout"> {
  const account = new Account(config.refereeAccountId, config.rpcUrl, config.refereePrivateKey as KeyPairString);
  return {
    pot: async () => String(await account.provider.callFunction({ contractId: config.escrow, method: "pot_amount", args: {} })),
    payout: async (args) => {
      const sent = await account.callFunctionRaw({
        contractId: config.escrow,
        methodName: "payout",
        args,
        gas: 100_000_000_000_000n,
        deposit: 0n,
        waitUntil: "FINAL",
      });
      const status = (sent as { status?: unknown }).status;
      if (status && typeof status === "object" && "Failure" in status) throw new Error(`payout failed: ${JSON.stringify(status)}`);
      return String((sent as { transaction?: { hash?: string } }).transaction?.hash ?? "");
    },
  };
}

/** The action the mandate must allow: pay the whole pot of `escrow` to `winner`. */
export function payoutAction(config: ZunnoAgentConfig, escrow: string, winner: string, amount: string, now = Date.now()) {
  return {
    intentId: `zunno-payout-${now}`,
    agent: config.agentId,
    action: "APP_ACTION",
    resource: { app: "zunno", target: escrow },
    context: { name: "payout", params: { winner, amount } },
    policyHash: `0x${"0".repeat(64)}`,
    timestamp: now,
    expiry: now + 3_600_000,
    idempotencyKey: `zunno-payout-${now}`,
    signature: config.signature,
  };
}

/** NearProofSink's receipt id for a statement (packages/proofs/src/near-sink.ts). */
export function nearReceiptId(statementId: string): string {
  return `receipt_${statementId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}

export type SettleEvent = { kind: "submitted"; receiptId: string; amount: string } | { kind: "paid"; txHash: string; amount: string };

export async function settleMatch(
  zunno: ZunnoAgentConfig,
  config: SettleConfig,
  winner: string,
  deps: SettleDeps,
  onEvent: (event: SettleEvent) => void = () => {},
): Promise<{ txHash: string; amount: string }> {
  const amount = await deps.pot();
  if (!/^\d+$/.test(amount) || BigInt(amount) === 0n) throw new Error("the escrow holds no wagers");
  const base = `${zunno.swarajApiUrl}/v1/applications/${zunno.applicationId}`;
  const headers = { authorization: `Bearer ${config.apiToken}`, "content-type": "application/json" };

  const submitted = await deps.fetchImpl(`${base}/unified-actions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action: payoutAction(zunno, config.escrow, winner, amount) }),
  });
  const decision = (await submitted.json()) as { decision?: string; receiptId?: string };
  if (decision.decision !== "ALLOW" || !decision.receiptId) throw new Error(`the mandate did not allow the payout (${decision.decision ?? submitted.status})`);
  onEvent({ kind: "submitted", receiptId: decision.receiptId, amount });

  // The bundle is served once the receipt is PROVED, which takes a Groth16 proof (minutes).
  const deadline = Date.now() + (deps.timeoutMs ?? 20 * 60_000);
  for (;;) {
    const response = await deps.fetchImpl(`${base}/receipts/${decision.receiptId}/bundle`, { headers });
    if (response.status === 200) {
      const bundle = (await response.json()) as { statementId: string; statementText: string; action: unknown };
      const txHash = await deps.payout({
        winner,
        receipt_id: nearReceiptId(bundle.statementId),
        statement: bundle.statementText,
        action_wire: serializeUnifiedAction(parseUnifiedAction(bundle.action)),
      });
      onEvent({ kind: "paid", txHash, amount });
      return { txHash, amount };
    }
    if (response.status !== 409) throw new Error(`receipt bundle request failed: ${response.status}`);
    if (Date.now() >= deadline) throw new Error("the payout's proof did not settle in time");
    await deps.sleep(deps.pollMs ?? 15_000);
  }
}
