# Wager escrow deployment

| | |
|---|---|
| Network | testnet |
| Account | `swaraj-wager-k-9ldcod.testnet` |
| Deploy tx | [H4YwgCxAEQ1vLCgARiNTVmyDdq39iR4jZrt74bXkrHYK](https://testnet.nearblocks.io/txns/H4YwgCxAEQ1vLCgARiNTVmyDdq39iR4jZrt74bXkrHYK) |
| Init | `new(ft_contract=null, max_wager=5000000)` (native NEAR; cap matches mandate USDC atomic units) |
| WASM | `contracts/target/wasm32-unknown-unknown/release/swaraj_wager.wasm` |

Private key: `~/.near-credentials/testnet/swaraj-wager-k-9ldcod.testnet.json` and `/tmp/swaraj-near-kushagra/nov9-wager.env` — never commit it.

## Live checks (Nov 9)

| Check | Result |
|---|---|
| `deposit_near` 1_000_000 (≤ max) | Recorded for owner |
| `deposit_near` 5_000_001 from stranger | Rejected (trap / `wager over max`); `get_wager` stays `null` |
| Gateway e2e (`ZUNNO_GATEWAY=live`) | on-turn ALLOW, off-turn `forbid_off_turn`, wager in-cap ALLOW, over-cap `forbid_wager_over_cap` |
