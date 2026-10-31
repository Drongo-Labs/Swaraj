import Gate.Bridge

/-!
# Budgeted spending — the running-total bound

Everything else in this suite proves per-decision soundness: ONE action is
allowed only if it fits the mandate. Nothing yet constrained a SEQUENCE of
spends. This file proves the sequence-level invariant of a governed spend
run:

  if the pipeline itself maintains the running used-total — each ALLOW
  re-checked as `used + amount ≤ cap` against the gate's own accounting —
  then the sum of everything executed stays within the cap.

The hypothesis is the contract, and it is worth stating precisely: the
bound holds when the used-total is threaded by the governed pipeline, not
when it is an input supplied back by the agent. An agent-fed `used` value
is a request, not an invariant; this file names the difference and proves
what the gate-threaded version buys.
-/

namespace Gate

/--
A governed spend run. `allowStep` is an ALLOW that executed its amount;
`blockStep` is a BLOCK that abstained (the amount was proposed, nothing
was spent).
-/
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

/-- The budget rule of the mandate, evaluated against the gate-threaded
running total: every step must satisfy `used + amount ≤ cap` at the
moment it is decided, and the invariant `used ≤ cap` must hold whenever
the run stops. -/
def SpendRun.budgetClean (cap used : Int) : SpendRun → Bool
  | stop => used ≤ cap
  | allowStep amount rest => (used + amount ≤ cap) && rest.budgetClean cap (used + amount)
  | blockStep _ rest => rest.budgetClean cap used

/-- **The spending bound.** If the gate-threaded accounting keeps every
ALLOW within `used + amount ≤ cap`, then the total executed value never
exceeds the budget — no matter how many steps the agent proposes. This is
the occasion-total theorem: per-purchase caps are one rule; this bounds
the sum over the whole run. -/
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
