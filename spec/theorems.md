# Machine-checked theorems

The proofs live in `packages/lean/Gate` and build with `pnpm check:lean`. The
build rejects `sorry`, added axioms and other proof escapes.

## Mandate decisions (`Mandate.lean`)

| Theorem | Statement |
|---|---|
| `default_deny_sound` | With no matching permit, the outcome is BLOCK |
| `forbid_always_wins` | A matching forbid blocks, whatever permits match |
| `allow_iff_permit_without_forbid` | ALLOW exactly when a permit matches and no forbid does |

## Human approval (`Approval.lean`)

| Theorem | Statement |
|---|---|
| `forbid_beats_approval` | A matching forbid blocks, so no person can approve it |
| `approval_rule_stops_allow` | A matching approval rule always stops automatic ALLOW |
| `allow_implies_mandate_allow` | Approval rules never allow what the mandate would not |
| `no_approval_keeps_decision` | With no approval rule matching, an allowed action stays allowed |

These cover the decision. The approval flow around it, including who may approve,
is tested in `apps/api/test/approval.test.mjs` and is not proved.

## Concrete model (`Concrete.lean`)

| Theorem | Statement |
|---|---|
| `concrete_allow_iff` | The same characterization over concrete rules and actions |
| `hasMatchingEffect_map_iff` | Mapping concrete rules to abstract rules preserves matching |

## Execution and spending (`Bridge.lean`, `Budget.lean`)

| Theorem | Statement |
|---|---|
| `exec_needs_allow` | Any execution in a trace is preceded by an ALLOW |
| `all_blocked_never_executes` | A run blocked at every step executes nothing |
| `blocked_stake_abstains` | A blocked stake abstains |
| `spend_total_bound` | If accounting holds at each step, total spend stays within the cap |
| `all_blocked_spends_nothing` | A fully blocked run spends nothing |
| `all_blocked_never_spends` | A fully blocked run has no spend event |

## Link to the code

The theorems are about the Lean model. Three checks tie that model to the
TypeScript engine, none of which is a proof about the TypeScript itself:

- `Refinement.lean` machine-checks shared vectors against the concrete model.
- `packages/rules/test/exhaustive.test.mjs` covers a bounded input space.
- `packages/rules/test/random.test.mjs` checks random mandates against the
  characterization, and the seed replays a failure.

Checks outside the rule engine, such as agent signatures, run before it and are
not covered by these theorems.
