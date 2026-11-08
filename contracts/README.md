# NEAR contracts

Rust workspace under `contracts/` (`verifier`, `receipts`). Build with
`cargo near` from each crate; run unit tests from the workspace root:

```bash
cargo test --manifest-path contracts/Cargo.toml
```

Use a **separate testnet account per person**. Never commit private keys.

## `verifier` (Ayush)

Verifies SP1 Groth16 proofs with NEAR's `alt_bn128` host functions, following
SP1's own `SP1VerifierGroth16.sol`. Only program keys pinned at deployment are
accepted, and any invalid proof makes the call fail.

| Method | Does |
|---|---|
| `new(programs)` | Pins SP1 program keys (`vk.bytes32()`, `0x` hex) |
| `verify(program, public_values, proof)` | Returns the committed statement, or fails. Bytes are base64 |
| `programs()` | Lists the pinned keys |

On testnet it is deployed at `swaraj-verifier-11071456.testnet`, pinned to the
Private Mandate guest. Verifying the fixture proof cost 33.95 Tgas, about 11% of
the 300 Tgas transaction limit
([success](https://testnet.nearblocks.io/txns/JDzquNwpRxvncdR14cNxLPewwuj49UTT9ccqJqg14Qem),
[tampered proof rejected](https://testnet.nearblocks.io/txns/6KgLm4rzD3piB7NiNHZpi98CW3Vm7LJDBeAcnL5d9ufU)).

```bash
cargo test --manifest-path contracts/Cargo.toml -p swaraj-verifier
cd contracts/verifier && cargo near build non-reproducible-wasm
```

Export a proof for it with the host:
`swaraj-gate-host <elf> --export <groth16-proof>` prints the program key,
public values and proof as hex.

`src/vk.rs` is generated from SP1's verifier by `scripts/gen-vk.py`. Rerun it
after an SP1 version bump.

## `receipts` (Kushagra — Nov 7 start)

On-chain receipt lifecycle mirroring
`packages/database/migrations/0002-receipts.sql`:

| From | Allowed next |
|---|---|
| `PENDING` | `PROVED`, `NON_PROVABLE`, `INVALIDATED` |
| `PROVED` | `INVALIDATED` |

Illegal moves panic. Only the owner (the account that called `new`) creates
receipts or changes them by hand. `PROVED` is reached only through `prove`,
which anyone may call: the verifier checks the proof, and the receipt moves only
if the proved statement's SHA-256 equals the receipt's `claim_hash`.

| Method | Does |
|---|---|
| `new(verifier?)` | Init. The caller becomes the owner |
| `set_verifier(verifier)` | Owner sets the verifier account |
| `create_pending(receipt_id, app_id, intent_digest, claim_hash)` | Owner inserts `PENDING`. `claim_hash` is the lowercase hex SHA-256 of the statement to prove |
| `prove(receipt_id, program, public_values, proof)` | Anyone. Calls the verifier, then `PENDING → PROVED` on a match. Attach about 100 Tgas |
| `mark_non_provable(receipt_id, note?)` | Owner. `PENDING → NON_PROVABLE` |
| `invalidate(receipt_id, note?)` | Owner. `PENDING\|PROVED → INVALIDATED` |
| `get(receipt_id)` | View the record |
| `event_count` / `get_event` | Append-only transition log |

Tested end to end on testnet at `swaraj-receipts-11081321.testnet`, wired to the
verifier: a stranger could not create a receipt or call the private callback,
and a valid proof moved a receipt to `PROVED` for 39.32 Tgas in total
([prove](https://testnet.nearblocks.io/txns/CduvB6UYRGk3YhdLdrkXNVWjFpGhogzPZqbawGwXVLZR)).

```bash
cargo test --manifest-path contracts/Cargo.toml -p swaraj-receipts
cd contracts/receipts && cargo near build non-reproducible-wasm
```

Deployed account (Kushagra testnet): see `contracts/receipts/DEPLOYMENT.md`
after first deploy (filled by the deploy script; never commit keys).
