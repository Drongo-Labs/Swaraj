import type { SignedReceipt } from "@swaraj/schemas";

export type ReceiptStatus = SignedReceipt["status"];

const ALLOWED: Readonly<Record<ReceiptStatus, readonly ReceiptStatus[]>> = {
  PENDING: ["PROVED", "NON_PROVABLE", "INVALIDATED", "DEV_UNVERIFIED"],
  PROVED: [],
  NON_PROVABLE: [],
  INVALIDATED: [],
  DEV_UNVERIFIED: [],
};

export class IllegalTransitionError extends Error {
  constructor(from: ReceiptStatus, to: ReceiptStatus) {
    super(`illegal receipt transition: ${from} -> ${to}`);
    this.name = "IllegalTransitionError";
  }
}

/** Throws unless `from → to` is an allowed lifecycle edge. PROVED still requires proof metadata at the call site. */
export function assertTransition(from: ReceiptStatus, to: ReceiptStatus): void {
  if (from === to) return;
  const next = ALLOWED[from];
  if (!next.includes(to)) throw new IllegalTransitionError(from, to);
}

export function canTransition(from: ReceiptStatus, to: ReceiptStatus): boolean {
  try {
    assertTransition(from, to);
    return true;
  } catch {
    return false;
  }
}
