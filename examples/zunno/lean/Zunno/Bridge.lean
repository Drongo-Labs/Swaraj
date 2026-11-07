/-
VENDORED from swaraj-new `packages/lean/Gate/Bridge.lean` — the governed-turn
bridge model and its security theorems are framework core (@swaraj/agent /
Gate.exec_needs_allow), not application code. Re-sync from swaraj-new when
core changes.
-/
/-!
# The governed-turn bridge — no execution without ALLOW

This is the framework-level model mirrored by `@swaraj/agent`
(GovernedAgent) and every application bridge built on it:

- `moveRun`   — RETRY policy: each BLOCK falls back to the next gated
  attempt; a run that never sees ALLOW forfeits the turn.
- `stakeStep` — ABSTAIN policy: a blocked action abstains. Never
  retried, never executed.

The theorems are the security property of every Swaraj-governed agent,
kernel-checked: nothing executes without an ALLOW.
-/
namespace Gate

inductive Gate : Type where
  | allow
  | block
  deriving DecidableEq, Repr

inductive Ev : Type where
  | gate (d : Gate)
  | exec
  | fallback
  | abstain
  | forfeit
  deriving DecidableEq, Repr

/-- Game-move turns: gate decisions in order. ALLOW executes; each BLOCK
falls back to the next gated attempt; no ALLOW at all forfeits the turn. -/
def moveRun : List Gate → List Ev
  | [] => [Ev.forfeit]
  | Gate.allow :: _ => [Ev.gate Gate.allow, Ev.exec]
  | Gate.block :: rest => Ev.gate Gate.block :: Ev.fallback :: moveRun rest

/-- Money actions: a blocked stake abstains — no retry, no execution. -/
def stakeStep : Gate → List Ev
  | Gate.allow => [Ev.gate Gate.allow, Ev.exec]
  | Gate.block => [Ev.gate Gate.block, Ev.abstain]

/-- **No execution without ALLOW**: if the trace contains an execution, the
decision list is zero or more BLOCKs followed by an ALLOW — on every path,
including all fallback retries. -/
theorem exec_needs_allow : ∀ ds : List Gate, Ev.exec ∈ moveRun ds →
    ∃ pre rest, ds = pre ++ Gate.allow :: rest := by
  intro ds
  induction ds with
  | nil => intro h; simp [moveRun] at h
  | cons d rest ih =>
    cases d with
    | allow => intro _; exact ⟨[], rest, rfl⟩
    | block =>
      intro h
      simp only [moveRun, List.mem_cons] at h
      rcases h with heq | heq | hrest
      · exact absurd heq (by simp)
      · exact absurd heq (by simp)
      · obtain ⟨pre, r, hr⟩ := ih hrest
        exact ⟨Gate.block :: pre, r, by simp [hr]⟩

/-- A run the gateway blocks at every step never executes anything. -/
theorem all_blocked_never_executes (ds : List Gate) (h : ∀ d ∈ ds, d = Gate.block) :
    Ev.exec ∉ moveRun ds := by
  intro hexec
  obtain ⟨pre, rest, hds⟩ := exec_needs_allow ds hexec
  exact absurd (h Gate.allow (by rw [hds]; simp)) (by simp)

/-- A blocked stake abstains and executes nothing. -/
theorem blocked_stake_abstains :
    stakeStep Gate.block = [Ev.gate Gate.block, Ev.abstain] ∧ Ev.exec ∉ stakeStep Gate.block := by
  refine ⟨rfl, ?_⟩
  simp [stakeStep]

end Gate
