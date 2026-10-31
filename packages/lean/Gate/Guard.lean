import Gate.Bridge
import Gate.Mandate
import Gate.Concrete
import Gate.Budget

/-!
# Purity guard

The security theorems of the suite are kernel-checked, and this file makes
that claim enforced by the build rather than by review:

- each `#guard_msgs` block below pins the exact output of the kernel's
  dependency query for a security theorem. The pinned axioms are Lean's
  standard logical foundation — `propext` (propositional extensionality)
  and `Quot.sound` (quotient elimination), trusted in every Lean
  development. If a theorem ever picks up ANY other dependency (a planted
  escape shows up here as `sorryAx`), the pinned message no longer matches
  and the build FAILS;
- `scripts/check-purity.mjs` (run by `check:lean`) additionally rejects
  any source under `Gate/` that contains a proof escape token, planted or
  accidental, after comments are stripped.

Together: no entry into the suite can weaken the guarantees silently.
-/

/--
info: 'Gate.exec_needs_allow' depends on axioms: [propext]
-/
#guard_msgs in
#print axioms Gate.exec_needs_allow

/--
info: 'Gate.default_deny_sound' depends on axioms: [propext]
-/
#guard_msgs in
#print axioms Gate.default_deny_sound

/--
info: 'Gate.forbid_always_wins' depends on axioms: [propext]
-/
#guard_msgs in
#print axioms Gate.forbid_always_wins

/--
info: 'Gate.allow_iff_permit_without_forbid' depends on axioms: [propext]
-/
#guard_msgs in
#print axioms Gate.allow_iff_permit_without_forbid

/--
info: 'Gate.concrete_allow_iff' depends on axioms: [propext]
-/
#guard_msgs in
#print axioms Gate.concrete_allow_iff

/--
info: 'Gate.spend_total_bound' depends on axioms: [propext, Quot.sound]
-/
#guard_msgs in
#print axioms Gate.spend_total_bound
