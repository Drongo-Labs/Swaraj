import Gate.Mandate

/-!
# Human approval

`REQUIRE_APPROVAL` adds a third outcome between FORBID and PERMIT:

1. a matching FORBID blocks;
2. otherwise a matching approval rule pauses the action for a person;
3. otherwise the mandate decides as usual.

Approval rules can only hold an action back, so adding one never allows
anything the mandate would not.
-/

namespace Gate

inductive Verdict : Type where
  | allow
  | needsApproval
  | block
  deriving Repr, DecidableEq

def decideWithApproval (rules : List MandateRule) (approvalMatches : Bool) : Verdict :=
  if hasMatchingForbid rules then Verdict.block
  else if approvalMatches then Verdict.needsApproval
  else match decideMandate rules with
    | Outcome.allow => Verdict.allow
    | Outcome.block => Verdict.block

/-- A matching forbid wins over a matching approval rule: no person can approve it. -/
theorem forbid_beats_approval (rules : List MandateRule) (approvalMatches : Bool)
    (hforbid : hasMatchingForbid rules = true) :
    decideWithApproval rules approvalMatches = Verdict.block := by
  simp [decideWithApproval, hforbid]

/-- A matching approval rule always stops automatic ALLOW. -/
theorem approval_rule_stops_allow (rules : List MandateRule)
    (happroval : decideWithApproval rules true = Verdict.allow) : False := by
  unfold decideWithApproval at happroval
  cases hforbid : hasMatchingForbid rules <;> simp [hforbid] at happroval

/-- Automatic ALLOW implies the plain mandate allows: approval rules grant nothing. -/
theorem allow_implies_mandate_allow (rules : List MandateRule) (approvalMatches : Bool)
    (hallow : decideWithApproval rules approvalMatches = Verdict.allow) :
    decideMandate rules = Outcome.allow := by
  unfold decideWithApproval at hallow
  cases hforbid : hasMatchingForbid rules with
  | true => simp [hforbid] at hallow
  | false =>
    cases approvalMatches with
    | true => simp [hforbid] at hallow
    | false =>
      cases hdecide : decideMandate rules with
      | allow => rfl
      | block => simp [hforbid, hdecide] at hallow

/-- With no approval rule matching, the third outcome changes nothing. -/
theorem no_approval_keeps_decision (rules : List MandateRule)
    (hmandate : decideMandate rules = Outcome.allow) :
    decideWithApproval rules false = Verdict.allow := by
  have hforbid : hasMatchingForbid rules = false :=
    ((allow_iff_permit_without_forbid rules).mp hmandate).left
  simp [decideWithApproval, hforbid, hmandate]

end Gate
