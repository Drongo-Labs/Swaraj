# Vendored Swaraj core

`schemas/`, `rules/`, and `agent/` are copied verbatim from swaraj-new
(`packages/schemas/src/{primitives,unifiedAction,agentMandate}.ts`,
`packages/rules/src/index.ts`, and `packages/agent/src/{index,agent}.ts` —
the GovernedAgent core) from `main`. They are the canonical Agent Mandate
evaluation (default deny, forbid-wins, fail-closed) and the governed-turn
bridge whose security property `Gate.exec_needs_allow` kernel-checks in
swaraj-new's Lean suite (`packages/lean/Gate/Bridge.lean`).

Vendoring keeps this repo fully standalone — `pnpm play` needs no other
checkout. Re-sync from swaraj-new when the mandate semantics change.
