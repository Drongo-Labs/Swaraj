# swaraj-zunno

Swaraj-governed AI agent for **Zunno × Inco** (Base Sepolia): every agent move
is checked against an Agent Mandate before it executes. Implements the plan in
[`swaraj-new/ZUNNO_INCO_SWARAJ_PLAN.md`](../swaraj-new/ZUNNO_INCO_SWARAJ_PLAN.md).

```
Player ── ZunnoInco.sol (Inco, Base)     ← unchanged
Agent ── typed intent ──► Swaraj gateway (Z3, default deny)
                             ├─ ALLOW → execute via the bot wallet path
                             └─ BLOCK → rule ids named → fallback compliant move / abstain
```

## Layout

| Path | Contents |
|---|---|
| `src/zunno/cards.ts` | TS port of the UnoCards.sol codec (`decodeCard`, `isPlayable`, `isWild`) from zunno-inco's bot |
| `src/actions/intents.ts` | Typed-intent builders: STAKE→`PAYMENT`, PLAY_CARD/DRAW_CARD→generic `APP_ACTION` |
| `src/actions/appAction.ts` | Zunno's use of Swaraj's generic `APP_ACTION` (app namespace + atomic decimal params) |
| `src/swaraj/client.ts` | Swaraj API client: mandate registration + unified-action evaluation; fail-closed |
| `src/swaraj/mandateSchema.ts` | Local mirror of the Agent Mandate wire format (incl. param predicates) for offline fixture validation |
| `src/agent/bridge.ts` | The governed turn: gate → execute / fallback (bounded retries) / abstain / forfeit |
| `mandate/zunno-mandate.json` | One mandate: stakes via PAYMENT rules, game moves via APP_ACTION rules (Wild Draw Four forbidden) |

## Rules the agent lives by (blocked-move handling)

- ALLOW executes; BLOCK never mutates state.
- Blocked **stake** → abstain (money actions are never retried blind).
- Blocked **play** → next compliant legal card (each still gated) → else draw (gated) → else forfeit.
- Gateway unreachable or unknown action type ⇒ treated as BLOCK (fail-closed,
  default deny). Nothing executes without an ALLOW.

## Status / next steps

- [x] Intent builders + mandate fixture + governed-turn bridge, unit-tested
      against a fake gateway (`pnpm test`, no services needed).
- [x] Game moves flow through Swaraj's generic `APP_ACTION`
      (swaraj-new `feature/app-action`): `resource {app:"zunno", target}`,
      `context {name, params}` — no per-game schema change needed, and any
      future app reuses the same type.
- [x] Wire `MoveExecutor` to zunno-inco's `gameBot` viem calls
      (`ViemMoveExecutor`: stake→joinGame, playCard, drawCard; dry-run default).
- [x] Live-gateway e2e (`pnpm e2e`): mandate registered, gated stake ALLOW,
      over-cap stake BLOCK by `forbid_stake_over_cap`, APP_ACTION play/draw
      ALLOW, unknown action default-deny. All checks passed.
- [x] Inco attestation provider (`IncoAttestationProvider`): port of
      `incoHand.js` — voucher session + `attestedDecryptWithVoucher`; a card
      the agent does not hold never attests (fail closed).
- [ ] Bind the bot's Base tx hash to the Swaraj receipt (evidence adapters)
      and batch-prove a finished match.

## Play it

```sh
pnpm install
pnpm play          # → http://127.0.0.1:3002
```

Fully standalone: the Swaraj mandate engine (`src/vendor/`, vendored from
swaraj-new) evaluates every agent move **in-process** — default deny,
forbid-wins, fail-closed. No other checkout, no database, no chain needed.

- You play UNO against the agent; your moves are checked for game legality only.
- The agent's every move is a typed intent (`APP_ACTION`) checked against its
  mandate first. The mandate forbids Wild+4 (`cardValue > 104`), so when the
  agent's only playable card is a Wild+4 it is **blocked and draws instead** —
  visible in red in the game log.
- Local mode is not TEE-private and not on-chain: hands live in process memory.
  The on-chain (Inco/Base) and NEAR variants are the architecture docs' job.

## Remote gateway (optional)

The same bridge runs against a live Swaraj API (`SWARAJ_API_URL` +
`SWARAJ_DEV_TOKEN`, see `pnpm e2e`); the embedded gateway is the offline
drop-in with identical semantics.

## Setup

```sh
pnpm install
pnpm test         # node:test, no database or API needed
pnpm typecheck
```

Against a live Swaraj API (swaraj-new, `apps/api`):

```sh
export SWARAJ_API_URL=http://localhost:3000
export SWARAJ_APPLICATION_ID=zunno
export ZUNNO_GAME_ADDRESS=0x82b2cce9a52c7e56838a5c46833067f9eb006911
```
