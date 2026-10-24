import Gate.Basic

/-!
# Decisions and kernel-checked framework properties

The formal model is deliberately fail-closed: a rule counts as
violated unless its assertion definitively evaluates to `some true`
under the binding. The TypeScript and Rust implementations surface an
evaluation error for missing fields instead; on the complete bindings
used by the shared vectors the two models coincide, and the theorems
here fix the semantics every implementation must respect.
-/

namespace Gate

inductive Outcome : Type where
  | allow | block
  deriving Repr, DecidableEq

/-- A rule is violated unless its assertion is definitively true. -/
def oracleOf (binding : Binding) (rule : NamedAssertion) : Bool :=
  match evalBool rule.assertion binding with
  | some true => false
  | _ => true

/-- Rule ids of violated rules, in policy order. -/
def violatedOf (oracle : NamedAssertion → Bool) : List NamedAssertion → List String
  | [] => []
  | rule :: rest =>
      if oracle rule then rule.ruleId :: violatedOf oracle rest
      else violatedOf oracle rest

def outcomeOf : List String → Outcome
  | [] => Outcome.allow
  | _ :: _ => Outcome.block

def decide (policy : PolicyDoc) (binding : Binding) : Outcome × List String :=
  let violated := violatedOf (oracleOf binding) policy.rules
  (outcomeOf violated, violated)

def extend (policy : PolicyDoc) (extra : NamedAssertion) : PolicyDoc :=
  { policy with rules := policy.rules ++ [extra] }

/-! ## Evaluation facts -/

theorem evalAll_nil (binding : Binding) : evalAll [] binding = some true := rfl

theorem evalAny_nil (binding : Binding) : evalAny [] binding = some false := rfl

theorem evalBool_neg (term : BoolTerm) (binding : Binding) (value : Bool)
    (h : evalBool term binding = some value) :
    evalBool (.neg term) binding = some (!value) := by
  simp [evalBool, h]

theorem evalBool_implies_true_ante (ante conse : BoolTerm) (binding : Binding) (value : Bool)
    (ha : evalBool ante binding = some true)
    (hc : evalBool conse binding = some value) :
    evalBool (.implies ante conse) binding = some value := by
  simp [evalBool, ha, hc]

theorem oracleOf_true_iff (binding : Binding) (rule : NamedAssertion) :
    oracleOf binding rule = true ↔ evalBool rule.assertion binding ≠ some true := by
  unfold oracleOf
  cases h : evalBool rule.assertion binding with
  | none => simp [h]
  | some value =>
      cases value with
      | false => simp [h]
      | true => simp [h]

/-! ## Unfolding lemmas for the violated list -/

theorem violatedOf_cons_true {oracle : NamedAssertion → Bool} {rule : NamedAssertion}
    {rest : List NamedAssertion} (h : oracle rule = true) :
    violatedOf oracle (rule :: rest) = rule.ruleId :: violatedOf oracle rest := by
  simp [violatedOf, h]

theorem violatedOf_cons_false {oracle : NamedAssertion → Bool} {rule : NamedAssertion}
    {rest : List NamedAssertion} (h : oracle rule = false) :
    violatedOf oracle (rule :: rest) = violatedOf oracle rest := by
  simp [violatedOf, h]

/-! ## Attribution: the violated list is exactly the false rules -/

theorem violatedOf_iff (oracle : NamedAssertion → Bool) (rules : List NamedAssertion)
    (x : String) :
    x ∈ violatedOf oracle rules ↔ ∃ r ∈ rules, oracle r = true ∧ r.ruleId = x := by
  induction rules with
  | nil => simp [violatedOf]
  | cons rule rest ih =>
      cases hb : oracle rule with
      | true =>
          constructor
          · intro hx
            rw [violatedOf_cons_true hb] at hx
            rcases List.mem_cons.mp hx with hx | hx
            · exact ⟨rule, List.mem_cons_self, hb, hx.symm⟩
            · obtain ⟨r, hr, ho, hrid⟩ := ih.mp hx
              exact ⟨r, List.mem_cons_of_mem _ hr, ho, hrid⟩
          · intro ⟨r, hr, ho, hrid⟩
            rcases List.mem_cons.mp hr with rfl | hr
            · rw [violatedOf_cons_true hb, hrid]
              exact List.mem_cons_self
            · rw [violatedOf_cons_true hb]
              exact List.mem_cons_of_mem _ (ih.mpr ⟨r, hr, ho, hrid⟩)
      | false =>
          constructor
          · intro hx
            rw [violatedOf_cons_false hb] at hx
            obtain ⟨r, hr, ho, hrid⟩ := ih.mp hx
            exact ⟨r, List.mem_cons_of_mem _ hr, ho, hrid⟩
          · intro ⟨r, hr, ho, hrid⟩
            rcases List.mem_cons.mp hr with rfl | hr
            · rw [hb] at ho
              exact Bool.noConfusion ho
            · rw [violatedOf_cons_false hb]
              exact ih.mpr ⟨r, hr, ho, hrid⟩

