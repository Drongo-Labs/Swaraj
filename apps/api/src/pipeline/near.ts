import { createHash } from "node:crypto";
import {
  createNearMockExecutionAdapter,
  createNearPaymentExecutor,
  type CapabilityService,
} from "@swaraj/capability";
import type { Hex, Signer } from "@swaraj/crypto";
import {
  createNearMockVenueAdapter,
  createNearVenueAdapter,
  type EvidenceBundle,
  type ExecutionRef,
  type NearExpectation,
} from "@swaraj/evidence";
import type { UnifiedAction } from "@swaraj/schemas";

export const NEAR_TRANSFER_SERVICE = "near_transfer";
export const NEAR_FT_TRANSFER_SERVICE = "near_ft_transfer";
const REF_FINANCE_VENUE = "REF_FINANCE_NEAR";
const DEFAULT_RPC_URL = "https://rpc.testnet.near.org";
const DEFAULT_REF_CONTRACT = "ref-finance-101.testnet";
const CAPABILITY_TTL_SECONDS = 120;

export type NearSettlement =
  | { status: "FINAL"; evidenceDigest: string; txHash: string; nearTx?: string; near?: ExecutionRef["near"] }
  | { status: "NOT_PROVABLE"; reason: string; txHash?: string; nearTx?: string };

export type NearSettler = {
  live: boolean;
  settle(action: UnifiedAction, ctx: { applicationId: string; intentHash: string; policyHash: string }): Promise<NearSettlement>;
};

export function isNearAction(action: UnifiedAction): boolean {
  if (action.action === "SPOT_TRADE") return action.resource.venue === REF_FINANCE_VENUE;
  return action.action === "PAYMENT"
    && (action.resource.service === NEAR_TRANSFER_SERVICE || action.resource.service === NEAR_FT_TRANSFER_SERVICE);
}

/** The exact on-chain effect a permitted payment is allowed to have. Swaps are quoted live instead. */
export function nearExpectation(action: UnifiedAction, ftContract: string | undefined): NearExpectation | undefined {
  if (action.action !== "PAYMENT") return undefined;
  const base = { receiverId: action.context.recipient, amount: action.context.amount.toString() };
  if (action.resource.service === NEAR_TRANSFER_SERVICE) return { kind: "transfer", ...base };
  return ftContract === undefined ? undefined : { kind: "ft_transfer", contractId: ftContract, ...base };
}

/**
 * Executes a permitted NEAR action. Live when NEAR_ACCOUNT_ID and
 * NEAR_PRIVATE_KEY are set, fixtures otherwise. Never throws: anything short
 * of final, matching evidence is reported as NOT_PROVABLE.
 */
export function createNearSettler(
  capabilities: CapabilityService,
  signer: Signer,
  env: NodeJS.ProcessEnv = process.env,
): NearSettler {
  const accountId = env.NEAR_ACCOUNT_ID?.trim();
  const privateKey = env.NEAR_PRIVATE_KEY?.trim();
  const rpcUrl = env.NEAR_RPC_URL?.trim() || DEFAULT_RPC_URL;
  const ftContract = env.NEAR_FT_CONTRACT?.trim() || undefined;
  const refContract = env.NEAR_REF_CONTRACT?.trim() || DEFAULT_REF_CONTRACT;
  const refPool = env.NEAR_REF_POOL_ID?.trim() ? Number(env.NEAR_REF_POOL_ID) : undefined;
  const live = Boolean(accountId && privateKey);
  const liveExecutor = live
    ? createNearPaymentExecutor({ capabilities, rpcUrl, accountId: accountId!, privateKey: privateKey! })
    : undefined;
  const evidence = live ? createNearVenueAdapter({ rpcUrl }) : createNearMockVenueAdapter();

  return {
    live,
    async settle(action, { applicationId, intentHash, policyHash }) {
      if (action.action !== "PAYMENT" && action.action !== "SPOT_TRADE") {
        return { status: "NOT_PROVABLE", reason: "NOT_A_NEAR_ACTION" };
      }

      let ref: ExecutionRef | undefined;
      try {
        let expect = nearExpectation(action, ftContract);
        if (liveExecutor && action.action === "SPOT_TRADE" && refPool !== undefined) {
          expect = await liveExecutor.quoteSwap({
            refContract,
            poolId: refPool,
            tokenIn: action.context.assetIn,
            tokenOut: action.context.assetOut,
            amount: action.context.amount.toString(),
            slippageBps: action.context.slippageBps,
          });
        }
        // A live action with no real route is never faked.
        if (liveExecutor && expect === undefined) {
          return { status: "NOT_PROVABLE", reason: "NEAR_LIVE_EXECUTOR_UNAVAILABLE" };
        }
        const amount = action.context.amount.toString();
        const accountRef = `0x${createHash("sha256").update(action.agent).digest("hex")}` as Hex;
        const { token } = await capabilities.issue({
          applicationId,
          intentHash: intentHash as Hex,
          policyHash: policyHash as Hex,
          accountRef,
          idempotencyKey: action.idempotencyKey,
          amount,
          // The mandate already bounded the amount; the capability scopes it to this one action.
          budgetLimit: amount,
          ttlSeconds: CAPABILITY_TTL_SECONDS,
        }, signer);
        const params = { token, intentHash, policyHash, accountRef };
        ref = liveExecutor && expect
          ? await liveExecutor.execute({ ...params, expect })
          : await createNearMockExecutionAdapter(capabilities, {
              venue: action.action === "PAYMENT" ? "NEAR_PAYMENT" : "REF_FINANCE_NEAR",
            }).execute(params);
        const bundle: EvidenceBundle = await evidence.collectEvidence(ref);
        const chain = { txHash: ref.txHash, ...(ref.near ? { nearTx: ref.near.hash } : {}) };
        return bundle.finalityResult === "FINAL"
          ? { status: "FINAL", evidenceDigest: bundle.evidenceRoot, ...chain, ...(ref.near ? { near: ref.near } : {}) }
          : { status: "NOT_PROVABLE", reason: `EVIDENCE_${bundle.finalityResult}`, ...chain };
      } catch (error) {
        return {
          status: "NOT_PROVABLE",
          reason: error instanceof Error ? error.message.slice(0, 200) : "NEAR_EXECUTION_FAILED",
          ...(ref ? { txHash: ref.txHash, ...(ref.near ? { nearTx: ref.near.hash } : {}) } : {}),
        };
      }
    },
  };
}
