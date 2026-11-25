import type { CapabilityStatus, CapabilityToken, Reservation } from "./types.js";

export type StoredCapability = {
  token: CapabilityToken;
  applicationId: string;
  status: CapabilityStatus;
};

export type CapabilityStore = {
  get(capabilityId: string): Promise<StoredCapability | undefined>;
  put(record: StoredCapability): Promise<void>;
  updateStatus(capabilityId: string, status: CapabilityStatus): Promise<void>;
  getByIdempotency(applicationId: string, accountRef: string, idempotencyKey: string): Promise<StoredCapability | undefined>;
};

export type ReservationStore = {
  get(reservationId: string): Promise<Reservation | undefined>;
  getByCapability(capabilityId: string): Promise<Reservation | undefined>;
  put(reservation: Reservation): Promise<void>;
  update(reservation: Reservation): Promise<void>;
  sumHeld(applicationId: string, accountRef: string): Promise<bigint>;
  /** Sum of COMMITTED amounts whose commit time (`updatedAt`) is >= `since` (unix seconds). */
  sumCommittedSince(applicationId: string, accountRef: string, since: number): Promise<bigint>;
};

export function createMemoryCapabilityStore(): CapabilityStore {
  const byId = new Map<string, StoredCapability>();
  const byIdem = new Map<string, string>();
  const idemKey = (applicationId: string, accountRef: string, idempotencyKey: string) =>
    `${applicationId}\0${accountRef}\0${idempotencyKey}`;

  return {
    async get(capabilityId) {
      return byId.get(capabilityId);
    },
    async put(record) {
      byId.set(record.token.capabilityId, record);
      byIdem.set(
        idemKey(record.applicationId, record.token.accountRef, record.token.idempotencyKey),
        record.token.capabilityId,
      );
    },
    async updateStatus(capabilityId, status) {
      const existing = byId.get(capabilityId);
      if (!existing) throw new Error("capability not found");
      byId.set(capabilityId, { ...existing, status });
    },
    async getByIdempotency(applicationId, accountRef, idempotencyKey) {
      const id = byIdem.get(idemKey(applicationId, accountRef, idempotencyKey));
      return id ? byId.get(id) : undefined;
    },
  };
}

export function createMemoryReservationStore(): ReservationStore {
  const byId = new Map<string, Reservation>();
  const byCap = new Map<string, string>();

  return {
    async get(reservationId) {
      return byId.get(reservationId);
    },
    async getByCapability(capabilityId) {
      const id = byCap.get(capabilityId);
      return id ? byId.get(id) : undefined;
    },
    async put(reservation) {
      byId.set(reservation.reservationId, reservation);
      byCap.set(reservation.capabilityId, reservation.reservationId);
    },
    async update(reservation) {
      byId.set(reservation.reservationId, reservation);
    },
    async sumHeld(applicationId, accountRef) {
      let total = 0n;
      for (const row of byId.values()) {
        if (row.applicationId === applicationId && row.accountRef === accountRef && row.status === "HELD") {
          total += BigInt(row.amount);
        }
      }
      return total;
    },
    async sumCommittedSince(applicationId, accountRef, since) {
      let total = 0n;
      for (const row of byId.values()) {
        if (
          row.applicationId === applicationId &&
          row.accountRef === accountRef &&
          row.status === "COMMITTED" &&
          row.updatedAt >= since
        ) {
          total += BigInt(row.amount);
        }
      }
      return total;
    },
  };
}
