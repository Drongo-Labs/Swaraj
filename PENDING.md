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
- [ ] **Bounded-exhaustive mandate harness** (swaraj-new `packages/rules`) —
      the mandate decision space is finite and small (≤512 rules × ≤32
      predicates × bounded values); exhaustive property tests give
      "checked over the full bounded input space".
- [ ] **Live-mode agent on-chain** — code path done; needs a funded Base
      Sepolia bot wallet, then `ZUNNO_E2E_LIVE=1 pnpm e2e` broadcasts real
      joinGame/playCard/drawCard txs.
- [ ] **Z3 dual-engine cross-check** — mandate decisions evaluated by both
      the predicate engine and Z3, fail closed on disagreement.
- [ ] **zk proofs of move legality** — SP1 statement kind for game legality,
      batch-proven per match (core pipeline work in swaraj-new).
- [ ] **Lean ⇔ TS refinement proof** — today agreement is kernel-checked via
      shared vectors only; a machine-checked refinement remains future work
      (documented as the honest gap in both READMEs).

## Housekeeping

- [ ] Decide on the in-game strike counter (product choice, not architecture).
- [ ] Deliberately skipped: CI pipeline, multi-agent tables (AI Swarms track).
- Running services: Zunno×Swaraj `:3002`, Zunno×Inco `:3001` + `:4000` —
      stop or keep as needed.
