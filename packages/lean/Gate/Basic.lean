/-! # Gate terms: the rule AST shared with TS and Rust. Evaluation is total; a missing field gives `none`. -/

namespace Gate

inductive IntTerm : Type where
  | const (value : Int) : IntTerm
  | field (name : String) : IntTerm
  | sum (parts : List IntTerm) : IntTerm
  | diff (left right : IntTerm) : IntTerm
  | prod (parts : List IntTerm) : IntTerm
  deriving Repr

inductive CmpOp : Type where
  | eq | ne | lt | le | gt | ge
  deriving Repr

inductive BoolTerm : Type where
  | compare (op : CmpOp) (left right : IntTerm) : BoolTerm
  | all (parts : List BoolTerm) : BoolTerm
  | any (parts : List BoolTerm) : BoolTerm
  | neg (part : BoolTerm) : BoolTerm
  | implies (ante conse : BoolTerm) : BoolTerm
  deriving Repr

structure NamedAssertion where
  ruleId : String
  assertion : BoolTerm
  deriving Repr

structure PolicyDoc where
  policyId : String
  revision : Nat
  fields : List String
  assumptions : List NamedAssertion
  rules : List NamedAssertion
  deriving Repr

/-- Ground field values, first match wins. -/
abbrev Binding := List (String × Int)

def Binding.lookup : Binding → String → Option Int
  | [], _ => none
  | (key, value) :: rest, name =>
      if key = name then some value else lookup rest name

def evalInt : IntTerm → Binding → Option Int
  | .const value, _ => some value
  | .field name, binding => binding.lookup name
  | .sum parts, binding =>
      parts.foldl
        (fun acc part => do
          let left ← acc
          let right ← evalInt part binding
          some (left + right))
        (some 0)
  | .prod parts, binding =>
      parts.foldl
        (fun acc part => do
          let left ← acc
          let right ← evalInt part binding
          some (left * right))
        (some 1)
  | .diff left right, binding => do
      let leftValue ← evalInt left binding
      let rightValue ← evalInt right binding
      some (leftValue - rightValue)

def evalCmp : CmpOp → Int → Int → Bool
  | .eq, left, right => left = right
  | .ne, left, right => left ≠ right
  | .lt, left, right => left < right
  | .le, left, right => left ≤ right
  | .gt, left, right => left > right
  | .ge, left, right => left ≥ right

mutual
  /-- Short-circuiting conjunction, mirroring the TypeScript `every`. -/
  def evalAll : List BoolTerm → Binding → Option Bool
    | [], _ => some true
    | part :: rest, binding => do
        let value ← evalBool part binding
        if value then evalAll rest binding else some false

  /-- Short-circuiting disjunction, mirroring the TypeScript `some`. -/
  def evalAny : List BoolTerm → Binding → Option Bool
    | [], _ => some false
    | part :: rest, binding => do
        let value ← evalBool part binding
        if value then some true else evalAny rest binding

  def evalBool : BoolTerm → Binding → Option Bool
    | .compare op left right, binding => do
        let leftValue ← evalInt left binding
        let rightValue ← evalInt right binding
        some (evalCmp op leftValue rightValue)
    | .all parts, binding => evalAll parts binding
    | .any parts, binding => evalAny parts binding
    | .neg part, binding => do
        let value ← evalBool part binding
        some (!value)
    | .implies ante conse, binding => do
        let anteValue ← evalBool ante binding
        let conseValue ← evalBool conse binding
        some (!anteValue || conseValue)
end

end Gate
