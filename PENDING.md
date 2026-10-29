# Pending items (excluding NEAR-track work)

The NEAR hackathon plan lives in swaraj-new's local `docs/`
(`ZUNNO_NEAR_ARCHITECTURE.md`, gitignored). Everything else outstanding:

## Decisions pending

- [ ] **swaraj-new remote history** — `origin/main` still points at the
      pre-rewrite commits that accidentally included the planning docs.
      Local `main` is clean (docs removed + gitignored). Purging them from
      the remote needs a force-push to a protected branch:
      `git push --force-with-lease origin main` — awaiting explicit approval.
- [ ] **Push the repos** — none of this session's work is on a remote:
      swaraj-new `main` (rewritten, unpushed) and swaraj-zunno (no remote at
      all). The hackathon judges need a public repo.

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
