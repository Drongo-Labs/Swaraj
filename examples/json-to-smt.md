# Example: JSON constraints to SMT-LIB

Illustrates the translation the `packages/smt` compiler (Day 2) will perform:
a JSON rule set becomes integer-only SMT-LIB assertions that Z3 checks for
satisfiability.

Two scenarios, one allow path and one block path.

## Scenario A — within policy

### Input rules

```json
{
  "fields": { "limitCents": "int", "amountCents": "int" },
  "assume": ["(= limitCents 100000)"],
  "rules": [
    { "id": "amount.positive", "expr": "(> amountCents 0)" },
    { "id": "amount.cap", "expr": "(<= amountCents limitCents)" }
  ],
  "decideFor": "amountCents = 25000"
}
```

### Generated SMT-LIB

```lisp
(declare-const limitCents Int)
(declare-const amountCents Int)

(assert (= limitCents 100000))
(assert (> amountCents 0))
(assert (<= amountCents limitCents))
(assert (= amountCents 25000))

(check-sat)
```

### Z3 answer

```text
sat
```

The proposed amount satisfies every rule, so the gateway returns **ALLOW**.

## Scenario B — over the cap

Same rules, but `decideFor` is `"amountCents = 250000"`:

```lisp
(declare-const limitCents Int)
(declare-const amountCents Int)

(assert (= limitCents 100000))
(assert (> amountCents 0))
(assert (<= amountCents limitCents))
(assert (= amountCents 250000))

(check-sat)
```

```text
unsat
```

Unsatisfiable, so the gateway returns **BLOCK**. In the real gateway an unsat
core maps the contradiction back to rule IDs — here `amount.cap` — which is
what the decision receipt records.

## Notes

- Only integers. No floats, no string ordering — money is always integer
  minor units (`*Cents`).
- Rule IDs are stable and numeric in the real pipeline so TypeScript, the SP1
  guest, and Lean all refer to them identically.
- The actual compiler lands with `packages/smt` (Day 2). This file is the
  interface contract it must honor.
