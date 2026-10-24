# Swaraj — Ownership

Ownership of every package in the repo. The split follows the
restructure plan: one workstream owns the data, policy, proof, and
interface layers; the other owns the protocol core and product apps.

---

## Workstream A — Data, policy gateway, proofs, MCP, tooling, docs

| Package / area | Responsibility |
|---|---|
| `packages/database` | Postgres schema and migrations, pool, decision records, receipt lifecycle (DB-enforced), idempotency, proof queue, artifact ledger |
| `packages/smt` | Rule AST, SMT-LIB renderer, Z3 integration, fail-closed ALLOW/BLOCK gateway with rule attribution |
| `packages/proofs` | Rust gate engine, SP1 guest + host, statements and bundles, proof worker, zkVerify sink, shared vectors |
| `packages/lean` | Lean 4 assurance suite, kernel-checked theorems, vector generator |
| `apps/mcp` | `swaraj-mcp` MCP stdio bridge and the API contract tests |
| `compose.yaml` | Postgres dev environment |
| `pnpm-workspace.yaml`, `tsconfig.base.json`, root `package.json` | Workspace and TypeScript configuration |
| `docs/` | `phase_plan.md`, `integration.md`, `proof-pipeline.md` |
| `examples/` | `json-to-smt.md` (verified by a contract test) |
| `README.md`, `OWNERSHIP.md` | Repo-level documentation |

## Workstream B — Core protocol, execution, product apps

| Package / area | Responsibility |
|---|---|
| `packages/schemas` | Zod schemas for the core objects, fixtures, normalization |
| `packages/rules` | Unified action permit/forbid evaluation and default-deny semantics |
| `packages/crypto` | Canonical hashing, signing, key management, test vectors |
| `packages/receipts` | Receipt lifecycle engine, signing, storage adapters |
| `packages/evidence` | Venue adapters (mock + Base RPC), evidence collection, finality |
| `packages/capability` | Capability tokens, budget reservations, execution adapters |
| `packages/contracts` | Shared contract types and interfaces |
| `packages/sdk` | TypeScript HTTP client for external agents |
| `apps/api` | Fastify API, full pipeline orchestration |
| `apps/web` | React + Vite demo UI |
| `apps/example` | Offline SDK usage example |
| `.env.example` | Root environment template (shared; the database section is owned by A) |

---

## Interfaces between the two

- The API contract (`POST /actions`, `GET /receipts/:id`,
  `GET /policies/:id`, bearer auth) is pinned by
  `apps/mcp/test/pipeline-fixture.ts` and documented in
  `docs/integration.md`; `apps/api` must implement it so the bridge and
  the integration tests can switch from the fixture to the real API.
- The policy wire format (integer JSON, `kind`-tagged terms) is shared
  by the gateway, the Rust engine, and the Lean suite; the canonical
  statement text (`swaraj/statement/v1`) is the proof-layer contract.
- Receipt state semantics (`PENDING`/`PROVED`/`NON_PROVABLE`/
  `INVALIDATED`) and the fail-closed rules live in `docs/` and are
  enforced by the database regardless of which layer writes.
