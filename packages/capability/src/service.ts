import { recoverAddress } from "viem";
import { deriveKeyId, type Hex, type Signer } from "@swaraj/crypto";
import { buildCapabilityId, capabilityDigest, createClaims, signCapability } from "./token.js";
import { CAPABILITY_AUDIENCE, type CapabilityToken, type IssueCapabilityInput, type Reservation } from "./types.js";
import type { CapabilityStore, ReservationStore, StoredCapability } from "./store.js";

export class CapabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CapabilityError";
  }
}

/** Stable serialization for equality checks after Postgres jsonb round-trips. */
export function capabilityTokenFingerprint(token: CapabilityToken): string {
  return JSON.stringify({
    audience: token.audience,
    capabilityId: token.capabilityId,
    intentHash: token.intentHash,
    policyHash: token.policyHash,
    accountRef: token.accountRef,
    idempotencyKey: token.idempotencyKey,
    amount: token.amount,
    issuedAt: token.issuedAt,
    expiresAt: token.expiresAt,
    signature: token.signature,
    signerKeyId: token.signerKeyId,
  });
}

export type CapabilityService = {
  issue(input: IssueCapabilityInput, signer: Signer): Promise<{ token: CapabilityToken; reservation: Reservation }>;
  verify(token: CapabilityToken, expected: {
    intentHash: string;
    policyHash: string;
    accountRef: string;
    now?: number;
  }): Promise<StoredCapability>;
  consume(capabilityId: string): Promise<void>;
  release(capabilityId: string): Promise<void>;
  commitReservation(capabilityId: string): Promise<void>;
  get(capabilityId: string): Promise<StoredCapability | undefined>;
};

export function createCapabilityService(deps: {
  capabilities: CapabilityStore;
  reservations: ReservationStore;
}): CapabilityService {
  return {
    async issue(input, signer) {
      const now = input.now ?? Math.floor(Date.now() / 1000);
      const existing = await deps.capabilities.getByIdempotency(
        input.applicationId,
        input.accountRef,
        input.idempotencyKey,
      );
      if (existing) {
        if (
          existing.token.intentHash !== input.intentHash ||
          existing.token.policyHash !== input.policyHash ||
          existing.token.amount !== input.amount
        ) {
          throw new CapabilityError("idempotency conflict: capability exists with different binding");
        }
        const reservation = await deps.reservations.getByCapability(existing.token.capabilityId);
        if (!reservation) throw new CapabilityError("reservation missing for existing capability");
        return { token: existing.token, reservation };
      }

      const amount = BigInt(input.amount);
      if (amount <= 0n) throw new CapabilityError("amount must be positive");
      const used = BigInt(input.usedBudget ?? "0");
      const held = await deps.reservations.sumHeld(input.applicationId, input.accountRef);
      const limit = BigInt(input.budgetLimit);
      if (used + held + amount > limit) {
        throw new CapabilityError("budget reservation would exceed limit");
      }

      const ttl = input.ttlSeconds ?? 60;
      const capabilityId = buildCapabilityId(input.intentHash, input.idempotencyKey);
      const claims = createClaims({
        capabilityId,
        intentHash: input.intentHash,
        policyHash: input.policyHash,
        accountRef: input.accountRef,
        idempotencyKey: input.idempotencyKey,
        amount: input.amount,
        issuedAt: now,
        expiresAt: now + ttl,
      });
      const token = await signCapability(claims, signer);
      await deps.capabilities.put({ token, applicationId: input.applicationId, status: "ISSUED" });

      const reservation: Reservation = {
        reservationId: `res_${capabilityId.slice(4)}`,
        applicationId: input.applicationId,
        capabilityId,
        accountRef: input.accountRef,
        amount: input.amount,
        status: "HELD",
        createdAt: now,
        updatedAt: now,
      };
      await deps.reservations.put(reservation);
      return { token, reservation };
    },

    async verify(token, expected) {
      if (token.audience !== CAPABILITY_AUDIENCE) {
        throw new CapabilityError("capability audience mismatch");
      }
      if (token.intentHash !== expected.intentHash) {
        throw new CapabilityError("capability intentHash mismatch");
      }
      if (token.policyHash !== expected.policyHash) {
        throw new CapabilityError("capability policyHash mismatch");
      }
      if (token.accountRef !== expected.accountRef) {
        throw new CapabilityError("capability accountRef mismatch");
      }
      const now = expected.now ?? Math.floor(Date.now() / 1000);
      if (now >= token.expiresAt) {
        throw new CapabilityError("capability expired");
      }

      const stored = await deps.capabilities.get(token.capabilityId);
      if (!stored) throw new CapabilityError("capability unknown");
      if (stored.status === "CONSUMED") throw new CapabilityError("capability already consumed");
      if (stored.status === "RELEASED") throw new CapabilityError("capability released");
      if (stored.status === "EXPIRED") throw new CapabilityError("capability expired");

      // Bind stored token to the presented token (stable key order — jsonb may reorder).
      if (capabilityTokenFingerprint(stored.token) !== capabilityTokenFingerprint(token)) {
        throw new CapabilityError("capability token altered");
      }

      const digest = capabilityDigest(token);
      const recovered = await recoverAddress({ hash: digest, signature: token.signature });
      if (deriveKeyId(recovered.toLowerCase() as Hex) !== token.signerKeyId) {
        throw new CapabilityError("capability signature invalid");
      }
      return stored;
    },

    async consume(capabilityId) {
      const stored = await deps.capabilities.get(capabilityId);
      if (!stored) throw new CapabilityError("capability not found");
      if (stored.status !== "ISSUED") throw new CapabilityError(`cannot consume capability in status ${stored.status}`);
      await deps.capabilities.updateStatus(capabilityId, "CONSUMED");
    },

    async release(capabilityId) {
      const stored = await deps.capabilities.get(capabilityId);
      if (!stored) throw new CapabilityError("capability not found");
      if (stored.status === "CONSUMED") throw new CapabilityError("cannot release consumed capability");
      await deps.capabilities.updateStatus(capabilityId, "RELEASED");
      const reservation = await deps.reservations.getByCapability(capabilityId);
      if (reservation && reservation.status === "HELD") {
        await deps.reservations.update({
          ...reservation,
          status: "RELEASED",
          updatedAt: Math.floor(Date.now() / 1000),
        });
      }
    },

    async commitReservation(capabilityId) {
      const reservation = await deps.reservations.getByCapability(capabilityId);
      if (!reservation) throw new CapabilityError("reservation not found");
      if (reservation.status !== "HELD") throw new CapabilityError(`cannot commit reservation in status ${reservation.status}`);
      await deps.reservations.update({
        ...reservation,
        status: "COMMITTED",
        updatedAt: Math.floor(Date.now() / 1000),
      });
    },

    async get(capabilityId) {
      return deps.capabilities.get(capabilityId);
    },
  };
}
