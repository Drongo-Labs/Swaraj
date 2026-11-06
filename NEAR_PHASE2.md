# Phase 2 NEAR — Kushagra deliverable

Features **6** (NEAR adapter and templates), **7** (product statuses) and **8** (Private Mandate).

The steps and current limits are in [RUNBOOK_PHASE2_NEAR.md](RUNBOOK_PHASE2_NEAR.md).

## Demo

Scenes run through the API: `trade.allow` · `trade.block` · `payment.allow` · `payment.block` · `live.allow` · `live.trade` · `live.block`

## Mandates

`packages/contracts/fixtures/near-mandate-{trading,payment,combined,live}.json`

## Adapters

- Live: `createNearPaymentExecutor` (`@swaraj/capability`) and `createNearVenueAdapter` (`@swaraj/evidence`)
- Fixtures: `createNearMockExecutionAdapter` and `createNearMockVenueAdapter`, used when no NEAR account is set
- Evidence fails closed unless the chain shows a final, matching, successful transaction

## Product statuses

`allowed` · `blocked` · `proved` · `cant_prove` · `needs_approval` via `@swaraj/contracts`
