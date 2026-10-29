# Vendored Swaraj core

`schemas/` and `rules/` are copied verbatim from swaraj-new
(`packages/schemas/src/{primitives,unifiedAction,agentMandate}.ts` and
`packages/rules/src/index.ts`) at commit `05e4012` (feature/app-action, merged
to main). They are the canonical Agent Mandate evaluation: default deny,
forbid-wins, fail-closed.

Vendoring keeps this repo fully standalone — `pnpm play` needs no other
checkout. Re-sync from swaraj-new when the mandate semantics change.
