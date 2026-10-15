# @swaraj/receipts

Phase 3 receipt engine: typed lifecycle transitions, NON_PROVABLE reason codes, signing via `@swaraj/crypto`, and storage (in-memory or Postgres).

Allowed edges from `PENDING`: `PROVED` (requires proof metadata; not used by mocks), `NON_PROVABLE`, `INVALIDATED`, `DEV_UNVERIFIED`. Terminal states reject further transitions.
