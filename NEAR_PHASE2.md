# Phase 2 NEAR — Kushagra deliverable

Features **6** (NEAR adapter + templates) and **7** (product statuses). Feature **8** Private Mandate is **deferred**.

## Demo

```bash
pnpm --filter @swaraj/schemas build
pnpm --filter @swaraj/contracts build
pnpm --filter @swaraj/rules build
pnpm --filter @swaraj/example build
pnpm --filter @swaraj/example near-demo -- --scene=all
```

Scenes: `trade.allow` · `trade.block` · `payment.allow` · `payment.block`

## Mandates

`packages/contracts/fixtures/near-mandate-{trading,payment,combined}.json`

## Adapters

- `createNearMockVenueAdapter` — `@swaraj/evidence` (`REF_FINANCE_NEAR`)
- `createNearMockExecutionAdapter` — `@swaraj/capability`
- Missing evidence fails closed (`NEAR_MISSING_TX_HASH`)

## Live NEAR (next phase)

Set `NEAR_ACCOUNT_ID` + `NEAR_PRIVATE_KEY` (+ optional `NEAR_RPC_URL`). The API then runs:

mandate ALLOW → capability → on-chain NEAR tx → `NEAR_FINALITY` evidence → receipt

- `createNearLiveExecutionAdapter` — `@swaraj/capability`
- `createNearLiveVenueAdapter` — `@swaraj/evidence`
- Settlement: NEP-141 via `NEAR_FT_CONTRACT`, else native NEAR (`NEAR_YOCTO_PER_UNIT`)
- `/health` reports `nearLive: true` and `phases.near: "live"`

## Product statuses

`allowed` · `blocked` · `proved` · `cant_prove` via `@swaraj/contracts`  
Returned as `productStatus` on unified-action responses and receipt GETs.
