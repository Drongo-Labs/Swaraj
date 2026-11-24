import { createHash } from "node:crypto";
import type { ActionSettler, CapabilityService, Settlement } from "@swaraj/capability";
import type { Hex, Signer } from "@swaraj/crypto";
import type { EvidenceBundle } from "@swaraj/evidence";
import type { UnifiedAction } from "@swaraj/schemas";
import { createNearVenueAdapter, createNearMockVenueAdapter } from "./evidence.js";
import { createNearMockExecutionAdapter, createNearPaymentExecutor } from "./execution.js";
import type { NearExecutionRef, NearExpectation } from "./types.js";

export const NEAR_TRANSFER_SERVICE = "near_transfer";
export const NEAR_FT_TRANSFER_SERVICE = "near_ft_transfer";
const REF_FINANCE_VENUE = "REF_FINANCE_NEAR";
const DEFAULT_RPC_URL = "https://test.rpc.fastnear.com";
const DEFAULT_REF_CONTRACT = "ref-finance-101.testnet";
const CAPABILITY_TTL_SECONDS = 120;

/** True when the action is a NEAR payment/swap whose currency label matches what we would actually send. */
export function isNearAction(
  action: UnifiedAction,
  opts: { ftCurrency?: string } = {},
): boolean {
  if (action.action === "SPOT_TRADE") return action.resource.venue === REF_FINANCE_VENUE;
  if (action.action !== "PAYMENT") return false;
  if (action.resource.service === NEAR_TRANSFER_SERVICE) {
    // Native transfers always move NEAR; refuse a mismatched label so a budget
    // on NEAR cannot be skipped by renaming the currency.
    return action.context.currency === "NEAR";
  }
  if (action.resource.service === NEAR_FT_TRANSFER_SERVICE) {
    const ftCurrency = opts.ftCurrency?.trim();
    // Without a configured label we cannot know what the agent claimed; refuse.
    return Boolean(ftCurrency) && action.context.currency === ftCurrency;
  }
  return false;
}

/** The exact on-chain effect a permitted payment is allowed to have. Swaps are quoted live instead. */
export function nearExpectation(action: UnifiedAction, ftContract: string | undefined): NearExpectation | undefined {
  if (action.action !== "PAYMENT") return undefined;
  const base = { receiverId: action.context.recipient, amount: action.context.amount.toString() };
  if (action.resource.service === NEAR_TRANSFER_SERVICE) return { kind: "transfer", ...base };
  return ftContract === undefined ? undefined : { kind: "ft_transfer", contractId: ftContract, ...base };
}

/** Live with NEAR credentials, fixtures otherwise. Never throws: anything short of final, matching evidence is NOT_PROVABLE. */
export function createNearSettler(
  capabilities: CapabilityService,
  signer: Signer,
  env: NodeJS.ProcessEnv = process.env,
): ActionSettler<UnifiedAction> {
  const accountId = env.NEAR_ACCOUNT_ID?.trim();
  const privateKey = env.NEAR_PRIVATE_KEY?.trim();
  const rpcUrl = env.NEAR_RPC_URL?.trim() || DEFAULT_RPC_URL;
  const ftContract = env.NEAR_FT_CONTRACT?.trim() || undefined;
  const ftCurrency = env.NEAR_FT_CURRENCY?.trim() || undefined;
  const refContract = env.NEAR_REF_CONTRACT?.trim() || DEFAULT_REF_CONTRACT;
  const refPool = env.NEAR_REF_POOL_ID?.trim() ? Number(env.NEAR_REF_POOL_ID) : undefined;
  const live = Boolean(accountId && privateKey);
  const liveExecutor = live
    ? createNearPaymentExecutor({ capabilities, rpcUrl, accountId: accountId!, privateKey: privateKey! })
    : undefined;
  const evidence = live ? createNearVenueAdapter({ rpcUrl }) : createNearMockVenueAdapter();

  return {
    live,
    handles: (action) => isNearAction(action, ftCurrency ? { ftCurrency } : {}),
    async settle(action, { applicationId, intentHash, policyHash }): Promise<Settlement> {
      if (action.action !== "PAYMENT" && action.action !== "SPOT_TRADE") {
        return { status: "NOT_PROVABLE", reason: "NOT_A_NEAR_ACTION" };
      }

      let ref: NearExecutionRef | undefined;
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
        // One reservation per action: sharing it across an agent's actions made parallel
        // payments fail, and one crashed payment would hold up every later one.
        // ponytail: the mandate caps each action; add a shared ref if per-agent totals are needed.
        const accountRef = `0x${createHash("sha256").update(`${action.agent}:${action.idempotencyKey}`).digest("hex")}` as Hex;
        const { token } = await capabilities.issue({
          applicationId,
          intentHash: intentHash as Hex,
          policyHash: policyHash as Hex,
          accountRef,
          idempotencyKey: action.idempotencyKey,
          amount,
          // The mandate already bounded the amount.
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
        const chain = { txHash: ref.txHash, ...(ref.near ? { chainTx: ref.near.hash } : {}) };
        return bundle.finalityResult === "FINAL"
          ? { status: "FINAL", evidenceDigest: bundle.evidenceRoot, ...chain, ...(ref.near ? { chainExecution: ref.near } : {}) }
          : { status: "NOT_PROVABLE", reason: `EVIDENCE_${bundle.finalityResult}`, ...chain };
      } catch (error) {
        return {
          status: "NOT_PROVABLE",
          reason: error instanceof Error ? error.message.slice(0, 200) : "NEAR_EXECUTION_FAILED",
          ...(ref ? { txHash: ref.txHash, ...(ref.near ? { chainTx: ref.near.hash } : {}) } : {}),
        };
      }
    },
  };
}
