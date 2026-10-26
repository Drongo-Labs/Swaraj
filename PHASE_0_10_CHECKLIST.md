# Swaraj — Phase 0–10 Completion Checklist

Updated: 2026-10-08

## Status legend

- `[x]` Complete offline: implementation/tests/documentation are present and can be checked without external production infrastructure.
- `[~]` Live verification / deployment work remains. The offline implementation is present, but the checklist item must not be represented as production-complete.
- `[ ]` Not implemented in this repository.

> Scope of this checklist: complete the non-live work through Phase 10. Real Base execution, funded-wallet verification, live SP1 proving, live zkVerify submission/finalization, and production deployment are intentionally left as `[~]`.

---

## Phase 0 — Project setup

- [x] 0.1 Repository/workspace structure (`apps`, `packages`, proofs, Lean)
- [x] 0.2 Fastify + TypeScript API skeleton with health/config support
- [x] 0.3 React + TypeScript + Vite application scaffold
- [x] 0.4 PostgreSQL schema/migrations, `pg` integration and local compose setup
- [x] 0.5 Lint/format/test/build checks (`pnpm check`, `pnpm check:all`)
- [x] 0.6 Environment/secrets handling and `.env.example`
- [~] 0.7 Real Base testnet RPC + funded wallet + live venue verification

**Exit:** offline project/build/test scaffolding is complete; live Base access remains an external verification step.

## Phase 1 — Schemas, canonical serialization and signatures

- [x] 1.1 Action Intent Zod schema
- [x] 1.2 Agent Mandate Zod schema
- [x] 1.3 State Snapshot Zod schema
- [x] 1.4 Evidence Bundle Zod schema and source classes
- [x] 1.5 Receipt schema
- [x] 1.6 Typed enums, integer units and bounded safety-critical fields
- [x] 1.7 Canonical serialization
- [x] 1.8 Domain-separated object commitments
- [x] 1.9 Real asymmetric receipt signing implementation
- [x] 1.10 Hash/signature/vector tests

**Exit: COMPLETE offline.**

## Phase 2 — Base venue adapter and evidence collection

- [x] 2.1 Venue adapter interface
- [x] 2.2 Base/Uniswap adapter implementation
- [x] 2.3 Transaction, receipt, logs and block artifact collection
- [x] 2.4 Typed evidence normalization
- [x] 2.5 Source/timestamp/integrity/evidence-tag validation
- [x] 2.6 Conflict detection and fail-closed behavior
- [x] 2.7 Base finality policy
- [x] 2.8 Canonical evidence root
- [x] 2.9 Recorded-fixture/replay tests
- [x] 2.10 Missing/stale/conflicting/local-only adversarial tests
- [~] Live Base collection/finality verification against an actual transaction

**Exit: offline implementation COMPLETE; live network verification remains.**

## Phase 3 — Receipt engine and lifecycle

- [x] 3.1 Receipt database model/migrations
- [x] 3.2 Typed lifecycle transition enforcement
- [x] 3.3 ORDER_PLACED and TRADE_EXECUTED claim support
- [x] 3.4 NON_PROVABLE reason codes
- [x] 3.5 Idempotent receipt processing/retry structure
- [x] 3.6 Restart-safe persistent receipt store path
- [~] 3.7 Live reorg invalidation monitor is not yet implemented; lifecycle can represent INVALIDATED
- [x] 3.8 Development mocks explicitly separated from PROVED
- [x] 3.9 Receipt signing
- [~] 3.10 Lifecycle/replay/restart tests exist; live reorg observation test remains
- [~] Live reorg monitoring against a deployed chain

**Exit: offline lifecycle implementation COMPLETE; live reorg operation remains.**

## Phase 4 — SMT policy gateway

- [x] 4.1 Spot-trade policy template
- [x] 4.2 Typed policy/state/intent → integer SMT-LIB compiler
- [x] 4.3 TypeScript Z3 integration
- [x] 4.4 Tracked assertions and rule IDs/unsat-core mapping
- [x] 4.5 Fail-closed unknown/missing/malformed/stale/contradictory/timeout behavior
- [x] 4.6 ALLOW/BLOCK decision output
- [x] 4.7 Persist/replay decision material: query and commitments
- [x] 4.8 Policy versioning and canonical policy hash
- [x] 4.9 Boundary/property tests
- [x] 4.10 Stale/expired/paused/malformed tests

**Exit: COMPLETE offline.**

## Phase 5 — Capability tokens, reservations and execution

- [x] 5.1 Intent/policy/account/expiry/idempotency-bound capability
- [x] 5.2 Capability issuance only after authorization
- [x] 5.3 Single execution path validates capability
- [x] 5.4 No unrestricted agent execution credential in the application path
- [x] 5.5 Postgres capability/reservation stores (`createPostgresCapabilityStore`, `createPostgresReservationStore`)
- [x] 5.6 Reservation release/commit semantics in the service layer
- [x] 5.7 Idempotency protection
- [x] 5.8 Restart safety: API uses the Postgres capability/reservation stores when `DATABASE_URL` is set
- [x] 5.9 Replay/alteration/expiry/scope/concurrency/crash-oriented tests
- [x] 5.10 Execution → evidence → receipt integration path
- [~] Production capability/reservation deployment using live Postgres + live execution

**Exit: offline security/control path COMPLETE; production deployment remains.**

## Phase 6 — API, UI and testnet demo

- [x] 6.1 Policy/intent/decision/receipt API surface
- [x] 6.2 Zod validation on API boundaries
- [x] 6.3 Receipt lifecycle/status representation
- [~] 6.4 Policy-view UI is still a development scaffold
- [~] 6.5 Intent ALLOW/BLOCK UI is not yet implemented
- [~] 6.6 Receipt/evidence/assumptions UI is not yet implemented
- [x] 6.7 Trading-agent demo path
- [~] 6.8 Real Base testnet end-to-end execution
- [x] 6.9 Decision/execution audit logging

