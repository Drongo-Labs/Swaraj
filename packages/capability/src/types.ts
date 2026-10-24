import type { Hex } from "@swaraj/crypto";

export const CAPABILITY_AUDIENCE = "swaraj.execution.v1" as const;

export type CapabilityStatus = "ISSUED" | "CONSUMED" | "EXPIRED" | "RELEASED";

/** Unsigned capability fields that are hashed and signed. */
export type CapabilityClaims = {
  capabilityId: string;
  intentHash: Hex;
  policyHash: Hex;
  accountRef: Hex;
  idempotencyKey: string;
  audience: typeof CAPABILITY_AUDIENCE;
  amount: string;
  issuedAt: number;
  expiresAt: number;
};

export type CapabilityToken = CapabilityClaims & {
  /** secp256k1 signature over the capability digest. */
  signature: Hex;
  signerKeyId: Hex;
};

export type ReservationStatus = "HELD" | "COMMITTED" | "RELEASED";

export type Reservation = {
  reservationId: string;
  applicationId: string;
  capabilityId: string;
  accountRef: string;
  amount: string;
  status: ReservationStatus;
  createdAt: number;
  updatedAt: number;
};

export type IssueCapabilityInput = {
  applicationId: string;
  intentHash: Hex;
  policyHash: Hex;
  accountRef: Hex;
  idempotencyKey: string;
  amount: string;
  /** Seconds the capability remains valid. Default 60. */
  ttlSeconds?: number;
  now?: number;
  /** Soft budget ceiling for held reservations (atomic units as decimal string). */
  budgetLimit: string;
  usedBudget?: string;
};
