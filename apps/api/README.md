# Development API

Copy `.env.example` to `.env` at the workspace root, choose a local development token of at least 32 characters, and run `pnpm dev:api`. The API binds to `127.0.0.1:3000`.

## Pipeline modes

| Condition | Behavior |
|---|---|
| `DATABASE_URL` + `BASE_RPC_URL` + `SWARAJ_EXECUTION_PRIVATE_KEY` | **Integrated:** real SMT, Postgres stores, Uniswap v3 on Base, RPC evidence (12 conf). |
| `SWARAJ_FORCE_MOCK=1` or tests `pipelineMode: "mock"` | Fixture execute + evidence (CI / unit). |
| No `DATABASE_URL` | Memory stores + mock chain (local package tests). |

Flow:

Agent proposes → load ACTIVE policy from registry → Phase 4 SMT → Phase 5 capability → execute → Phase 2 evidence → Phase 3 receipt → Phase 8/9 proof inputs recorded (workers promote to `PROVED`)

| Endpoint | Behavior |
|---|---|
| `GET /health` | Status + phase flags (`base`, `execution`, `capabilityStore`, `policyStore`, `proofQueue`) |
| `POST /v1/policy/check` | Legacy amount-only Z3 simulation |
| `POST /v1/applications/:id/policies` | Create/activate policy (Postgres when configured) |
| `GET /v1/applications/:id/policies/:policyId` | Active policy |
| `POST /v1/applications/:id/actions` | Full authorize → execute → receipt pipeline |
| `GET /v1/applications/:id/receipts/:receiptId` | Signed receipt + assumptions |
| `GET /v1/applications/:id/receipts/:receiptId/guest-bundle` | Phase 7 SP1 `--input` JSON |
| `GET /v1/applications/:id/audit` | Recent decision/execution/receipt events |
| `GET /v1/applications/:id/activity` | Agent-view feed: ALLOW/BLOCK, why, receipt ids, proof refs |
| Receipt / decision-receipt `proof.kurierUrl` | Explorer link when tx / aggregation / Kurier job id is present |
| `GET /v1/applications/:id/decisions/:decisionId` | Decision lookup when an id was recorded |

**Demo actions**
- ALLOW: `{"action":"trade.spot","input":{"policyId":"policy_demo"},"idempotencyKey":"…"}`
- BLOCK: `{"action":"trade.block","input":{"policyId":"policy_demo"},"idempotencyKey":"…"}`

`input.policyId` selects the ACTIVE registry policy (client `input.policy` is ignored when the API has a store). Optional `input.state` / `input.intent` override demo fixtures. Demo ALLOW amount is 50 USDC on Base — only use Base mode with a wallet you intend to spend from.