/-! ## ALLOW is exactly "no violated rules" -/

theorem decide_fst (policy : PolicyDoc) (binding : Binding) :
    (decide policy binding).1 =
      outcomeOf (violatedOf (oracleOf binding) policy.rules) := rfl

theorem decide_snd (policy : PolicyDoc) (binding : Binding) :
    (decide policy binding).2 = violatedOf (oracleOf binding) policy.rules := rfl

theorem outcomeOf_allow_iff (violated : List String) :
    outcomeOf violated = Outcome.allow ↔ violated = [] := by
  cases violated with
  | nil => simp [outcomeOf]
  | cons head tail => simp [outcomeOf]

theorem decide_allow_iff (policy : PolicyDoc) (binding : Binding) :
    (decide policy binding).1 = Outcome.allow ↔ (decide policy binding).2 = [] := by
  rw [decide_fst, decide_snd, outcomeOf_allow_iff]

/-! ## Monotonicity: restricting a policy never grants more -/

theorem violatedOf_append (oracle : NamedAssertion → Bool) (extra : NamedAssertion) :
    ∀ (rules : List NamedAssertion) (x : String),
      x ∈ violatedOf oracle rules → x ∈ violatedOf oracle (rules ++ [extra]) := by
  intro rules
  induction rules with
  | nil => intro x hx; simp [violatedOf] at hx
  | cons rule rest ih =>
      intro x hx
      simp only [List.cons_append]
      cases hb : oracle rule with
      | true =>
          rw [violatedOf_cons_true hb] at hx ⊢
          rcases List.mem_cons.mp hx with rfl | hx
          · exact List.mem_cons_self
          · exact List.mem_cons_of_mem _ (ih x hx)
      | false =>
          rw [violatedOf_cons_false hb] at hx ⊢
          exact ih x hx

theorem block_persists (policy : PolicyDoc) (extra : NamedAssertion) (binding : Binding)
    (h : (decide policy binding).1 = Outcome.block) :
    (decide (extend policy extra) binding).1 = Outcome.block := by
  apply Classical.byContradiction
  intro hallow
  have hallowExt : (decide (extend policy extra) binding).1 = Outcome.allow := by
    cases hout : (decide (extend policy extra) binding).1 with
    | allow => rfl
    | block => exact absurd hout hallow
  have hemptyExt : (decide (extend policy extra) binding).2 = [] :=
    (decide_allow_iff _ _).mp hallowExt
  rw [decide_snd] at hemptyExt
  have hnonempty : violatedOf (oracleOf binding) policy.rules ≠ [] := by
    intro hnil
    have hallowPolicy : (decide policy binding).1 = Outcome.allow :=
      (decide_allow_iff policy binding).mpr hnil
    rw [h] at hallowPolicy
    exact absurd hallowPolicy (by decide)
  obtain ⟨x, hx⟩ := List.exists_mem_of_ne_nil (violatedOf (oracleOf binding) policy.rules) hnonempty
  have hmem : x ∈ violatedOf (oracleOf binding) (extend policy extra).rules :=
    violatedOf_append (oracleOf binding) extra policy.rules x hx
  rw [hemptyExt] at hmem
  exact absurd hmem (by simp [List.not_mem_nil])

/-! ## Soundness: an ALLOW means every rule evaluated true -/

theorem allow_all_rules_true (policy : PolicyDoc) (binding : Binding)
    (h : (decide policy binding).1 = Outcome.allow) :
    ∀ r ∈ policy.rules, evalBool r.assertion binding = some true := by
  intro r hr
  have hempty : (decide policy binding).2 = [] := (decide_allow_iff policy binding).mp h
  rw [decide_snd] at hempty
  apply Classical.byContradiction
  intro hne
  have horacle : oracleOf binding r = true := (oracleOf_true_iff binding r).mpr hne
  have hmem : r.ruleId ∈ violatedOf (oracleOf binding) policy.rules :=
    (violatedOf_iff (oracleOf binding) policy.rules r.ruleId).mpr ⟨r, hr, horacle, rfl⟩
  rw [hempty] at hmem
  exact absurd hmem (by simp [List.not_mem_nil])

end Gate
