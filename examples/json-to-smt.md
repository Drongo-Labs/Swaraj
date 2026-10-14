# Example: JSON rules to SMT-LIB

Shows the translation `packages/smt` performs: a typed JSON rule document
becomes integer-only SMT-LIB assertions that Z3 checks for satisfiability.
This is the exact wire shape the compiler accepts — try it against the
gateway after `pnpm --filter @swaraj/smt test`.

## Rule document

```json
{
  "policyId": "pol_trade_demo",
  "revision": 1,
  "fields": ["amountCents", "limitCents"],
  "assumptions": [
    {
      "ruleId": "limit.fixed",
      "assertion": {
        "kind": "compare", "op": "eq",
        "left": { "kind": "field", "name": "limitCents" },
        "right": { "kind": "const", "value": 100000 }
      }
    }
  ],
  "rules": [
    {
      "ruleId": "amount.positive",
      "assertion": {
        "kind": "compare", "op": "gt",
        "left": { "kind": "field", "name": "amountCents" },
        "right": { "kind": "const", "value": 0 }
      }
    },
    {
      "ruleId": "amount.cap",
      "assertion": {
        "kind": "compare", "op": "le",
        "left": { "kind": "field", "name": "amountCents" },
        "right": { "kind": "field", "name": "limitCents" }
      }
    }
  ]
}
```

## Action under test

```json
{ "values": { "amountCents": "25000", "limitCents": "100000" } }
```

## Generated SMT-LIB (stored with every decision, replayable as-is)

```lisp
; policy pol_trade_demo revision 1
(set-logic QF_NIA)
(declare-const amountCents Int)
(declare-const limitCents Int)

(assert ; assumption limit.fixed
  (= limitCents 100000))

(assert ; rule amount.positive
  (> amountCents 0))
(assert ; rule amount.cap
  (<= amountCents limitCents))

; ground action under test
(assert (= amountCents 25000))
(assert (= limitCents 100000))

(check-sat)
```

Z3 answers `sat`, so the gateway returns **ALLOW**.

## Blocking

With `amountCents: "250000"` the same script ends `unsat` and the gateway
returns **BLOCK** with `violatedRuleIds: ["amount.cap"]` — found by
re-solving each rule's negation under the ground binding, not by guessing.

## Notes

- Integers only; money is minor units (`*Cents`). Non-integer, missing, or
  unknown values fail closed to BLOCK.
- The same rule document, unchanged, is re-evaluated deterministically by
  the Rust engine (`packages/proofs/engine`) inside the SP1 guest.
