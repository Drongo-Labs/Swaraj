# Swaraj setup and run (Phase 1–10)

**Live-only runtime:** `pnpm dev:api` requires Postgres + Base RPC + execution/signer keys. There is **no silent mock fallback**. Mock adapters are CI/unit only (`SWARAJ_FORCE_MOCK=1` or `pipelineMode: "mock"` in tests).

## Prerequisites

- Node.js `>= 22.12`
- pnpm `10.12.1` (see root `packageManager`)
- Docker (Postgres via `pnpm db:up`)
- Funded Base mainnet wallet (ETH for gas + USDC for ALLOW trades) + `BASE_RPC_URL`
- For auto-prove → PROVED: SP1 host/ELF/VKeys + either `KURIER_API_KEY` (Kurier submits) or `ZKVERIFY_SEED_PHRASE` (direct zkVerify)
- Lean gate: `pnpm check:lean` (Phase 10 suite)

## 1. Install

```sh
git clone <repo-url> Swaraj
cd Swaraj
pnpm install
pnpm build
```

## 2. Environment

```sh
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Notes |
|---|---|---|
| `SWARAJ_DEV_TOKEN` | Yes | ≥ 32 characters; used as `Authorization: Bearer …` |
| `SWARAJ_URL` | For agent/UI | Default `http://127.0.0.1:3000` |
| `SWARAJ_APPLICATION_ID` | For agent/UI | Default `app_demo` |
| `DATABASE_URL` | Yes (live) | Postgres for policies, capabilities, receipts, proof queues |
| `SWARAJ_BASE_NETWORK` | Recommended | `base` (mainnet) or `base-sepolia` (testnet) |
| `BASE_RPC_URL` | Yes (live) | Mainnet or `https://sepolia.base.org` (must match network) |
| `SWARAJ_EXECUTION_PRIVATE_KEY` | Yes (live) | `0x…` funded wallet — **real USDC spend on ALLOW** |
| `SWARAJ_SIGNER_PRIVATE_KEY` | Yes (live) | Receipt signing key |
| `SWARAJ_SP1_*` | For PROVED | Auto-prove after ALLOW/BLOCK when set |
| `KURIER_API_KEY` | For PROVED (Kurier) | Kurier submits each proof once; status is polled and checked on zkVerify |
| `ZKVERIFY_SEED_PHRASE` | For PROVED (direct) | Only when `KURIER_API_KEY` is unset |
| `KURIER_CHAIN_ID` | Optional | `84532` publishes the aggregation to Base Sepolia (see §5b) |
| `SWARAJ_PROOF_SERVICE` | Optional | `external` if you run `worker:service` yourself instead of the API |
| `SWARAJ_AUTO_PROVE` | Optional | Default on when SP1 env present; set `0` to disable |
| `SWARAJ_FORCE_MOCK` | CI only | Never for demo |
| `UNISWAP_V3_ROUTER` | Optional | Default SwapRouter02 on Base |
| `UNISWAP_V3_FEE` | Optional | Default `500` |
| `BASE_CONFIRMATIONS` | Optional | Default `12` |

For the web UI, either export the same token/URL or create `apps/web/.env`:

```sh
VITE_SWARAJ_URL=http://127.0.0.1:3000
VITE_SWARAJ_DEV_TOKEN=<same as SWARAJ_DEV_TOKEN>
VITE_SWARAJ_APPLICATION_ID=app_demo
```

## 3. Run — live (Postgres + Base)

Requires `DATABASE_URL`, `BASE_RPC_URL`, `SWARAJ_EXECUTION_PRIVATE_KEY`, and `SWARAJ_SIGNER_PRIVATE_KEY`. Real SMT, live portfolio state from RPC, Uniswap v3 execution, 12-conf evidence. Missing env → **startup error** (no mock).

```sh
pnpm db:up
# fill .env from .env.example
pnpm dev:api
```

`/health` should show `mode: "base"`, `live: true`, `phases.lean: "Phase10"`, and SP1/zkVerify/Kurier readiness.

Chain-off CI only (not for demos):

```sh
SWARAJ_FORCE_MOCK=1 SWARAJ_DEV_TOKEN='…' pnpm --filter @swaraj/api test
```

```sh
# terminal 2 — UI (optional)
pnpm dev:web
```

Open the Vite URL (usually `http://127.0.0.1:5173`).

### Smoke test (curl)

```sh
TOKEN='your-token-at-least-32-characters-long'

curl -s http://127.0.0.1:3000/health | jq .

# ALLOW → PENDING receipt
curl -s -X POST http://127.0.0.1:3000/v1/applications/app_demo/actions \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"action":"trade.spot","input":{},"idempotencyKey":"demo-allow-1"}' | jq .

# BLOCK (policy)
curl -s -X POST http://127.0.0.1:3000/v1/applications/app_demo/actions \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"action":"trade.block","input":{},"idempotencyKey":"demo-block-1"}' | jq .
```

Optional Postgres:

```sh
pnpm db:up
# ensure DATABASE_URL in .env matches docker-compose
pnpm dev:api
```

## 4. Base execution details

**Warning:** integrated mode broadcasts real swaps on Base mainnet. Demo ALLOW uses ~50 USDC (`assetIn` USDC → WETH). Use a dedicated funded wallet.

`GET /health` should show `mode: "base"`, `phases.base: "rpc"`, `phases.execution: "uniswap_v3"`, `policyStore: "postgres"`, `capabilityStore: "postgres"`.

Pipeline:

1. Load ACTIVE policy from registry  
2. SMT ALLOW  
3. Capability issue (Postgres)  
4. Uniswap `exactInputSingle` on Base  
5. Wait for ≥12 confirmations  
6. Evidence `FINAL` + signed `PENDING` receipt  
7. Proof inputs recorded; `PROVED` after `prover:once` and the recurring proof service

