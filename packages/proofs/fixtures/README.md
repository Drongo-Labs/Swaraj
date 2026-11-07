# Groth16 fixture

A real Private Mandate proof for the on-chain verifier to test against. The
input is a test mandate, not a secret.

Regenerate it after any change to `private-guest`, because the proof is tied
to the guest's verifying key:

```bash
pnpm --filter @swaraj/proofs build:sp1:private
(cd packages/proofs/host && cargo build --release --features native-gnark)
packages/proofs/host/target/release/swaraj-gate-host \
  packages/proofs/artifacts/swaraj-private-guest \
  packages/proofs/fixtures/private-mandate-input.json \
  --prove --groth16 --proof-out packages/proofs/fixtures/private-mandate-groth16.proof
```

This took 6 min 43 s on a 26 GB Mac and needs about 16 GB of free memory.
Check it with `--verify` in place of the input path.
