# Groth16 fixtures

Real proofs for the on-chain verifier and receipts contracts to test against.
The inputs are test mandates, not secrets.

| Fixture | Guest | Statement |
|---|---|---|
| `private-mandate-groth16` | `private-guest` | Private Mandate, ALLOW |
| `decision-allow-groth16` | `decision-guest` | Mandate decision, ALLOW, matched `permit_pay` |
| `decision-block-groth16` | `decision-guest` | Mandate decision, BLOCK, matched `forbid_cap` |

Each has a `.proof` (the SP1 proof) and a `.json` (program key, public values
and proof as hex, the verifier's input).

A proof is tied to its guest's verifying key, so regenerate the fixtures after
any change to `private-guest` or `decision-guest`, then redeploy the verifier
with the new program keys:

```bash
pnpm --filter @swaraj/proofs build:sp1:private
pnpm --filter @swaraj/proofs build:sp1:decision
(cd packages/proofs/host && cargo build --release --features native-gnark)
H=packages/proofs/host/target/release/swaraj-gate-host
A=packages/proofs/artifacts
F=packages/proofs/fixtures
$H $A/swaraj-decision-guest $F/decision-block-input.json --prove --groth16 --proof-out $F/decision-block-groth16.proof
$H $A/swaraj-decision-guest --export $F/decision-block-groth16.proof > $F/decision-block-groth16.json
```

Each proof took about 6 to 7 minutes on a 26 GB Mac. Check one with `--verify`
in place of the input path.