## 5. Phase 7–9 — guest bundle and prove (optional)

Works after any ALLOW that stored a prove context (Base after 12-conf finality, or `SWARAJ_FORCE_MOCK=1` with fixture evidence in tests).

After ALLOW:

```sh
RECEIPT_ID='receipt_demo-allow-1'   # from the ALLOW response

curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:3000/v1/applications/app_demo/receipts/$RECEIPT_ID/guest-bundle" \
  | jq .guestBundle > /tmp/guest.json

# Requires SP1 toolchain + built ELF:
pnpm build:sp1
pnpm prove:sp1 -- --input /tmp/guest.json
```

Artifacts are `POLICY_DECISION_V1`. They do **not** promote the trade receipt to `PROVED` (Phase 8).

## 5a. Proof service and Kurier submission

After an ALLOW/BLOCK the API runs `prover:once`, which enqueues the SP1 artifact. A single recurring
worker owns both proof queues and publication tracking:

```sh
pnpm --filter @swaraj/proofs worker:service   # runs until SIGINT/SIGTERM
```

When auto-prove is on, the API starts and supervises this service itself (restarting it with backoff);
set `SWARAJ_PROOF_SERVICE=external` to run it separately. It respects each job's `next_attempt_at` and
lease, so finality and Kurier polling continue without API traffic and resume after a restart. The
`worker:once` / `worker:decision:once` commands remain for manual runs and tests.

Submission is fixed per job before anything is paid for:

- `KURIER_API_KEY` set → Kurier. Exactly one POST per job; its job ID is stored on the job row and later
  attempts poll `GET /job-status`. Verification opens a **read-only** zkVerify session — no seed phrase.
- otherwise → direct zkVerify with `ZKVERIFY_SEED_PHRASE`.

A Kurier status never promotes a receipt: once Kurier reports the zkVerify transaction, the worker reads it
back from a finalized canonical block and checks the pinned key, the public inputs and its own
`ProofVerified` event. If a submission's outcome is unknown (POST timeout, crash before the job ID was
saved), the job moves to `RECONCILE` and is never resubmitted automatically. Look it up in Kurier, then
either record the job (`UPDATE … SET provider_job_id='…', state='SUBMITTED', next_attempt_at=now()`) or,
once you are sure nothing was accepted, clear it (`SET submission_started_at=NULL, state='RETRY'`).

Apply `packages/database/migrations/phase11_kurier_submission.sql` to existing databases
(`schema.sql` already includes it). Entries in an old `kurier-jobs.json` are adopted on first use instead of
being submitted again.

## 5b. Base Sepolia publication (Kurier)

```dotenv
KURIER_API_URL=https://api-testnet.kurier.xyz/api/v1
KURIER_CHAIN_ID=84532
# KURIER_API_KEY: configure securely, never commit the value.
SWARAJ_BASE_SEPOLIA_ZKVERIFY_CONTRACT=   # official zkVerify aggregation contract on Base Sepolia
KURIER_DESTINATION_DOMAIN_ID=            # aggregation domain Kurier publishes to for 84532
```

Take the contract address and domain ID from zkVerify's current deployment docs; nothing is defaulted.
`PROVED` still means "independently verified on zkVerify". Publication is tracked separately
(`destination.status`: `AWAITING_ZKVERIFY` → `PENDING` → `PUBLISHED` / `FAILED`) and is reported as
published only after the Base Sepolia contract, reached through an RPC that really is chain 84532,
holds the aggregation root and accepts this proof's statement and Merkle path. A later publication
failure never revokes a `PROVED` receipt. `SWARAJ_BASE_NETWORK=base-sepolia` selects the *trade* network
and is independent of `KURIER_CHAIN_ID`.

## 6. Useful commands

| Command | Purpose |
|---|---|
| `pnpm build` | Build all packages |
| `pnpm check` | Build + typecheck + tests |
| `pnpm dev:api` | Start API on `127.0.0.1:3000` |
| `pnpm dev:web` | Start web console |
| `pnpm db:up` | Start Postgres via Docker Compose |
| `pnpm prove:sp1` | SP1 host prove |

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| `SWARAJ_DEV_TOKEN must contain at least 32 characters` | Lengthen the token |
| `401 unauthorized` | Bearer token must match API `SWARAJ_DEV_TOKEN` |
| Base mode fails at startup missing env | Set `BASE_RPC_URL` and `SWARAJ_EXECUTION_PRIVATE_KEY` |
| `pipeline_failed` / approve or swap revert | Fund wallet (ETH + USDC), check allowance/balance, fee tier, slippage/`limitPrice` |
| Evidence finality timeout | Raise wait (RPC lag) or check tx mined; Base mode does not fake `FINAL` |
| `guest_bundle_unavailable` | Receipt was not created in this API process, or ALLOW failed before prove context was stored |
| UI cannot reach API | Set `VITE_SWARAJ_URL` / CORS is open for local origins |

## What is still mock vs real

| Piece | Integrated (`DATABASE_URL` + Base keys) | `SWARAJ_FORCE_MOCK=1` / tests |
|---|---|---|
| SMT / policies / capabilities / receipts | Real (Postgres) | Real SMT; memory or Postgres if URL set |
| Execution | Live Uniswap v3 on Base | Fixture tx |
| Evidence / finality | RPC + 12 confirmations | Fixtures |
| SP1 guest-bundle + proof inputs | Recorded | Recorded when finality allows |
| zkVerify / `PROVED` | `prover:once` + recurring `worker:service` | Same workers; often with fixture FINAL in tests |

See [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) for open items (auto-prove, Merkle verify, live zkVerify).
cl