import { createHash } from "node:crypto";
import { hashObject } from "@swaraj/crypto";
import { createNearVenueAdapter, type ExecutionRef, type NearExpectation } from "@swaraj/evidence";
import { evaluateParsedMandate } from "@swaraj/rules";
import { ObjectType, parseAgentMandate, parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import { recoverAddress } from "viem";

/**
 * Standalone receipt verification (spec/receipt-v1.md). Everything is
 * recomputed from the bundle; no Swaraj service is contacted, so this code is
 * deliberately independent of the API and the proof worker.
 */

export type NearExecution = { hash: string; signerId: string; expect: NearExpectation };

export type ReceiptBundle = {
  version: "swaraj/receipt-bundle/v1";
  receiptId: string;
  state: string;
  proofRef: string;
  action: unknown;
  mandate: unknown;
  intentHash: string;
  mandateHash: string;
  decision: string;
  matchedRuleIds: string[];
  evidenceDigest?: string;
  near?: NearExecution;
  statementId: string;
  statementText: string;
  issuer: string;
  signature: string;
};

export type Check = { name: string; ok: boolean; detail?: string };
export type Verification = { valid: boolean; checks: Check[] };

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

export function statementText(bundle: Pick<ReceiptBundle, "intentHash" | "mandateHash" | "decision" | "matchedRuleIds" | "evidenceDigest">): string {
  const matched = [...bundle.matchedRuleIds].sort();
  return [
    "swaraj/statement/mandate/v1",
    `intent=${bundle.intentHash}`,
    `mandate=${bundle.mandateHash}`,
    `decision=${bundle.decision}`,
    `matched=${matched.length > 0 ? matched.join(",") : "-"}`,
    ...(bundle.evidenceDigest !== undefined ? [`evidence=${bundle.evidenceDigest}`] : []),
  ].join("\n");
}

/** The digest the issuer signs. */
export function bundleDigest(bundle: Pick<ReceiptBundle, "receiptId" | "statementId" | "state" | "proofRef">): `0x${string}` {
  const message = ["swaraj/receipt-bundle/v1", bundle.receiptId, bundle.statementId, bundle.state, bundle.proofRef].join("\n");
  return `0x${sha256(message)}`;
}

function nearMatchesAction(near: NearExecution, action: ReturnType<typeof parseUnifiedAction>): boolean {
  return action.action === "PAYMENT"
    && near.expect.receiverId === action.context.recipient
    && near.expect.amount === action.context.amount.toString();
}

export async function verifyReceiptBundle(
  bundle: ReceiptBundle,
  options: { issuer: string; nearRpcUrl?: string; fetchImpl?: typeof fetch },
): Promise<Verification> {
  const checks: Check[] = [];
  const add = (name: string, ok: boolean, detail?: string) =>
    checks.push(detail === undefined ? { name, ok } : { name, ok, detail });

  let action: ReturnType<typeof parseUnifiedAction> | undefined;
  let mandate: ReturnType<typeof parseAgentMandate> | undefined;
  try {
    action = parseUnifiedAction(bundle.action);
    mandate = parseAgentMandate(bundle.mandate);
    add("action and mandate parse", true);
  } catch (error) {
    add("action and mandate parse", false, error instanceof Error ? error.message.slice(0, 200) : undefined);
  }

  if (action && mandate) {
    add("intent hash", `0x${sha256(serializeUnifiedAction(action))}` === bundle.intentHash);
    add("mandate hash", hashObject(ObjectType.POLICY_PROFILE, bundle.mandate) === bundle.mandateHash);
    const decision = evaluateParsedMandate(mandate, action);
    const matched = [...decision.matchedPermitRuleIds, ...decision.matchedForbidRuleIds].sort().join(",");
    add("decision recomputes from the mandate", decision.decision === bundle.decision && matched === [...bundle.matchedRuleIds].sort().join(","));
  }

  const text = statementText(bundle);
  add("statement text", text === bundle.statementText);
  add("statement id", `stmt_${sha256(text)}` === bundle.statementId);
  add("receipt state is PROVED", bundle.state === "PROVED");

  try {
    const recovered = await recoverAddress({ hash: bundleDigest(bundle), signature: bundle.signature as `0x${string}` });
    add("issuer signature", recovered.toLowerCase() === options.issuer.toLowerCase());
  } catch {
    add("issuer signature", false);
  }

  if (bundle.near) {
    add("on-chain target matches the action", action !== undefined && nearMatchesAction(bundle.near, action));
    if (options.nearRpcUrl) {
      try {
        const ref: ExecutionRef = {
          txHash: `0x${"00".repeat(32)}` as ExecutionRef["txHash"],
          venue: "NEAR_PAYMENT",
          executedAt: Math.floor(Date.now() / 1000),
          near: bundle.near,
        };
        const adapter = createNearVenueAdapter({
          rpcUrl: options.nearRpcUrl,
          ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
        });
        const evidence = await adapter.collectEvidence(ref);
        add("transaction is final on NEAR", evidence.finalityResult === "FINAL", evidence.finalityResult);
      } catch (error) {
        add("transaction is final on NEAR", false, error instanceof Error ? error.message.slice(0, 200) : undefined);
      }
    }
  }
  return { valid: checks.every((check) => check.ok), checks };
}
