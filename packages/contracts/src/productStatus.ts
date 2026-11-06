import { z } from "zod";

/** Product status. Never claim "proved" without proof metadata. */
export const ProductStatus = z.enum(["allowed", "blocked", "proved", "cant_prove", "needs_approval"]);
export type ProductStatus = z.infer<typeof ProductStatus>;

export type EngineReceiptStatus =
  | "PENDING"
  | "PROVED"
  | "NON_PROVABLE"
  | "INVALIDATED"
  | "DEV_UNVERIFIED"
  | "NOT_EXECUTABLE";

/** Map a mandate/pipeline decision to a product status before/without a final receipt. */
export function productStatusFromDecision(
  decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL",
  receiptStatus?: EngineReceiptStatus | null,
): ProductStatus {
  if (decision === "BLOCK") return "blocked";
  if (decision === "NEEDS_APPROVAL") return "needs_approval";
  if (receiptStatus === undefined || receiptStatus === null) return "allowed";
  return productStatusFromReceipt(receiptStatus);
}

/** Map a durable receipt engine status to product language. */
export function productStatusFromReceipt(status: EngineReceiptStatus): ProductStatus {
  switch (status) {
    case "PROVED":
      return "proved";
    case "NON_PROVABLE":
    case "INVALIDATED":
    case "DEV_UNVERIFIED":
      return "cant_prove";
    case "PENDING":
    case "NOT_EXECUTABLE":
      return "allowed";
  }
}

export const PRODUCT_STATUS_GLOSSARY = {
  allowed: "Decision ALLOW — execution may be in progress or awaiting evidence/proof",
  blocked: "Decision BLOCK — no capability issued; rule ids attribute why",
  proved: "Receipt PROVED with real proof metadata only",
  cant_prove: "NON_PROVABLE / insufficient evidence — never reported as proved",
  needs_approval: "Paused for a person; nothing executes until they approve it",
} as const;
