# @swaraj/schemas

Zod schemas for the five Phase 1 objects. All are `.strictObject`, integer-only, with no `null`; optional fields are omitted, never `null`/`undefined`. Amounts are decimal strings in JSON (`z.input`) and `bigint` after parsing (`z.infer`). Addresses and hashes are lowercase hex. Use `parseX(json)`: errors list field paths and rules only, never rejected values. Hash and sign with `@swaraj/crypto`, which accepts either form.

**Sets** (must be strictly ascending, so no duplicates; rejected otherwise): `PolicyProfile.allowedVenues`, `PolicyProfile.allowedAssets`, `StateSnapshot.balances` (by `asset`), `EvidenceBundle.items` (by `itemId`). Use `normalizePolicyProfile` on raw policy input.

Fields excluded from the object's own hash: `intentHash`, `policyHash`, `stateHash`, `evidenceRoot`, `signature`/`receiptHash`.

## Action Intent
`intentId`; `actionType` (`SPOT_TRADE`); `venue`; `accountRef` (opaque 32-byte commitment, never a raw account id); `assetIn`/`assetOut` (must differ); `amount` (atomic `assetIn`); `maxSlippageBps` (0–10000); `limitPrice` (atomic `assetOut` per 1e18 atomic `assetIn`); `expiry`; `idempotencyKey`; `policyVersion`; `intentHash?`.

## Agent Mandate (mandate policy)
`policyVersion`; `allowedVenues`, `allowedAssets` (sets); `maxAmountPerAction`, `positionCap`, `dailyTurnoverCap`, `reserveRequirement` (atomic); `maxSlippageBps`; `quoteFreshnessSeconds`; `cooldownSeconds`; `finalityRule`; `policyExpiry`; `paused`; `policyHash?`. Stable numeric rule IDs for each constraint are in `RuleId`; never renumber.

## State Snapshot
`balances` (`{asset, amount}`, one per asset, sorted); `reservedBudget`; `usedDailyTurnover`; `lastActionTime?` (omitted before the first action); `policyStatus` (`ACTIVE|PAUSED|EXPIRED`); `freshnessSeconds`; `timestamp`; `stateHash?`.

## Evidence Bundle
`items` (sorted by `itemId`): `itemId`, `sourceClass` (`CANONICAL_CHAIN_STATE|SIGNED_VENUE_ATTESTATION|UNSIGNED_VENUE_API|THIRD_PARTY_INDEXER|AGENT_LOCAL_LOG`), `tag`, `timestamp`, `payloadHash`, `integrity {method, proofHash?}`; `collectedAt`; `finalityResult?` (placeholder until Phase 2); `evidenceRoot` = `hashList(EVIDENCE_BUNDLE, items)`.

## Receipt
`ReceiptUnsigned`: `receiptId`, `status` (`PENDING|PROVED|NON_PROVABLE|INVALIDATED|DEV_UNVERIFIED`; the last is dev-only and never PROVED), `claimType` (`ORDER_PLACED|TRADE_EXECUTED`), `intentHash`, `policyHash`, `evidenceRoot` (other objects by hash only), `finalityRule`, `verifierVersion` (semver), `proof?` (required exactly when `PROVED`), `createdAt`. `SignedReceipt` adds `signerKeyId` and `signature`.

## Assumed values (MVP)
The venue (`UNISWAP_V3_BASE`), finality rule (`BASE_CONFIRMATIONS_12`), evidence tags and proof system (`SP1`) enums are placeholders sized to the Base spot-trade MVP; extend them by appending values.

`fixtures/valid` has one object per type (plus a PROVED receipt); `fixtures/invalid` has known-bad cases. `@swaraj/crypto` derives its golden vectors from the valid ones.
