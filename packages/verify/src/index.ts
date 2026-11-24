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

/**
 * Proof-carrying requests. On ALLOW the gateway issues a short-lived signed permit for that exact action;
 * a counterparty (API, merchant, tool server) runs `checkPermit` and refuses any request without one.
 */
export type Permit = {
  version: "swaraj/permit/v1";
  applicationId: string;
  action: unknown;
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW";
  matchedRuleIds: string[];
  approvedBy?: string;
  receiptId?: string;
  /** Unix milliseconds. */
  expiresAt: number;
  issuer: string;
  signature: string;
};

/** The digest the issuer signs. JSON array, so no field can smuggle in a separator. */
export function permitDigest(
  permit: Pick<Permit, "applicationId" | "intentHash" | "mandateHash" | "decision" | "matchedRuleIds" | "approvedBy" | "receiptId" | "expiresAt">,
): `0x${string}` {
  return `0x${sha256(
    JSON.stringify([
      "swaraj/permit/v1",
      permit.applicationId,
      permit.intentHash,
      permit.mandateHash,
      permit.decision,
      [...permit.matchedRuleIds].sort(),
      permit.approvedBy ?? null,
      permit.receiptId ?? null,
      permit.expiresAt,
    ]),
  )}`;
}

export type PermitResult =
  | { ok: true; action: ReturnType<typeof parseUnifiedAction>; permit: Permit }
  | { ok: false; reason: string };

// ponytail: per-process replay memory; pass `claim` backed by your database when you run more than one instance.
const usedPermits = new Map<string, number>();
const claimInMemory = (intentHash: string, expiresAt: number, now: number): boolean => {
  for (const [hash, expiry] of usedPermits) if (expiry <= now) usedPermits.delete(hash);
  if (usedPermits.has(intentHash)) return false;
  usedPermits.set(intentHash, expiresAt);
  return true;
};

export async function checkPermit(
  permit: unknown,
  options: {
    /** The Swaraj gateway's signing address. */
    issuer: string;
    /** Does the permitted action describe exactly this request (amount, recipient, tool, …)? Amounts are bigint. */
    matches: (action: ReturnType<typeof parseUnifiedAction>) => boolean;
    /** Optional: only accept permits from this application. */
    applicationId?: string;
    now?: number;
    /** Marks the permit used; must return false if it already was. Defaults to an in-memory set. */
    claim?: (intentHash: string, expiresAt: number) => boolean | Promise<boolean>;
  },
): Promise<PermitResult> {
  const now = options.now ?? Date.now();
  const p = permit as Partial<Permit> | null;
  if (typeof p !== "object" || p === null || p.version !== "swaraj/permit/v1") return { ok: false, reason: "permit_missing" };
  if (p.decision !== "ALLOW") return { ok: false, reason: "not_allowed" };
  if (typeof p.expiresAt !== "number" || p.expiresAt <= now) return { ok: false, reason: "permit_expired" };
  if (typeof p.applicationId !== "string" || typeof p.intentHash !== "string" || typeof p.mandateHash !== "string" || !Array.isArray(p.matchedRuleIds)) {
    return { ok: false, reason: "permit_malformed" };
  }
  if (options.applicationId !== undefined && p.applicationId !== options.applicationId) return { ok: false, reason: "wrong_application" };
  let action: ReturnType<typeof parseUnifiedAction>;
  try {
    action = parseUnifiedAction(p.action);
  } catch {
    return { ok: false, reason: "permit_malformed" };
  }
  if (`0x${sha256(serializeUnifiedAction(action))}` !== p.intentHash) return { ok: false, reason: "intent_mismatch" };
  try {
    const recovered = await recoverAddress({ hash: permitDigest(p as Permit), signature: p.signature as `0x${string}` });
    if (recovered.toLowerCase() !== options.issuer.toLowerCase()) return { ok: false, reason: "bad_signature" };
  } catch {
    return { ok: false, reason: "bad_signature" };
  }
  if (!options.matches(action)) return { ok: false, reason: "request_mismatch" };
  // Claimed last, so a rejected request never burns a valid permit.
  const fresh = options.claim ? await options.claim(p.intentHash, p.expiresAt) : claimInMemory(p.intentHash, p.expiresAt, now);
  if (!fresh) return { ok: false, reason: "permit_reused" };
  return { ok: true, action, permit: p as Permit };
}

/** Header that carries a permit: base64url of the permit JSON. */
export const PERMIT_HEADER = "swaraj-permit";
export const encodePermit = (permit: Permit): string => Buffer.from(JSON.stringify(permit)).toString("base64url");
export function decodePermit(header: string | string[] | undefined): unknown {
  if (typeof header !== "string") return undefined;
  try {
    return JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
  } catch {
    return undefined;
  }
}

/**
 * Express/Connect middleware: refuses with 403 unless the request carries a valid, unused permit that `matches` it.
 * The checked action is left on `req.swarajAction`.
 */
export function requirePermit<Req extends { headers: Record<string, string | string[] | undefined> }>(
  options: Omit<Parameters<typeof checkPermit>[1], "matches"> & {
    matches: (action: ReturnType<typeof parseUnifiedAction>, req: Req) => boolean;
  },
) {
  return (
    req: Req & { swarajAction?: ReturnType<typeof parseUnifiedAction> },
    res: { statusCode: number; setHeader(name: string, value: string): unknown; end(body: string): unknown },
    next: (error?: unknown) => void,
  ): void => {
    checkPermit(decodePermit(req.headers[PERMIT_HEADER]), { ...options, matches: (action) => options.matches(action, req) }).then(
      (result) => {
        if (result.ok) {
          req.swarajAction = result.action;
          next();
          return;
        }
        res.statusCode = 403;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "swaraj_permit_rejected", reason: result.reason }));
      },
      next,
    );
  };
}
