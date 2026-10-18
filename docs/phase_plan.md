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

Status legend: **done** = implemented and tested in this repo,
**partial** = the parts owned here are done but dependencies or network
steps remain, **pending** = not started (many of these are not owned by
this workstream).

| Phase | Name | Goal in one line | Status |
|---|---|---|---|
| 0 | Foundation | Workspace, compose, tooling wired up | partial — workspace, Postgres, TS/Rust/Lean checks green; API/UI/CI pending |
| 1 | Core objects | Zod schemas, canonical encoding, hashing, signing | pending (schemas/crypto owner) — the shared rule AST and its canonical digest cover the gateway's needs |
| 2 | Evidence | Venue adapters, artifact collection, finality | pending (evidence owner); the proof payload carries an evidence digest seam |
| 3 | Receipts | Durable lifecycle with fail-closed transitions | partial — DB-trigger-guarded lifecycle, event log, idempotency done; receipt signing pending (crypto owner) |
| 4 | Policy gateway | Policy → SMT → Z3 ALLOW/BLOCK before any effect | done — fail-closed, rule attribution, replayable scripts, 10 tests + shared vectors |
| 5 | Capabilities | Intent-bound tokens, reservations, execution | pending (capability owner) |
| 6 | Product surface | API routes, UI, testnet demo | partial — API contract pinned and integration-tested via the fixture; production API/UI pending (api/web owners) |
| 7 | SP1 program | Guest recomputes checks over committed inputs | done for the gate scope — guest ELF builds (SP1 6.9.0), the guest derives the same statement id inside the zkVM, and a real locally-verified proof was generated and driven through the e2e test |
| 8 | zkVerify | Public verification bound to receipts | partial — job queue, artifacts, attestation recording, submit/poll/finalize sink flow done against a local relay; network endpoint pending |
| 9 | Block proofs | Rejections are provable to third parties | pending — the BLOCK path is decided and attributed; decision receipts and their proofs are planned |
| 10 | Lean suite | Framework properties kernel-checked | partial — attribution, monotonicity, ALLOW soundness proved on the shared DSL; more properties as phases land |
| 11 | More venues | One venue at a time, no weakened guarantees | pending |
| 12 | Privacy | Optional extensions, no new trusted platform | pending |

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
| 2026-10-18 | Day 3: `packages/lean` assurance suite on Lean 4.19 (elan installed): term DSL mirroring the shared AST, fail-closed decision model, kernel-checked theorems — attribution (`violatedOf_iff`), monotonic restriction (`block_persists` via `violatedOf_append`), ALLOW soundness (`allow_all_rules_true`), decision characterization (`decide_allow_iff`). Shared vector file (`packages/proofs/vectors/gate-vectors.json`) consumed by both the TS gateway test and generated Lean examples (`sync:vectors`), 6 cases. Proof pipeline integration: evidence digest rides the job payload into the bundle/artifact; remote zkVerify submission sink (submit → poll → finalize) tested against a local relay including a full worker run binding the attestation to the receipt. |
| 2026-10-18 | Day 4: `apps/mcp` (`swaraj-mcp`) — hand-rolled MCP stdio server (JSON-RPC, newline-delimited; initialize/tools-list/tools-call/ping), three tools over the API contract, HTTP client. Verified against a pipeline fixture implementing the documented routes on the real packages: host handshake over real stdio (spawned process), ALLOW/BLOCK submission with rule attribution, idempotency, proof worker promoting a receipt to PROVED and reading it back through the tool. Integration tests for smt/database/proofs behind the API routes (12 tests total). `apps/api` itself is still pending (not owned here); the fixture exists so the contract is verified end to end in the meantime. |
| 2026-10-18 | Day 5: SP1 toolchain installed (`sp1up` → cargo-prove v6.9.0); guest ELF and host builds launched. Migration 0004 adds `SP1_PROOF` artifacts; the worker can now run the SP1 guest prover between bundling and submission (guest statement-id parity enforced, proof stored on disk and in the ledger). E2E proof tests: bundle + attestation artifacts asserted on disk and in the ledger, evidence-less payloads, terminal-state protection; SP1 path auto-skips until artifacts are configured. Test runner serialized (`--test-concurrency 1`) — the suites share one database. Docs: new `proof-pipeline.md`; `integration.md` filled for the implemented contract; `phase_plan.md` now carries per-phase status; `examples/json-to-smt.md` verified by a contract test; README (setup, layout, commands) and OWNERSHIP.md created. Guest completed same day: aligned to SP1 6.9.0, real zkVM execution with statement-id parity, locally-verified compressed proof driven through the worker (see the Day 5 completion commit). |
| 2026-10-18 | Day 7 (buffer + cleanup): Rust engine now consumes the shared gate vectors (3 new tests; every suite — TS gateway, TS ground, Rust engine, Lean examples — runs the same JSON file). Standalone worker (`proofs:worker`) passes SP1 config through when the toolchain env is set. Dead-code sweep with noUnusedLocals/noUnusedParameters: 5 findings fixed, now zero across all packages. Security review: `.env` never in git history, no secret-shaped strings in tracked files, `.env.example` is placeholders only. Final verification on a fresh volume: `pnpm install` + `pnpm check` (45 TS tests) + `check:rust` (10 tests) + `check:sp1-host` + `check:lean` all green. |
| 2026-10-18 | Day 6 (integration): one-shot full-pipeline test (`apps/mcp/test/full-pipeline.test.ts`) — application + policy created through the API contract, policy read back through MCP, blocked action leaves no receipt, allowed action submits with idempotency replay, the proof worker runs the real SP1 guest in the zkVM, all artifacts land (bundle + SP1 proof + attestation), and the PROVED receipt is read back through the MCP tool. Fresh-volume integrated cycle + `pnpm check:all` green: 45 TS tests (zero skips), 7 Rust tests, Lean build. Capability/execute/evidence and web-UI stages remain pending on the other workstream's packages. |

### Handoff notes (Day 7)

Done since the last review: the SP1 toolchain is installed and the guest,
host, and full proof path work end to end (phase 7 done for the gate
scope); the Rust engine now consumes the shared vector file like the TS
and Lean suites.

Open, outside this workstream:

- `apps/api`, `apps/web`, `apps/example` and the protocol packages
  (schemas, crypto, receipts, evidence, capability, contracts, sdk) —
  the other owner's restructure scope. The API contract they must
  implement is pinned by `apps/mcp/test/pipeline-fixture.ts` and
  `docs/integration.md`.
- Real zkVerify network submission (keys in `.env`); the submission
  flow is implemented against any HTTP endpoint shaped like the local
  relay in `scripts/submission.test.ts`.
- Phase 9 (provable rejections) once receipts and capabilities land.
- Team sync: ownership confirmation against `OWNERSHIP.md`, review
  process, and recurring syncs — human tasks, not code.

