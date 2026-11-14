import { createHash } from "node:crypto";
import { hashObject } from "@swaraj/crypto";
import { nearExecutionMatchesAction, nearFinality, type NearExecution } from "@swaraj/near";
import { evaluateParsedMandate } from "@swaraj/rules";
import { ObjectType, parseAgentMandate, parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import { recoverAddress } from "viem";

/** Standalone verification (spec/receipt-v1.md). Independent of the API and worker by design. */

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
  /** Who approved a NEEDS_APPROVAL decision; recorded, not cryptographically attested. */
  approvedBy?: string;
  evidenceDigest?: string;
  chainExecution?: NearExecution;
  statementId: string;
  statementText: string;
  issuer: string;
  signature: string;
};

export type Check = { name: string; ok: boolean; detail?: string };
export type Verification = { valid: boolean; checks: Check[] };

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

export function statementText(bundle: Pick<ReceiptBundle, "intentHash" | "mandateHash" | "decision" | "matchedRuleIds" | "approvedBy" | "evidenceDigest">): string {
  const matched = [...bundle.matchedRuleIds].sort();
  return [
    "swaraj/statement/mandate/v1",
    `intent=${bundle.intentHash}`,
    `mandate=${bundle.mandateHash}`,
    `decision=${bundle.decision}`,
    `matched=${matched.length > 0 ? matched.join(",") : "-"}`,
    ...(bundle.approvedBy !== undefined ? [`approved_by=${bundle.approvedBy}`] : []),
    ...(bundle.evidenceDigest !== undefined ? [`evidence=${bundle.evidenceDigest}`] : []),
  ].join("\n");
}

/** The digest the issuer signs. */
export function bundleDigest(bundle: Pick<ReceiptBundle, "receiptId" | "statementId" | "state" | "proofRef">): `0x${string}` {
  const message = ["swaraj/receipt-bundle/v1", bundle.receiptId, bundle.statementId, bundle.state, bundle.proofRef].join("\n");
  return `0x${sha256(message)}`;
}

export async function verifyReceiptBundle(
  bundle: ReceiptBundle,
  options: { issuer: string; nearRpcUrl?: string; fetchImpl?: typeof fetch; /** Token contract a near_ft_transfer payment must use. */ nearFtContract?: string },
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
    const matched = [...decision.matchedRuleIds].sort().join(",");
    add("decision recomputes from the mandate", decision.decision === bundle.decision && matched === [...bundle.matchedRuleIds].sort().join(","));
    if (decision.decision === "NEEDS_APPROVAL") add("an approver is recorded", bundle.approvedBy !== undefined);
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

  if (bundle.chainExecution) {
    add("on-chain target matches the action", action !== undefined && nearExecutionMatchesAction(bundle.chainExecution, action, options.nearFtContract ? { ftContract: options.nearFtContract } : {}));
    if (options.nearRpcUrl) {
      try {
        const finality = await nearFinality(bundle.chainExecution, {
          rpcUrl: options.nearRpcUrl,
          ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
        });
        add("transaction is final on NEAR", finality === "FINAL", finality);
      } catch (error) {
        add("transaction is final on NEAR", false, error instanceof Error ? error.message.slice(0, 200) : undefined);
      }
    }
  }
  return { valid: checks.every((check) => check.ok), checks };
}
