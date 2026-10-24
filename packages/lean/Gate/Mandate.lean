import Gate.Decide

/-!
# Agent Mandate precedence

This is the framework-level model mirrored by `@swaraj/rules`:

1. a matching FORBID blocks;
2. otherwise a matching PERMIT allows;
3. otherwise the result is BLOCK (default deny).

The matching predicate is abstract here because the precedence theorems do
not depend on a particular action domain or field language.
-/

namespace Gate

inductive MandateEffect : Type where
  | permit
  | forbid
  deriving Repr, DecidableEq

structure MandateRule where
  ruleId : String
  effect : MandateEffect
  isMatch : Bool
  deriving Repr

def hasMatchingEffect (effect : MandateEffect) : List MandateRule → Bool
  | [] => false
  | rule :: rest =>
      if rule.effect == effect && rule.isMatch then true
      else hasMatchingEffect effect rest

def hasMatchingPermit (rules : List MandateRule) : Bool :=
  hasMatchingEffect MandateEffect.permit rules

def hasMatchingForbid (rules : List MandateRule) : Bool :=
  hasMatchingEffect MandateEffect.forbid rules

def decideMandate (rules : List MandateRule) : Outcome :=
  if hasMatchingForbid rules then Outcome.block
  else if hasMatchingPermit rules then Outcome.allow
  else Outcome.block

/-- No matching permit can ever produce ALLOW, regardless of forbids. -/
theorem default_deny_sound (rules : List MandateRule)
    (hpermit : hasMatchingPermit rules = false) :
    decideMandate rules = Outcome.block := by
  simp [decideMandate, hpermit]

/-- A matching forbid dominates every permit in the mandate. -/
theorem forbid_always_wins (rules : List MandateRule)
    (hforbid : hasMatchingForbid rules = true) :
    decideMandate rules = Outcome.block := by
  simp [decideMandate, hforbid]

/-- ALLOW is possible exactly when a permit matches and no forbid matches. -/
theorem allow_iff_permit_without_forbid (rules : List MandateRule) :
    decideMandate rules = Outcome.allow ↔
      hasMatchingForbid rules = false ∧ hasMatchingPermit rules = true := by
  unfold decideMandate
  cases hforbid : hasMatchingForbid rules <;>
    cases hpermit : hasMatchingPermit rules <;>
    simp [hforbid, hpermit]

def examplePermit : MandateRule :=
  { ruleId := "permit_payment", effect := MandateEffect.permit, isMatch := true }

def exampleForbid : MandateRule :=
  { ruleId := "forbid_large_payment", effect := MandateEffect.forbid, isMatch := true }

example : decideMandate [] = Outcome.block := by
  rfl

example : decideMandate [examplePermit] = Outcome.allow := by
  rfl

example : decideMandate [examplePermit, exampleForbid] = Outcome.block := by
  rfl

end Gate
