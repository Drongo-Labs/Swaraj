import { createHash } from "node:crypto";
import {
  KeyRegistry,
  deriveKeyId,
  verifyReceiptSignature,
  type Hex,
} from "@swaraj/crypto";
import {
  UnifiedActionSchema,
  serializeUnifiedAction,
} from "@swaraj/schemas";
import type { ReceiptRecord } from "./types.js";

/**
 * A unified-action receipt needs a valid format, schema, action hash, issuer signature and binding.
 * Legacy receipts only get the signature and binding checks.
 */

export type UnifiedActionReceiptVerification = {
  valid: boolean;
  /** "unified-action" when the receipt binds a unified action, "legacy" otherwise. */
  format: "unified-action" | "legacy";
  checks: {
    signature: boolean;
    binding: boolean;
    /** Unified-action schema validation of the stored blob; null for legacy receipts. */
    actionSchema: boolean | null;
    /** Recomputed canonical action hash vs the stored actionHash; null for legacy receipts. */
    actionHash: boolean | null;
  };
};

function canonicalActionHash(input: unknown): string | undefined {
  const parsed = UnifiedActionSchema.safeParse(input);
  if (!parsed.success) return undefined;
  return `0x${createHash("sha256").update(serializeUnifiedAction(parsed.data)).digest("hex")}`;
}

export async function verifyUnifiedActionReceipt(
  record: ReceiptRecord,
  expectedSignerAddress: Hex,
): Promise<UnifiedActionReceiptVerification> {
  const intentJson = record.intentJson as { format?: unknown; action?: unknown; actionHash?: unknown } | undefined;
  const isUnified = intentJson?.format === "unified-action";

  const registry = new KeyRegistry([
    {
      keyId: deriveKeyId(expectedSignerAddress),
      address: expectedSignerAddress,
      validFrom: 0,
    },
  ]);

  const signatureVerified = await verifyReceiptSignature(record.signedReceipt, registry);
  const binding =
    record.intentHash === record.signedReceipt.intentHash &&
    record.policyHash === record.signedReceipt.policyHash;

  if (!isUnified) {
    return {
      valid: signatureVerified && binding,
      format: "legacy",
      checks: { signature: signatureVerified, binding, actionSchema: null, actionHash: null },
    };
  }

  const actionSchema = UnifiedActionSchema.safeParse(intentJson?.action).success;
  const actionHash =
    typeof intentJson?.actionHash === "string" && canonicalActionHash(intentJson?.action) === intentJson.actionHash;

  return {
    valid: signatureVerified && binding && actionSchema && actionHash,
    format: "unified-action",
    checks: { signature: signatureVerified, binding, actionSchema, actionHash },
  };
}
