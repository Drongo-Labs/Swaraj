# NEAR contracts

Rust workspace under `contracts/` (`verifier`, `receipts`, `registry`, `wager`). Build with
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

A second, test verifier at `swaraj-verifier-v2-11081417.testnet` pins the
current Private Mandate key (`0x0040b8…a06e`) and the decision guest's key
(`0x005617…7591`). It verified both decision fixtures on testnet
([ALLOW](https://testnet.nearblocks.io/txns/H51uV9JmMSdHhHAEGDatNMNq8dCks8xxfPh5JXLY94Xt),
[BLOCK](https://testnet.nearblocks.io/txns/9kXeytgw6sRNW8W8xyMcXVExniJffnSoHTNLeu13LewN)).
The first verifier still pins the old Private Mandate key, so it no longer
accepts newly generated proofs.

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
Pointed at the test verifier, it then proved a receipt for a BLOCK decision
([prove](https://testnet.nearblocks.io/txns/EYBeSwnNGTTWTtPu5ssKSp68u4nbDEd2eafek7RVw3rW)).

```bash
cargo test --manifest-path contracts/Cargo.toml -p swaraj-receipts
cd contracts/receipts && cargo near build non-reproducible-wasm
```

Deployed account (Kushagra testnet): see `contracts/receipts/DEPLOYMENT.md`
after first deploy (filled by the deploy script; never commit keys).

## `registry` (Kushagra — Nov 8)

Agent directory: an agent registers under its NEAR account id and can be read
back by anyone. Updates are agent-only.

| Method | Does |
|---|---|
| `new()` | Init; caller is owner |
| `register(display_name, metadata_uri)` | Predecessor registers once |
| `update(display_name, metadata_uri)` | Registered agent updates its record |
| `get(agent_id)` / `is_registered(agent_id)` | Views |

```bash
cargo test --manifest-path contracts/Cargo.toml -p swaraj-registry
cd contracts/registry && cargo near build non-reproducible-wasm
```

See `contracts/registry/DEPLOYMENT.md` after deploy.

## `wager` (Kushagra — Nov 9)

NEP-141 / native NEAR escrow for Zunno buy-ins. Deposits above `max_wager`
panic. **The pot pays out only on a PROVED receipt:** the receipts contract must
hold a receipt, verified by the Groth16 verifier, whose statement is an ALLOW of a
`payout` APP_ACTION naming this escrow, the winner and the exact pot. Not even the
owner can pay without one, and each receipt pays once.

| Method | Does |
|---|---|
| `new(ft_contract?, max_wager, receipts)` | Init, with the receipts contract that authorizes payouts |
| `deposit_near` | Native deposit (FT mode off) |
| `ft_on_transfer` | NEP-141 deposit callback |
| `payout(winner, receipt_id, statement, action_wire)` | Anyone. Reads the receipt, checks it is PROVED for this exact payout, then pays the pot. Attach about 100 Tgas |
| `refund(agent)` | Owner returns one agent's wager on cancel |

```bash
cargo test --manifest-path contracts/Cargo.toml -p swaraj-wager
cd contracts && RUSTFLAGS='-C link-arg=-s' cargo build --release -p swaraj-wager --target wasm32-unknown-unknown
```

Testnet: `swaraj-wager-k-9ldcod.testnet` (`max_wager=5000000`) runs the earlier,
owner-settled version; see `contracts/wager/DEPLOYMENT.md`. The proof-gated
version is at `swaraj-wager-proof-11110149.testnet` (1 NEAR cap, receipts
`swaraj-receipts-11081321.testnet`).

## `NearProofSink` (Kushagra — Nov 8)

TypeScript sink in `@swaraj/proofs` (`packages/proofs/src/near-sink.ts`):
`create_pending` → `prove` → poll until `PROVED`. The receipt moves only when
the verifier accepts the Groth16 proof and the statement hash matches
`claim_hash`.

```bash
pnpm --filter @swaraj/proofs build
NEAR_ACCOUNT_ID=… NEAR_PRIVATE_KEY=… NEAR_RECEIPTS_CONTRACT_ID=… \
  node packages/proofs/scripts/near-sink-demo.mjs
```
