/-
Shared gate vectors — GENERATED FILE, do not edit by hand.

Source: packages/proofs/vectors/gate-vectors.json
Regenerate: pnpm --filter @swaraj/lean sync:vectors

Each example is kernel-checked: the Lean evaluator must reproduce the
exact outcome and violated-rule list the TypeScript gateway test
(scripts/vectors.test.ts) and the Rust engine tests assert.
-/

import Gate.Decide

namespace Gate

def pol_polVectorsTrade : Gate.PolicyDoc :=
  Gate.PolicyDoc.mk "pol_vectors_trade" 1 ["amountCents", "limitCents", "dailyUsedCents", "dailyCapCents"] [Gate.NamedAssertion.mk "limit.fixed" (Gate.BoolTerm.compare Gate.CmpOp.eq (Gate.IntTerm.field "limitCents") (Gate.IntTerm.const 100000))] [Gate.NamedAssertion.mk "amount.positive" (Gate.BoolTerm.compare Gate.CmpOp.gt (Gate.IntTerm.field "amountCents") (Gate.IntTerm.const 0)), Gate.NamedAssertion.mk "amount.cap" (Gate.BoolTerm.compare Gate.CmpOp.le (Gate.IntTerm.field "amountCents") (Gate.IntTerm.field "limitCents")), Gate.NamedAssertion.mk "daily.budget" (Gate.BoolTerm.compare Gate.CmpOp.le (Gate.IntTerm.sum [(Gate.IntTerm.field "dailyUsedCents"), (Gate.IntTerm.field "amountCents")]) (Gate.IntTerm.field "dailyCapCents"))]

def pol_polVectorsCompound : Gate.PolicyDoc :=
  Gate.PolicyDoc.mk "pol_vectors_compound" 2 ["x", "y"] [] [Gate.NamedAssertion.mk "x.positive" (Gate.BoolTerm.compare Gate.CmpOp.gt (Gate.IntTerm.field "x") (Gate.IntTerm.const 0)), Gate.NamedAssertion.mk "y.zero_or_one" (Gate.BoolTerm.any [(Gate.BoolTerm.compare Gate.CmpOp.eq (Gate.IntTerm.field "y") (Gate.IntTerm.const 0)), (Gate.BoolTerm.compare Gate.CmpOp.eq (Gate.IntTerm.field "y") (Gate.IntTerm.const 1))]), Gate.NamedAssertion.mk "spread.requires_flag" (Gate.BoolTerm.implies (Gate.BoolTerm.compare Gate.CmpOp.gt (Gate.IntTerm.field "x") (Gate.IntTerm.const 10)) (Gate.BoolTerm.compare Gate.CmpOp.eq (Gate.IntTerm.field "y") (Gate.IntTerm.const 1))), Gate.NamedAssertion.mk "y.not_negative" (Gate.BoolTerm.neg (Gate.BoolTerm.compare Gate.CmpOp.lt (Gate.IntTerm.field "y") (Gate.IntTerm.const 0))), Gate.NamedAssertion.mk "spread.leq_cap" (Gate.BoolTerm.compare Gate.CmpOp.le (Gate.IntTerm.diff (Gate.IntTerm.field "x") (Gate.IntTerm.field "y")) (Gate.IntTerm.const 100)), Gate.NamedAssertion.mk "product.leq_cap" (Gate.BoolTerm.compare Gate.CmpOp.le (Gate.IntTerm.prod [(Gate.IntTerm.field "x"), (Gate.IntTerm.field "y")]) (Gate.IntTerm.const 1000))]

def bind_withinLimits : Gate.Binding :=
  [("amountCents", 25000), ("limitCents", 100000), ("dailyUsedCents", 0), ("dailyCapCents", 500000)]

example : Gate.decide pol_polVectorsTrade bind_withinLimits = (Gate.Outcome.allow, []) := by
  simp [pol_polVectorsTrade, bind_withinLimits,
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]

def bind_overCap : Gate.Binding :=
  [("amountCents", 250000), ("limitCents", 100000), ("dailyUsedCents", 0), ("dailyCapCents", 500000)]

example : Gate.decide pol_polVectorsTrade bind_overCap = (Gate.Outcome.block, ["amount.cap"]) := by
  simp [pol_polVectorsTrade, bind_overCap,
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]

def bind_negativeAmount : Gate.Binding :=
  [("amountCents", -5), ("limitCents", 100000), ("dailyUsedCents", 0), ("dailyCapCents", 500000)]

example : Gate.decide pol_polVectorsTrade bind_negativeAmount = (Gate.Outcome.block, ["amount.positive"]) := by
  simp [pol_polVectorsTrade, bind_negativeAmount,
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]

def bind_dailyBudgetExhausted : Gate.Binding :=
  [("amountCents", 20000), ("limitCents", 100000), ("dailyUsedCents", 490000), ("dailyCapCents", 500000)]

example : Gate.decide pol_polVectorsTrade bind_dailyBudgetExhausted = (Gate.Outcome.block, ["daily.budget"]) := by
  simp [pol_polVectorsTrade, bind_dailyBudgetExhausted,
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]

def bind_compoundAllows : Gate.Binding :=
  [("x", 5), ("y", 0)]

example : Gate.decide pol_polVectorsCompound bind_compoundAllows = (Gate.Outcome.allow, []) := by
  simp [pol_polVectorsCompound, bind_compoundAllows,
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]

def bind_compoundBlocksOnImplies : Gate.Binding :=
  [("x", 50), ("y", 0)]

example : Gate.decide pol_polVectorsCompound bind_compoundBlocksOnImplies = (Gate.Outcome.block, ["spread.requires_flag"]) := by
  simp [pol_polVectorsCompound, bind_compoundBlocksOnImplies,
        Gate.decide, Gate.outcomeOf, Gate.violatedOf, Gate.oracleOf,
        Gate.evalBool, Gate.evalAll, Gate.evalAny, Gate.evalInt, Gate.evalCmp,
        Gate.Binding.lookup]

end Gate
