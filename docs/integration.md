# Integrating with Swaraj

Day 1 skeleton for the integration guide. Sections below are the outline the
finished document will follow; prose is filled in as the pieces it describes
land (Day 4–5 of the restructure plan). When in doubt, the code under
`packages/sdk` and `apps/api` is the source of truth.

## Model

Swaraj is a backend service between agents and effects. An application owner
registers actions, rules, and integrations; agents submit actions through the
SDK or MCP; Swaraj decides, executes through a controlled adapter, and emits
signed, eventually proof-bound receipts.

## Outline

### 1. What the application owner defines

TODO (Day 4): action schemas, policies, trusted state sources, execution
adapter, evidence rules — and what the backend validates before activation.

### 2. Registration and activation

TODO (Day 4): owner-side setup flow, credential scoping, versioning of
configuration.

### 3. Submitting an action from an agent

TODO (Day 4): SDK `submitAction` contract, idempotency keys, canonical intent
envelope, what ALLOW does and does not mean.

### 4. Decisions and receipts

TODO (Day 4): ALLOW/BLOCK semantics, receipt statuses
(PENDING / PROVED / NON_PROVABLE / INVALIDATED), what each status obliges the
integrator to do or not do.

### 5. MCP access

Implemented: `apps/mcp` (`swaraj-mcp`) speaks MCP over stdio (JSON-RPC,
newline-delimited) and calls the API over HTTP using the same routes and
credentials as the SDK. Requires `SWARAJ_URL` and `SWARAJ_DEV_TOKEN` in
the environment. Start it with `pnpm dev:mcp`.

| Tool | Arguments | Result |
|---|---|---|
| `swaraj_submit_action` | `applicationId`, `policyId`, `input` (decimal strings), optional `idempotencyKey` | Decision JSON: `decision`, `receiptId` (ALLOW only), `violatedRuleIds`, `policyDigest`. A BLOCK is returned with `isError: true` — it is a decision, not a transport failure |
| `swaraj_get_receipt` | `receiptId` | Receipt state (`PENDING`/`PROVED`/`NON_PROVABLE`/`INVALIDATED`), `proofRef`, claim |
| `swaraj_get_policy` | `policyId` | Revision, canonical digest, rule ids |

Invalid tool arguments come back as tool results with `isError: true`;
unknown tools are JSON-RPC errors (-32602). Policy administration and
credential provisioning stay outside the tool surface. The hosted
transport (Streamable HTTP with the MCP authorization flow) remains
planned; today the bridge is stdio-only, pointed at the configured API.

Until the production `apps/api` lands, the integration tests run the
bridge against `apps/mcp/test/pipeline-fixture.ts`, which implements
this API contract directly on the real packages (SMT gateway, Postgres
persistence, proof queue).

### 6. Retries, policy changes, and failure

TODO (Day 4): idempotency-key discipline across retries, reconciliation after
timeouts, behavior on policy version bumps and stale state.

### 7. Deployment topologies

TODO (Day 5): hosted vs self-hosted, what the Compose file covers today
(development Postgres only), where proof work runs.
