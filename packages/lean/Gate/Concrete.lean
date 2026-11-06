import Gate.Mandate

/-! # Concrete matcher for the TS field language. `decideConcrete` is `decideMandate`, checked in `Refinement.lean`. -/

namespace Gate

/-- The concrete predicate language of `@swaraj/rules`, restricted to the
bounded refinement domain (amounts and numeric params fit `Nat`; the
generator emits decimal-string values from the bounded space). -/
inductive CPred : Type where
  | appEq (v : String)
  | nameEq (v : String)
  | nameIn (vs : List String)
  | paramLte (name : String) (v : Nat)
  | paramGt (name : String) (v : Nat)
  | paramStringEq (name : String) (v : String)
  | amountLte (v : Nat)
  | amountGt (v : Nat)
  | amountEq (v : Nat)
  | currencyEq (v : String)
  | recipientEq (v : String)
  deriving DecidableEq, Repr

structure CRule where
  ruleId : String
  effect : MandateEffect
  preds : List CPred
  deriving DecidableEq, Repr

/-- `kind = true` is APP_ACTION, `false` is PAYMENT. Out-of-scope fields never match, as in TS. -/
structure CAction where
  kind : Bool
  app : String
  name : String
  params : List (String × Nat)
  sparams : List (String × String)
  amount : Nat
  currency : String
  recipient : String
  deriving DecidableEq, Repr

def lookupNat : List (String × Nat) → String → Option Nat
  | [], _ => none
  | (k, v) :: rest, name => if k == name then some v else lookupNat rest name

def lookupStr : List (String × String) → String → Option String
  | [], _ => none
  | (k, v) :: rest, name => if k == name then some v else lookupStr rest name

/-- Concrete predicate evaluation — mirrors `predicateMatches` in
`@swaraj/rules`: absent params and cross-action fields never match. -/
def predMatches (p : CPred) (a : CAction) : Bool :=
  match p with
  | .appEq v => a.kind && (a.app == v)
  | .nameEq v => a.kind && (a.name == v)
  | .nameIn vs => a.kind && vs.any (fun v => v == a.name)
  | .paramLte n v => match lookupNat a.params n with | some x => x ≤ v | none => false
  | .paramGt n v => match lookupNat a.params n with | some x => v < x | none => false
  | .paramStringEq n v => match lookupStr a.sparams n with | some x => x == v | none => false
  | .amountLte v => !a.kind && (a.amount ≤ v)
  | .amountGt v => !a.kind && (v < a.amount)
  | .amountEq v => !a.kind && (a.amount == v)
  | .currencyEq v => !a.kind && (a.currency == v)
  | .recipientEq v => !a.kind && (a.recipient == v)

def ruleMatches (r : CRule) (a : CAction) : Bool :=
  r.preds.all (fun p => predMatches p a)

/-- The concrete decision: `decideMandate` with the concrete matcher —
every theorem of `Gate.Mandate` applies to this function. -/
def decideConcrete (rules : List CRule) (a : CAction) : Outcome :=
  decideMandate (rules.map fun r =>
    { ruleId := r.ruleId, effect := r.effect, isMatch := ruleMatches r a })

/-- Matching on the mapped abstract list is exactly concrete matching. -/
theorem hasMatchingEffect_map_iff (effect : MandateEffect) (rules : List CRule) (a : CAction) :
    hasMatchingEffect effect (rules.map fun r =>
      { ruleId := r.ruleId, effect := r.effect, isMatch := ruleMatches r a }) = true ↔
      ∃ r, r ∈ rules ∧ r.effect = effect ∧ ruleMatches r a = true := by
  induction rules with
  | nil =>
    constructor
    · intro h; simp [hasMatchingEffect] at h
    · intro ⟨r, hr, _, _⟩; exact absurd hr (by simp)
  | cons r rest ih =>
    constructor
    · intro h
      simp only [List.map_cons, hasMatchingEffect] at h
      split at h
      · rename_i hcond
        rw [Bool.and_eq_true] at hcond
        obtain ⟨he, hm⟩ := hcond
        exact ⟨r, List.mem_cons_self, by simpa using he, by simpa using hm⟩
      · obtain ⟨r', hr', he, hm⟩ := ih.1 h
        exact ⟨r', List.mem_cons_of_mem _ hr', he, hm⟩
    · intro ⟨r', hr', he, hm⟩
      simp only [List.map_cons, hasMatchingEffect]
      cases hr' with
      | head =>
        simp [he, hm]
      | tail _ hmem =>
        have := ih.2 ⟨r', hmem, he, hm⟩
        split
        · exact rfl
        · exact this

/-- THE concrete characterization, inherited from `allow_iff_permit_without_forbid`:
the concrete decision function allows exactly when a concrete permit matches
and no concrete forbid matches — for every rule list and action. -/
theorem concrete_allow_iff (rules : List CRule) (a : CAction) :
    decideConcrete rules a = Outcome.allow ↔
      (∃ r, r ∈ rules ∧ r.effect = MandateEffect.permit ∧ ruleMatches r a = true) ∧
      (∀ r ∈ rules, r.effect = MandateEffect.forbid → ruleMatches r a = false) := by
  unfold decideConcrete
  rw [allow_iff_permit_without_forbid]
  constructor
  · intro ⟨hnf, hpf⟩
    refine ⟨(hasMatchingEffect_map_iff MandateEffect.permit rules a).1 hpf, ?_⟩
    intro r hr hforbid
    cases hmatch : ruleMatches r a with
    | true =>
      have htrue := (hasMatchingEffect_map_iff MandateEffect.forbid rules a).2 ⟨r, hr, hforbid, hmatch⟩
      simp only [hasMatchingForbid] at hnf
      rw [htrue] at hnf
      exact Bool.noConfusion hnf
    | false => rfl
  · intro ⟨hpermit, hnoforbid⟩
    have hnf : hasMatchingEffect MandateEffect.forbid (rules.map fun r =>
        { ruleId := r.ruleId, effect := r.effect, isMatch := ruleMatches r a }) = false := by
      cases hh : hasMatchingEffect MandateEffect.forbid (rules.map fun r =>
          { ruleId := r.ruleId, effect := r.effect, isMatch := ruleMatches r a }) with
      | false => simp only [hasMatchingForbid, hh]
      | true =>
        obtain ⟨r, hr, he, hm⟩ := (hasMatchingEffect_map_iff MandateEffect.forbid rules a).1 hh
        have hfalse := hnoforbid r hr he
        rw [hm] at hfalse
        exact Bool.noConfusion hfalse
    exact ⟨hnf, (hasMatchingEffect_map_iff MandateEffect.permit rules a).2 hpermit⟩

end Gate
