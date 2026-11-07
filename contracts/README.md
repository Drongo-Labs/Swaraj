# NEAR contracts

## `verifier`

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
cargo test --manifest-path contracts/Cargo.toml   # real proof + tampered variants
cd contracts/verifier && cargo near build non-reproducible-wasm
```

Export a proof for it with the host:
`swaraj-gate-host <elf> --export <groth16-proof>` prints the program key,
public values and proof as hex.

`src/vk.rs` is generated from SP1's verifier by `scripts/gen-vk.py`. Rerun it
after an SP1 version bump.