**Exit: offline product path COMPLETE; real testnet execution remains.**

## Phase 7 — SP1 proof program

- [x] 7.1 Rust/SP1 project and toolchain configuration
- [x] 7.2 Guest input schema: intent, policy, state, evidence, reference time
- [x] 7.3 Guest policy hash/version check
- [x] 7.4 Guest intent hash/action-field check
- [x] 7.5 Guest state hash/freshness checks
- [x] 7.6 Guest policy evaluation with explicit ALLOW/BLOCK and rule IDs
- [x] 7.7 Evidence commitment/admissibility/finality-label checks
- [x] 7.8 Receipt-claim construction
- [x] 7.9 Commitment-only public inputs
- [x] 7.10 Prover host/local verification code
- [x] 7.11 TypeScript/Rust shared hash vectors
- [x] 7.12 Tampered-input/stale-input negative tests
- [~] Actual SP1 build/execute/prove/verify run on the target environment
- [~] Cryptographic verification of real Base evidence/finality inside the proof

**Exit: offline proof-program implementation COMPLETE; real proving/evidence verification remains.**

## Phase 8 — zkVerify and proof-bound receipts

- [x] 8.1 `zkverifyjs` integration boundary
- [x] 8.2 Verification-key versioning
- [x] 8.3 Proof submission interface
- [x] 8.4 Durable proof-job queue model
- [x] 8.5 Submission/verification/finalization state machine
- [x] 8.6 zkVerify statement → receipt binding
- [x] 8.7 Fail-closed PROVED gate
- [x] 8.8 Proof failure/timeout → NON_PROVABLE
- [x] 8.9 Proof-status/zkVerify-reference representation
- [x] 8.10 Altered-input/key/replay/invalid-proof negative tests
- [~] Real zkVerify submission and finalized `ProofVerified` observation
- [~] Real `TRADE_RECEIPT_V1` proof promotion from a live Base trade

**Exit: offline proof-bound receipt implementation COMPLETE; live remote verification remains.**

## Phase 9 — ZK proofs for rejected inputs

- [x] 9.1 Separate Decision Receipt object
- [x] 9.2 Decision Receipt PENDING/PROVED/NON_PROVABLE lifecycle
- [x] 9.3 Stable numeric policy rule IDs
- [x] 9.4 SP1 BLOCK-path proof logic
- [x] 9.5 Stale-input rejection with committed reference time
- [~] 9.6 Malformed-input raw-byte proving/parser parity is not fully implemented
- [x] 9.7 Public/private disclosure policy represented
- [x] 9.8 Hash-chained decision-log binding
- [~] 9.9 Proof-trigger architecture exists; authenticated caller/rate limiting is not implemented
- [~] 9.10 Aggregation fields exist in the queue model; batch proving is not implemented
- [x] 9.11 Phase 8 submission/verification pipeline integration boundary
- [x] 9.12 Optional no-capability-issued claim boundary documented without overclaiming no on-chain trade
- [~] 9.13 Decision Receipt backend/data surface exists; dedicated viewer UI is not implemented
- [x] 9.14 Negative tests: ALLOW/BLOCK, rule IDs, altered commitments, old key, replay, operational failure
- [~] Real SP1 BLOCK proof generation and live zkVerify finalization
- [~] Production batch proving/aggregation execution

**Exit: offline Phase 9 architecture, guards, schemas, queues and tests COMPLETE; live proving/remote verification remains.**

---

## Phase 10 — Lean assurance suite

Source: `packages/lean/Swaraj/Phase10.lean`, imported by `packages/lean/Swaraj.lean` so `lake build` (`pnpm check:lean`) kernel-checks every theorem. Warnings are errors, so `sorry` fails the build.

- [x] 10.1 Phase 10 module part of the default Lean target
- [x] 10.2 Typed policy DSL (`Rule`, `Policy`) with deterministic compilation (`compile`)
- [x] 10.3 Compiler soundness/completeness for the supported constraint subset (`compiler_sound`)
- [x] 10.4 Monotonic restriction: adding a rule cannot enlarge permissions (`rule_extension_monotone`)
- [x] 10.5 Receipt lifecycle: PENDING cannot become PROVED directly; PROVED requires VERIFIED
- [x] 10.6 Receipt binding: intent/policy/evidence-root/verifier changes invalidate a receipt
- [x] 10.7 Information flow: public receipt fields require an approved declassification
- [x] 10.8 Authorization-before-execution: execution is only constructible from an ALLOW
- [x] 10.9 Decision Receipt binding; BLOCK never issues a capability
- [x] 10.10 Release artifact marker (`phase10_release_artifact`)
- [~] Refinement link between these Lean models and the TypeScript SMT compiler, Rust guest and Postgres lifecycle triggers (models only; correspondence is covered by shared vectors and tests, not proofs)

**Exit: Lean model proofs COMPLETE; implementation-correspondence proofs remain.**

---

## Explicitly not claimed as complete

These require external execution/infrastructure and therefore remain intentionally open:

1. Funded/live Base wallet execution.
2. Live Base transaction evidence and reorg observation.
3. Target-environment SP1 proving/verification run.
4. Cryptographic Base proof/finality verification inside the SP1 guest.
5. Live zkVerify submission and finalized `ProofVerified` event.
6. Production `TRADE_RECEIPT_V1` proof promotion.
7. Production batch proving/aggregation execution.
8. Proofs that the TypeScript/Rust/Postgres implementations refine the Phase 10 Lean models.

This document is the authoritative Phase 0–10 offline completion checklist for this repository.
