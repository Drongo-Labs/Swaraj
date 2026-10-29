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
| `src/actions/intents.ts` | Typed-intent builders: STAKE→`PAYMENT` (works today), PLAY_CARD/DRAW_CARD (extension) |
| `src/actions/extension.ts` | Proposed Swaraj schema extension for game actions — lift into `packages/schemas` |
| `src/swaraj/client.ts` | Swaraj API client: mandate registration + unified-action evaluation; fail-closed |
| `src/swaraj/mandateSchema.ts` | Local mirror of the Agent Mandate wire format for offline fixture validation |
| `src/agent/bridge.ts` | The governed turn: gate → execute / fallback (bounded retries) / abstain / forfeit |
| `mandate/` | `zunno-mandate.json` (today, PAYMENT/stakes) + post-extension game rules |

## Rules the agent lives by (blocked-move handling)

- ALLOW executes; BLOCK never mutates state.
- Blocked **stake** → abstain (money actions are never retried blind).
- Blocked **play** → next compliant legal card (each still gated) → else draw (gated) → else forfeit.
- Gateway unreachable or unknown action type ⇒ treated as BLOCK (fail-closed,
  default deny). Nothing executes without an ALLOW.

## Status / next steps

- [x] Intent builders + mandate fixtures + governed-turn bridge, unit-tested
      against a fake gateway (`pnpm test`, no services needed).
- [ ] Wire `MoveExecutor` to zunno-inco's `gameBot` viem calls
      (`playCard`/`drawCard`/stake path).
- [ ] Register the mandate fixture against a live Swaraj API and run one gated
      stake end-to-end (receipt recorded).
- [ ] Swaraj schema extension: add `PLAY_CARD`/`DRAW_CARD` to
      `UnifiedActionType` + `fieldsByAction` in swaraj-new, then swap in the
      post-extension mandate fixture.
- [ ] Bind the bot's Base tx hash to the Swaraj receipt (evidence adapters)
      and batch-prove a finished match.

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
