# Receipts contract deployment

| | |
|---|---|
| Network | testnet |
| Account | `swaraj-receipts-k-7znbe6.testnet` |
| Deploy tx | [4ChhUBQNWeZShZKV761Gn4ZzLTNHadYNP1gP5hVkWxBu](https://testnet.nearblocks.io/txns/4ChhUBQNWeZShZKV761Gn4ZzLTNHadYNP1gP5hVkWxBu) |
| Init | `new(verifier=swaraj-verifier-v2-11081417.testnet)` |
| Verifier | `swaraj-verifier-v2-11081417.testnet` |
| WASM | `contracts/target/wasm32-unknown-unknown/release/swaraj_receipts.wasm` |

Private key: `~/.near-credentials/testnet/swaraj-receipts-k-7znbe6.testnet.json` and `/tmp/swaraj-near-kushagra/nov8.env` — never commit it.

## NearProofSink (Nov 8)

`node packages/proofs/scripts/near-sink-demo.mjs` moved fixture decisions
`PENDING → PROVED` on this account via the verifier:

| Fixture | Result |
|---|---|
| `decision-allow-groth16` | `sink: near`, claim `cbb6f895…69f9` |
| `decision-block-groth16` | `sink: near`, claim `11e87ed7…8dd6` |
