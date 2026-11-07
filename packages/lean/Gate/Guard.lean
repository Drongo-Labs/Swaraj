import Gate.Bridge
import Gate.Mandate
import Gate.Concrete
import Gate.Budget

/-! # Build-enforced purity: `#guard_msgs` pins each theorem's axioms, and `check-purity.mjs` rejects escapes. -/

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
