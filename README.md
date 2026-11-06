# Swaraj

Formally constrained authorization for autonomous agents: every action is
checked against a versioned policy before any effect, decided through an
SMT gateway, and every decision is recorded durably and can be carried to
a proof-bound receipt.

Status: active development. See [docs/phase_plan.md](docs/phase_plan.md)
for the phase map and what is implemented today, and
[OWNERSHIP.md](OWNERSHIP.md) for who owns what.

## Layout

| Path | Contents |
|---|---|
| `packages/schemas` | Canonical request, policy, evidence, snapshot, and receipt schemas |
| `packages/rules` | Unified-action Agent Mandate evaluation with forbid precedence and default deny |
| `packages/crypto` | Canonicalization, hashing, signing, key registry, and shared vectors |
| `packages/evidence` | Normalized venue evidence and Base RPC adapters |
| `packages/capability` | Capability tokens, budget reservations, and execution adapters |
| `packages/receipts` | Receipt lifecycle and memory/Postgres stores |
| `packages/contracts` | Shared API contracts and policy fixtures |
| `packages/sdk` | Typed HTTP client for agents |
| `packages/verify` | `swaraj-verify`: checks a receipt bundle with no Swaraj service |
| `packages/smt` | Typed integer rule AST, SMT-LIB renderer, Z3 session, fail-closed policy gateway with rule attribution |
| `packages/database` | Postgres migrations, pool, decision records, trigger-guarded receipt lifecycle, idempotency ledger, proof queue, artifact ledger |
| `packages/proofs` | Rust gate engine, SP1 guest/host, statement/bundle layer, proof worker, zkVerify submission sink |
| `packages/lean` | Lean 4 assurance suite: kernel-checked framework properties, shared vector proofs |
| `integrations/near` | `@swaraj/near`: everything NEAR, including execution, evidence, mandates and the demo |
| `apps/api` | Authorization, execution, receipt, and proof HTTP service |
| `apps/mcp` | `swaraj-mcp` tools, and `swaraj-mcp-gateway`: a fail-closed proxy for an agent's MCP servers |
| `apps/web` | React owner and agent interface |
| `apps/example` | SDK demo and live-agent example |
| `spec/` | [Receipt format](spec/receipt-v1.md) and [theorem list](spec/theorems.md) |
| `docs/` | [phase plan](docs/phase_plan.md), [integration guide](docs/integration.md), [proof pipeline](docs/proof-pipeline.md) |
| `examples/` | [JSON → SMT walkthrough](examples/json-to-smt.md), kept honest by a contract test |

## Setup

Requirements: Node 22.12+ (24/25 recommended), pnpm 10, Docker, a Rust
toolchain (for the engine), Lean 4 via elan (for the assurance suite),
and the SP1 toolchain only if you build guest proofs.

```bash
pnpm install                       # workspace install

cp .env.example .env               # local secrets/config; never commit .env
pnpm db:up                         # Postgres 16 in Docker; schema loads on first boot
pnpm check                         # build + typecheck + all TS tests; needs the Postgres above
```

The test suites for `database`, `proofs`, and `mcp` run against the
Compose Postgres and read `DATABASE_URL` from `.env`.

## Daily commands

```bash
pnpm check            # build, typecheck, and test every TS package
pnpm check:rust      # Rust engine tests (packages/proofs/engine)
pnpm check:lean      # Lean suite: kernel-checked theorems + shared vectors
pnpm check:all       # everything above

pnpm db:up           # start Postgres        pnpm db:stop to stop it
pnpm proofs:worker   # process one queued proof job (local sink)
pnpm dev:mcp         # start the MCP stdio bridge

pnpm --filter @swaraj/lean sync:vectors   # regenerate Lean vectors from the shared JSON
pnpm build:sp1        # SP1 guest ELF (needs the SP1 toolchain + Docker)
```

## How it works

1. **Decide.** A policy is a typed integer rule document (see the
   [example](examples/json-to-smt.md)). The gateway compiles it plus the
   action's ground values to SMT-LIB and asks Z3; malformed input, solver
   failure, or unknown verdicts fail closed to BLOCK. A BLOCK names the
   exact violated rules, reproducible from the stored script.
2. **Record.** Decisions, receipts, and idempotency claims persist in
   Postgres. Receipt transitions are guarded by a database trigger —
   illegal moves (e.g. `PROVED` → `PENDING`) are impossible even from
   raw SQL — and every move is appended to an event log.
3. **Prove.** A queued proof job re-derives the decision deterministically,
   refuses to bundle on any disagreement with the recorded decision, and
   emits a canonical statement whose id is the SHA-256 of its text —
   identical in TypeScript, Rust, and (as checked examples) Lean. With
   the SP1 toolchain configured, the Rust guest re-derives the same
   statement id inside the zkVM before the sink attests and the receipt
   promotes to `PROVED`. Details: [docs/proof-pipeline.md](docs/proof-pipeline.md).
4. **Talk to it.** Agents submit actions over HTTP (the SDK's contract)
   or through MCP tools; see [docs/integration.md](docs/integration.md).

## Development notes

- `CI=true` in your environment makes pnpm default to a frozen lockfile;
  use `pnpm install --no-frozen-lockfile` after editing package.json.
- Migrations are a single source of truth: the Compose container runs
  them on first boot, and `applyMigrations()` re-checks them
  idempotently from the application.
- Test files run serially (`--test-concurrency 1`) because the suites
  share one Postgres database.
