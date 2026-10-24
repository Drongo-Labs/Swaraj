# Swaraj Proof Pipeline

How an executed action becomes a proof-bound receipt. Everything here is
implemented in `packages/proofs` on top of `packages/database`.

## Stages

```text
proof_jobs row (QUEUED)
      │  worker: runOneProofJob() leases the oldest queued job
      ▼
ground re-evaluation        packages/proofs/src/verifier.ts
      │  the committed policy + action are re-evaluated deterministically;
      │  any disagreement with the decision recorded at submission time
      │  fails the job (parity gate)
      ▼
statement                   packages/proofs/src/statement.ts
      │  canonical text: swaraj/statement/v1, fields sorted, violated
      │  rule ids sorted, evidence digest included when present;
      │  id = "stmt_" + SHA-256(canonical text)
      ▼
verification bundle         artifacts on disk + proof_artifacts row
      │  JSON: { statementId, canonicalText, evidenceDigest?, createdAt }
      ▼
SP1 guest proof (optional) packages/proofs/src/sp1-prover.ts
      │  when SWARAJ_SP1_ELF + SWARAJ_SP1_HOST_BIN are configured, the
      │  Rust guest recomputes the statement id inside the zkVM and the
      │  prover writes <statementId>.sp1.bin; a guest/worker mismatch
      │  aborts (cross-language parity enforced by the guest itself)
      ▼
sink submission             packages/proofs/src/zkverify.ts, remote-sink.ts
      │  local deterministic sink by default; RemoteProofSink implements
      │  submit → poll → finalize against any zkVerify-style HTTP endpoint
      ▼
receipt promotion           PENDING → PROVED with the sink reference
```

## Job payload

```json
{
  "policy":  { "...wire PolicyDoc, integer constants as JSON numbers..." },
  "action":  { "values": { "amountCents": "25000", "limitCents": "100000" } },
  "expected": { "outcome": "ALLOW", "violatedRuleIds": [] },
  "evidence": { "digest": "<hex of the evidence bundle>" }
}
```

`policy` is the wire form the Rust engine deserializes (`i64`
constants); the worker revives it to the in-memory bigint AST before
evaluation. `expected` is the gateway's recorded decision — the worker
re-derives it and refuses to bundle on disagreement. `evidence` is
optional and rides into the bundle and the artifact ledger.

## Artifacts

| Artifact | Where | Kind in `proof_artifacts` |
|---|---|---|
| Verification bundle | `<artifactRoot>/<receiptId>/<statementId>.json` | `VERIFICATION_BUNDLE` |
| SP1 proof | `<artifactRoot>/<receiptId>/<statementId>.sp1.bin` | `SP1_PROOF` |
| Sink attestation | ledger row only (`{ ref, sink, statementId }`) | `ZKVERIFY_ATTESTATION` |

`SWARAJ_PROOF_ARTIFACT_ROOT` (or the worker's `artifactRoot` option)
selects the root directory.

## Fail-closed behavior

- A parity mismatch (re-evaluated decision ≠ recorded decision) fails
  the job with `last_error` set; the receipt stays `PENDING`.
- A sink failure or attestation failure fails the job the same way.
- Receipt legality is guarded by the database trigger: the worker cannot
  promote a `NON_PROVABLE` or `INVALIDATED` receipt; the failed job
  records the attempt.
- Jobs retry while `attempts < max_attempts` (default 3), then park as
  `FAILED`.

## Running

```bash
pnpm db:up                                  # Postgres
pnpm proofs:worker                          # process one queued job (local sink)

# Optional real SP1 proofs:
pnpm build:sp1                              # guest ELF via the SP1 docker image
cargo build --release --manifest-path host/Cargo.toml
export SWARAJ_SP1_ELF=packages/proofs/artifacts/swaraj-gate-guest
export SWARAJ_SP1_HOST_BIN=target/release/swaraj-gate-host
pnpm proofs:worker
```

Standalone host run (execute in the zkVM, or prove):

```bash
pnpm execute:sp1 < input.json   # guest execution, prints statement_id=
pnpm prove:sp1     < input.json # full proof, writes <statementId>.bin
```

The zkVerify network sink (direct or via Kurier) is the remaining
network-integration step; `RemoteProofSink` is the client that talks to
it, verified today against a local relay in `scripts/submission.test.ts`.

## Tests

- `scripts/e2e-proof.test.ts` — artifacts, ledger rows, event log,
  promotion, and (when the SP1 env is configured) the guest proof path.
- `scripts/worker.test.ts` — queue semantics, parity gate, terminal
  states.
- `scripts/submission.test.ts` — remote sink flow against a local relay.
- `scripts/vectors.test.ts` — gateway ↔ ground evaluator agreement on
  the shared vector file.
- `engine/tests/gate.rs` — Rust-side evaluation and canonical text pins.
- `packages/lean` — Lean proofs of the framework properties and the same
  shared vectors.
