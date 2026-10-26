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
 * Task 3.2 — verification of receipts bound to the unified action format.
 *
 * A unified-action receipt is valid when, together:
 * 1. its stored intent blob declares the `unified-action` format,
 * 2. the stored action parses against the strict UnifiedAction schema,
 * 3. the action's recomputed canonical hash matches the stored actionHash
 *    (the blob was not tampered with),
 * 4. the issuer signature verifies against the expected signer key, and
 * 5. the record and the signed receipt agree on intentHash and policyHash.
 *
 * Legacy receipts (pre-unified-format intents) are reported as format
 * "legacy": signature and binding are still checked, action checks are not
 * applicable.
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
