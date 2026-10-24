# Integration status (Phase 1–10)

> Integration note (2026-10-24): the merged repository uses the generic
> `@swaraj/proofs` statement worker (`runOneProofJob`) and its namespaced
> database ledger as the supported automated proof path. The API still exports
> receipt-bound guest bundles and validates their preflight gates, but the older
> receipt-specific `prover:once`, `worker:service`, and decision-worker commands
> described below were not present in either branch and are not runnable.

Updated after Phase 8/9 wiring and integrated (non-mock) API defaults. Mock is only for tests via `pipelineMode: "mock"` or `SWARAJ_FORCE_MOCK=1`.

## Done

| Gap | Status |
|---|---|
| Phases 1–7 packages on `main` | Done |
| Live Base Uniswap v3 execution adapter | Done (`createBaseUniswapExecutionAdapter`) |
| Live Base RPC evidence + 12-conf FINAL | Done (`createBaseVenueAdapter`) |
| API Base wiring when `DATABASE_URL` + RPC + execution key | Done |
| Postgres capability / reservation stores | Done |
| Postgres policy registry (API GET/POST + pipeline loads ACTIVE policy) | Done |
| Guest-bundle → SP1 `--input` | Done |
| `markProved(…, proofReference, signer)` + strict receipt gate (pinned VK, parsed public inputs, `ProofVerified` required) | Done |
| Phase 8 `proof_jobs` Postgres queue (leases, retries, `INCLUDED` recovery) + `worker:once` | Done |
| Claim scope `TRADE_RECEIPT_V1`: guest `receiptBinding` binds a proof to one exact signed receipt | Done |
| JS mirror of the guest verifier (`public-values.mjs`) with Rust-generated parity vectors | Done |
| Built-in worker adapter: Postgres + SP1 host `--verify` + pinned VKs + zkVerify submit/recover | Done (`src/worker-adapter.mjs`) |
| zkVerify recovery from finalized block (own `ProofVerified`, submitted `pubs`/`vk` checked) | Done (`src/zkverify.mjs`) |
| API records proof inputs (`proof_inputs`) for provable ALLOWs; `prover:once` proves + enqueues | Done |
| Phase 9 Decision Receipts created by the API for provable BLOCKs, bound to the decision log | Done |
| `decision_proof_jobs` + BLOCK gate + `worker:decision:once` | Done |
| SMT gateway aligned with the SP1 guest (rules 3, 4, 7) + 23 shared parity vectors | Done |
| PROVED Decision Receipts signed; NON_PROVABLE BLOCKs persisted with reason codes | Done |
| API/web expose trade proof status and Decision Receipt status | Done |
| Postgres E2E test: API → prover → workers → `PROVED` (SP1 host + chain simulated) | Done (`apps/api/test/postgres-proof-pipeline.test.mjs`) |
| Phase 10 Lean assurance suite (`Swaraj/Phase10.lean`) in the default `lake build` target | Done (`pnpm check:lean`) |

## Still open (leave for later / Phase 11+)

1. **Live Volta run:** rebuild guest ELF (`pnpm build:sp1`), re-pin `SWARAJ_SP1_VKEYS`, real prove + submit (needs `cargo prove` + Volta creds).
2. Guest still does not cryptographically verify Base Merkle/receipt proofs (metadata + blockHash binding only).
3. SP1 host needs rustc ≥ 1.94.1 (pinned `sp1-sdk` dependency tree).
4. Auto-run prover/worker: wired via `scheduleAutoProve` when `SWARAJ_SP1_*` is set (disable with `SWARAJ_AUTO_PROVE=0`).
5. Live portfolio state oracle: Base RPC balances in base mode (`GET .../state`; client fixture state ignored).

## Run integrated Base (real spend)

```sh
export DATABASE_URL='postgresql://…'
export BASE_RPC_URL='https://mainnet.base.org'   # or Alchemy/Infura
export SWARAJ_EXECUTION_PRIVATE_KEY='0x…'        # funded test wallet only
export SWARAJ_DEV_TOKEN='…'                      # ≥32 chars
pnpm dev:api
```

## Prove (Phase 8/9)

```sh
# Configure as in packages/proofs/PHASE8_STATUS.md, then:
pnpm --filter @swaraj/proofs prover:once            # prove stored bundles, enqueue artifacts
pnpm --filter @swaraj/proofs worker:once            # trade receipts → PROVED
pnpm --filter @swaraj/proofs worker:decision:once   # Decision Receipts → PROVED
```

A single receipt's bound bundle can still be exported for a manual run:
`GET /v1/applications/app_demo/receipts/<receiptId>/guest-bundle`, then pass it to `prove:sp1 -- --input`.

## Phase 8/9 checks

```sh
pnpm test:phase8
pnpm test:phase9
# existing DBs: apply migrations on top of the base schema
psql "$DATABASE_URL" -f packages/database/migrations/phase8_proof_jobs.sql
psql "$DATABASE_URL" -f packages/database/migrations/phase9_decision_receipts.sql
psql "$DATABASE_URL" -f packages/database/migrations/phase8_9_proof_pipeline.sql
# end-to-end on a disposable database (wipes receipt/proof tables)
SWARAJ_TEST_DATABASE_URL=postgres://…/disposable pnpm --filter @swaraj/api test
```

Fresh `pnpm db:up` volumes get both via `schema.sql`. A dev DB created from the old `schema.sql` has an incompatible placeholder `proof_jobs` table; drop it (or the volume) before applying the Phase 8 migration.
