# Pending items (excluding NEAR-track work)

The NEAR hackathon plan lives in swaraj-new's local `docs/`
(`ZUNNO_NEAR_ARCHITECTURE.md`, gitignored). Everything else outstanding:

## Done

- [x] **swaraj-new remote history** — rewritten `main` on the remote; zero
      planning docs in remote history (verified by fetch + history grep).
- [x] **Push the repos** — swaraj-zunno is public at
      https://github.com/ayush4345/swaraj-zunno (Lean build output cleaned
      from tracking before the push); swaraj-new is at
      https://github.com/Drongo-Labs/Swaraj with the clean history.

## Engineering

- [x] ~~zunno-inco resume-scan bug~~ — fixed: 200-block `eth_getLogs` chunks
      (the public Base Sepolia RPC's actual cap), bounded lookback
      (`BOT_RESUME_LOOKBACK_BLOCKS`, default 100k ≈ 2 days), per-chunk error
      tolerance. Verified live: restart completed with zero range errors.
- [x] ~~Bounded-exhaustive mandate harness~~ — done (swaraj-new
      `packages/rules/test/exhaustive.test.mjs`, 4269be5): 24,990 cases over
      the full bounded space, TS combinatorics asserted against the
      Lean-proven characterization plus independent property checks.
- [ ] **Live-mode agent on-chain** — code path done; needs a funded Base
      Sepolia bot wallet, then `ZUNNO_E2E_LIVE=1 pnpm e2e` broadcasts real
      joinGame/playCard/drawCard txs.
- [x] ~~Z3 dual-engine cross-check~~ — done (swaraj-new ee68da6): mandate
      decisions compile to the SMT term AST and Z3 confirms them; harness
      agrees on 7,973 bounded cases; production route fail-closes
      disagreements (SWARAJ_Z3_CROSSCHECK=1 → BLOCK/ENGINE_DISAGREEMENT).
- [x] ~~zk proofs of game decisions~~ — done as the reused pipeline
      (swaraj-new ee68da6): every mandate ALLOW is a durable decision
      (decision log + PENDING receipt + proof job); the worker re-derives it
      with the rules engine, builds swaraj/statement/mandate/v1, and
      promotes the receipt PROVED. Verified end-to-end on Postgres
      (stmt_3ef75a34…). SP1 zk proving of this statement kind is the
      remaining upgrade (guest is gate-scoped).
- [x] ~~Lean ⇔ TS refinement~~ — done as a machine-checked BOUNDED
      refinement: swaraj-new `Gate/Concrete.lean` (concrete predicate model;
      `concrete_allow_iff` inherits the abstract characterization theorem) +
      `Gate/Refinement.lean` (7,973 kernel-checked cases vs the real TS
      engine) and this repo's `lean/Zunno/EngineRefinement.lean` (2,048
      states / 5,888 kernel-checked outcomes vs the real TS engine).
      Residual gap: correspondence outside the bounded domains (the
      characterizations themselves hold for all inputs, abstractly).

## Housekeeping

- [ ] Decide on the in-game strike counter (product choice, not architecture).
- [ ] Deliberately skipped: CI pipeline, multi-agent tables (AI Swarms track).
- Running services: Zunno×Swaraj `:3002`, Zunno×Inco `:3001` + `:4000` —
      stop or keep as needed.
