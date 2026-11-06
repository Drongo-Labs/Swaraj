import Gate.Bridge

/-! # Running-total bound: holds when the pipeline threads `used`, not when the agent supplies it. -/

namespace Gate

/-- `allowStep` executed its amount; `blockStep` abstained and spent nothing. -/
inductive SpendRun : Type where
  | stop
  | allowStep (amount : Int) (rest : SpendRun)
  | blockStep (amount : Int) (rest : SpendRun)
  deriving Repr

/-- Total value actually executed by the run. Blocked proposals add
nothing — abstaining is the only effect of a BLOCK on the total. -/
def SpendRun.total : SpendRun → Int
  | stop => 0
  | allowStep amount rest => amount + rest.total
  | blockStep _ rest => rest.total

/-- Budget rule: each step needs `used + amount ≤ cap`, and `used ≤ cap` must hold at the end. -/
def SpendRun.budgetClean (cap used : Int) : SpendRun → Bool
  | stop => used ≤ cap
  | allowStep amount rest => (used + amount ≤ cap) && rest.budgetClean cap (used + amount)
  | blockStep _ rest => rest.budgetClean cap used

/-- **The spending bound.** If every ALLOW keeps `used + amount ≤ cap`, total executed stays within budget. -/
theorem spend_total_bound (cap used : Int) (run : SpendRun)
    (h : run.budgetClean cap used = true) : used + run.total ≤ cap := by
  induction run generalizing used with
  | stop =>
      simp only [SpendRun.budgetClean, decide_eq_true_eq] at h
      simp only [SpendRun.total]
      omega
  | allowStep amount rest ih =>
      simp only [SpendRun.budgetClean, Bool.and_eq_true, decide_eq_true_eq] at h
      obtain ⟨hstep, hrest⟩ := h
      have hbound := ih (used + amount) hrest
      simp only [SpendRun.total]
      omega
  | blockStep _ rest ih =>
      have hbound := ih used h
      simp only [SpendRun.total]
      exact hbound

/-- A run the gate blocked at every step. -/
def SpendRun.allBlocked : SpendRun → Bool
  | stop => true
  | allowStep _ _ => false
  | blockStep _ rest => rest.allBlocked

/-- Nothing is ever spent on a run the gate blocks at every step. -/
theorem all_blocked_spends_nothing (run : SpendRun)
    (h : run.allBlocked = true) : run.total = 0 := by
  induction run with
  | stop => rfl
  | allowStep amount rest _ => simp [SpendRun.allBlocked] at h
  | blockStep _ rest ih => exact ih (by simpa [SpendRun.allBlocked] using h)

/-- The event trace of a spend run, in the vocabulary of the bridge:
ALLOW executes, BLOCK abstains. -/
def SpendRun.events : SpendRun → List Ev
  | stop => []
  | allowStep _ rest => [Ev.gate Gate.allow, Ev.exec] ++ rest.events
  | blockStep _ rest => [Ev.gate Gate.block, Ev.abstain] ++ rest.events

/-- The bridge's `exec_needs_allow`, restated over spend runs: an all-block
run never emits a single execution event. -/
theorem all_blocked_never_spends (run : SpendRun)
    (h : run.allBlocked = true) : Ev.exec ∉ run.events := by
  induction run with
  | stop => intro hex; simp [SpendRun.events] at hex
  | allowStep amount rest _ => simp [SpendRun.allBlocked] at h
  | blockStep _ rest ih =>
      intro hex
      simp only [SpendRun.events] at hex
      rcases List.mem_append.mp hex with hex | hex
      · simp at hex
      · exact ih (by simpa [SpendRun.allBlocked] using h) hex

-- Concrete reductions the kernel checks directly.

example : (SpendRun.allowStep 450 (SpendRun.blockStep 500 SpendRun.stop)).total = 450 := by
  rfl

/-- Two 450 spends against a 500 budget: the second step must fail the
budget rule at the moment it is decided (450 + 450 > 500). -/
example :
    (SpendRun.allowStep 450 (SpendRun.allowStep 450 SpendRun.stop)).budgetClean 500 0 = false := by
  rfl

/-- The same two proposals where the gate refuses the second: the run is
budget-clean and the bound theorem applies — total stays at 450 ≤ 500. -/
example :
    (SpendRun.allowStep 450 (SpendRun.blockStep 450 SpendRun.stop)).budgetClean 500 0 = true ∧
    0 + (SpendRun.allowStep 450 (SpendRun.blockStep 450 SpendRun.stop)).total ≤ 500 := by
  refine ⟨by rfl, ?_⟩
  exact spend_total_bound 500 0 _ (by rfl)

end Gate
