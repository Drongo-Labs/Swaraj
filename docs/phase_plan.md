# Swaraj — Phase Plan

Working document for the new repository. Tracks what the system is, what gets
built in which phase, and what "done" means for each phase.

This is the Day 1 skeleton. Phase detail is expanded as the phase is entered,
and each phase's status is recorded here as it completes (Day 5 of the
restructure plan and beyond).

## Stack

Everything is TypeScript except two places: the SP1 guest program is Rust,
and the assurance suite is Lean 4.

| Layer | Choice |
|---|---|
| HTTP API | Fastify |
| Web UI | React + Vite |
| Validation | Zod |
| Policy decisions | Z3 (`z3-solver`) driven from TypeScript |
| Chain access | viem on Base |
| Persistence | PostgreSQL (`pg`) |
| Proofs | SP1 (Rust guest), zkVerify for verification |
| Formal assurance | Lean 4 |

## Phase map

MVP target: formally constrained trade authorization with a post-trade
receipt on one Base venue, carrying ORDER_PLACED and TRADE_EXECUTED claims.

| Phase | Name | Goal in one line | Exit when |
|---|---|---|---|
| 0 | Foundation | Workspace, compose, tooling wired up | Day 1 checklist green |
| 1 | Core objects | Zod schemas, canonical encoding, hashing, signing | Objects round-trip, hash, and verify |
| 2 | Evidence | Venue adapters, artifact collection, finality | A real Base tx yields a typed, rooted evidence bundle |
| 3 | Receipts | Durable lifecycle with fail-closed transitions | Illegal transitions are unrepresentable |
| 4 | Policy gateway | Policy → SMT → Z3 ALLOW/BLOCK before any effect | Every decision reproducible from stored query |
| 5 | Capabilities | Intent-bound tokens, reservations, execution | No path to execution without a valid capability |
| 6 | Product surface | API routes, UI, testnet demo | Allowed trade executes; blocked trade never touches chain |
| 7 | SP1 program | Guest recomputes checks over committed inputs | Proof generates and verifies locally |
| 8 | zkVerify | Public verification bound to receipts | PROVED only with a finalized verified proof |
| 9 | Block proofs | Rejections are provable to third parties | A block proof cannot exist for an allowed input |
| 10 | Lean suite | Framework properties kernel-checked | Release artifacts cover policy/compiler/lifecycle invariants |
| 11 | More venues | One venue at a time, no weakened guarantees | Each venue passes adversarial tests pre-enable |
| 12 | Privacy | Optional extensions, no new trusted platform | Evaluated and documented before adoption |

## Ownership

See `OWNERSHIP.md` (created Day 5). Current split per the restructure plan:

- Kushagra — schemas, crypto, evidence, receipts, capability, contracts, sdk,
  api, web, example, root how-to docs
- Ayush — database, smt, lean, proofs, mcp, compose, workspace config, docs/,
  examples/, README

## Status log

| Date | Entry |
|---|---|
| 2026-10-18 | Day 1: workspace config, compose + Postgres scaffold, docs/ and examples/ skeletons. |
| 2026-10-18 | Day 2: `packages/database` (migrations, pool, receipt lifecycle guarded in the DB, proof queue) — 6 tests against live Postgres. `packages/smt` (typed rule AST, SMT-LIB renderer, Z3 session, fail-closed gateway with rule attribution) — 10 tests. `packages/proofs` (Rust gate engine — 7 cargo tests; SP1 guest/host programs written, not yet compiled pending the SP1 toolchain; TS statement/bundle/worker layer with parity tests against the gateway) — 7 tests. Fresh-volume schema load verified. |

### Day 2 notes / carried into Day 3

- `pnpm build:sp1` needs the SP1 toolchain (`cargo prove`), not installed on
  this machine; guest and host are written but uncompiled.
- The zkVerify sink is currently local-deterministic only; network
  submission wiring (zkverifyjs / Kurier) is a Day 3–4 task.
- Statement canonical text and id are pinned identically in TS and Rust
  tests; a shared test-vector file for the policy digest is a Day 3 task.

