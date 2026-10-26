# Swaraj — Demo & User Flow

Product demo guide for the full authorization path: **owner policy → agent proposes → Swaraj ALLOW/BLOCK → execute → receipt → proof**.

This is the intended **proper** demo (scripted agent + control-plane UI). Every run is real: Postgres, Uniswap v3 on Base and RPC evidence.

---

## One-liner

Swaraj sits between an AI agent and execution: it enforces an owner-approved policy **before** any trade runs, then issues portable receipts (and optional ZK proofs) afterward.

---

## Personas

| Persona | Role |
|---|---|
| **Owner** | Sets the Agent Mandate (limits, venues, assets, slippage, cooldown). |
| **Trading agent** | Proposes typed `SPOT_TRADE` intents. Cannot bypass the gateway. Holds no open execution keys. |
| **Auditor / viewer** | Reads ALLOW/BLOCK outcomes, receipts, hashes, assumptions, proof status + Kurier links. |

---

## App UI — two views (product requirement)

The web app should be two distinct views, not one combined form.

### View 1 — Owner: show / set active policy

| Capability | Behavior |
|---|---|
| **Show** | Active policy id, version, status, policy hash, every enforceable limit |
| **Set** | Owner edits limits → create/activate new policy version via `POST /v1/applications/:id/policies` |
| **Activate** | Only one ACTIVE policy; agent always evaluates against ACTIVE |

Fields the owner can set must be the same fields the gateway + Lean model enforce (see [Lean ↔ policy alignment](#lean--policy-alignment)).

**Implemented** in `apps/web` Owner view (show + set/activate via `POST .../policies`).

### View 2 — Agent: live working view

| Capability | Behavior |
|---|---|
| **Action feed** | Each proposed intent appears as a row (amount, slippage, venue, time) |
| **Decision** | ALLOW or BLOCK, with **why** (rule id + reason from SMT) |
| **Capability / receipt** | On ALLOW: capability id → trade receipt status |
| **Decision receipt** | On BLOCK: Decision Receipt id + violated rules |
| **Proof** | Proof status; when submitted via **Kurier**, show a **link to the Kurier / zkVerify submission** (job id / explorer URL) |

Scripted demo agent (or `pnpm agent`) drives proposals into this view; the owner does not hand-submit trades here.

**Implemented** in `apps/web` Agent view + `GET .../activity`; receipts expose `proof.kurierUrl` when tx/aggregation/job id is present.

### Demo navigation

```
[ Owner · Policy ]     [ Agent · Activity ]
        │                      │
   set ACTIVE policy     watch proposes → ALLOW/BLOCK
                         + why + receipt + Kurier link
```

---

## Lean ↔ policy alignment

The Lean suite (`packages/lean`) is the **source of truth for the predicates we claim**. Runtime policy + SMT must use the **exact same conditions** — not a looser or parallel rule set.

| Layer | Role |
|---|---|
| **Lean** (`packages/lean`) | Proves properties of the supported policy language / arithmetic model (e.g. `AmountPolicy.lean`: not paused, `0 < amount`, `amount ≤ cap`, `used + reserved + amount ≤ budget`; Phase 10 compiler/lifecycle theorems) |
| **Agent Mandate** (Zod / registry) | Concrete numbers + enums the owner sets in View 1 |
| **SMT gateway** (Phase 4) | Evaluates those fields with stable `RuleId`s (1–14) |

Rules for the demo:

1. Every limit shown/edited in the Owner UI must map to a real gateway rule (and Lean-covered predicate where applicable).
2. Do **not** invent UI-only constraints that Lean/SMT do not enforce.
3. BLOCK “why” text must cite the same rule ids the solver returns (`RuleId` in `packages/schemas`).
4. If Lean models a **specific** subset (amount/cap/budget/paused), the demo narrative should emphasize those predicates first; broader SMT rules (venue, slippage, cooldown, …) stay consistent with the Agent Mandate schema.

---

## End-to-end user flow

```
Owner defines Agent Mandate (ACTIVE)
        │
        ▼
Agent submits Action Intent  ──►  Schema / freshness checks
        │
        ▼
Policy gateway (Z3 / SMT)
        │
        ├── BLOCK ──► no capability ──► Decision Receipt (Phase 9)
        │
        └── ALLOW ──► Capability token (single-use, short-lived)
                            │
                            ▼
                      Execution adapter (venue)
                            │
                            ▼
                      Evidence + finality
                            │
                            ▼
                      TRADE_EXECUTED receipt (PENDING)
                            │
                            ├── evidence/proof OK ──► PROVED
                            └── evidence/proof fail ──► NON_PROVABLE
                                 (does not undo an executed trade)
```

### Happy path (ALLOW)

1. Active policy loaded (e.g. `policy_demo`: max **100 USDC**/trade, **100 bps** slippage, Uniswap v3 Base).
2. Agent proposes a within-limit intent (e.g. **50 USDC → WETH**, 50 bps).
3. SMT returns **ALLOW**.
4. Capability token issued (bound to that exact intent).
5. Adapter executes; evidence collected under finality rules.
6. Signed **PENDING** `TRADE_EXECUTED` receipt with intent/policy/evidence commitments.
7. Proof generated / submitted (Kurier path preferred for demo) → Agent view shows **submission link**.
8. Workers may promote receipt to **PROVED** after verified finality.

### Failure path (BLOCK)

1. Agent proposes over-limit intent (e.g. **600 USDC**, **500 bps** slippage).
2. SMT returns **BLOCK** with violated rule IDs/reasons — Agent view shows **why**.
3. No capability issued — nothing executes.
4. **Decision Receipt** recorded (auditable denial). Optional decision proof → Kurier link when proved.

### Demo fixtures (default)

| Item | Value |
|---|---|
| Application | `app_demo` |
| Policy | `policy_demo` |
| ALLOW action | `trade.spot` (~50 USDC) |
| BLOCK action | `trade.block` (~600 USDC, over caps) |
| Venue | `UNISWAP_V3_BASE` |
| Pair | USDC → WETH |

---

## Artifacts to show on screen

| Artifact | When |
|---|---|
| Policy hash / version / hard limits | Always |
| Intent hash | ALLOW and BLOCK |
| Capability id | ALLOW only |
| Violated rules + reasons | BLOCK |
| Trade receipt (`PENDING` → `PROVED` / `NON_PROVABLE`) | ALLOW |
| Evidence root + assumptions | Trade receipt |
| Decision Receipt + decision-log hash | BLOCK |
| Proof status + **Kurier submission link** | After prove/submit |
| `/health` phase flags | Setup / trust check |

---

## Recommended demo format

### Staging layout

| Screen | Content |
|---|---|
| **Primary** | Web app — switch **Owner** ↔ **Agent** views |
| **Secondary** | Demo agent terminal (optional; can be hidden if Agent view is fed live) |
| **Backup** | Recorded run of the same flow (API / network failsafe) |

### Why a demo agent

The product story is **agent proposes → Swaraj gates**. UI-only clicks look like a trading form. Use a **scripted** agent (rehearsed scenes), not a free-form LLM trader.

| Do | Don’t |
|---|---|
| Scripted scenes: block → allow → replay | Free-form LLM inventing trades live |
| Narration lines before each propose | Agent holding execution private keys |
| Live/local API via SDK | Show raw curl only |
| Split: agent + UI | Dump raw JSON with no narrative |

Current thin agent: `pnpm agent` (`apps/example`). For a proper demo, extend it into numbered scenes with narration (see [Demo arc](#demo-arc-20–25-min)).

---

## Demo mode (live only — no mock)

- Postgres + `DATABASE_URL`
- `BASE_RPC_URL` + funded `SWARAJ_EXECUTION_PRIVATE_KEY` + `SWARAJ_SIGNER_PRIVATE_KEY`
- Live ERC-20 balances from Base RPC (`GET .../state`) — client cannot fake portfolio
- `/health` shows `mode: "base"`, `live: true`, Lean Phase10, SP1/zkVerify/Kurier flags
- **Warning:** every ALLOW broadcasts a real ~50 USDC Uniswap swap
- Auto-prove: after ALLOW/BLOCK the API schedules `prover:once` + workers when `SWARAJ_SP1_*` is set
- Kurier: workers submit via Kurier when `KURIER_API_KEY` is set; UI shows `proof.kurierUrl`
- Lean: `pnpm check:lean` is the formal assurance gate (not a runtime mock)

---

## Demo arc (20–25 min)

| # | Beat | Time | What happens | Say |
|---|---|---|---|---|
| 1 | Problem | 2 min | Talk / slide | Prompt limits don’t bind at execution; agent self-reports aren’t evidence |
| 2 | Owner view | 3 min | Show + set active policy | Owner sets limits that match Lean-backed predicates; activate policy |
| 3 | Switch to Agent | 1 min | Open Agent view | Same ACTIVE policy now gates the agent |
| 4 | Agent BLOCK | 4 min | Oversized propose appears in feed | Rejected + **why** (rule ids) + Decision Receipt |
| 5 | Agent ALLOW | 6 min | Within-policy propose | Accepted → capability → execute → receipt |
| 6 | Proof | 4 min | Kurier submission link on the row | Proof generated through Kurier — open the link |
| 7 | Close | 2 min | Trust line | Lean aligns conditions; any agent hits the same gate |

**Order:** BLOCK before ALLOW so the audience feels the gate first.

### Trust line (always)

Proofs verify the verification program over **committed** inputs. They do not invent venue truth, and **NON_PROVABLE** does not undo an already-executed trade.

---

## Runbook

### Prerequisites

1. Copy `.env.example` → `.env`; set all **live** vars (see SETUP.md). Do **not** set `SWARAJ_FORCE_MOCK`.
2. `pnpm build` and `pnpm check:lean`
3. `pnpm db:up`
4. Funded Base wallet + RPC + signer
5. For PROVED + Kurier links: SP1 binaries, `ZKVERIFY_SEED_PHRASE`, optional `KURIER_API_KEY`

### Start services

```bash
pnpm dev:api          # 127.0.0.1:3000
pnpm dev:web          # UI (set VITE_SWARAJ_URL / VITE_SWARAJ_DEV_TOKEN / VITE_SWARAJ_APPLICATION_ID)
```

Confirm:

```bash
curl -s http://127.0.0.1:3000/health
```

### Agent against live/local API

```bash
export SWARAJ_URL=http://127.0.0.1:3000
export SWARAJ_DEV_TOKEN=…          # same as API
export SWARAJ_APPLICATION_ID=app_demo
pnpm agent                         # trade.spot then trade.block
```

### Curl fallbacks

**ALLOW**

```bash
curl -s -X POST "http://127.0.0.1:3000/v1/applications/app_demo/actions" \
  -H "authorization: Bearer $SWARAJ_DEV_TOKEN" \
  -H "content-type: application/json" \
  -d '{"action":"trade.spot","input":{"policyId":"policy_demo"},"idempotencyKey":"demo-allow-1"}'
```

**BLOCK**

```bash
curl -s -X POST "http://127.0.0.1:3000/v1/applications/app_demo/actions" \
  -H "authorization: Bearer $SWARAJ_DEV_TOKEN" \
  -H "content-type: application/json" \
  -d '{"action":"trade.block","input":{"policyId":"policy_demo"},"idempotencyKey":"demo-block-1"}'
```

### Web UI path

1. **Owner · Policy** → confirm health → show ACTIVE policy → edit Lean-aligned limits → Activate.
2. **Agent · Activity** → “Propose over limits” / “Propose within policy” / “Run demo sequence”.
3. Select a row → BLOCK why + Decision Receipt, or ALLOW + trade receipt.
4. When proof refs exist → **Open Kurier / zkVerify submission** link on the detail panel.

Optional CLI agent (same API, fills the activity feed):

```bash
pnpm agent -- --scene=all      # block + allow + replay
pnpm agent -- --scene=block
pnpm agent -- --scene=allow
```

---

## Build checklist (from product notes)

- [x] **Owner view:** show active policy
- [x] **Owner view:** set / activate policy (POST policies)
- [x] **Agent view:** feed of proposed actions (`GET .../activity` + UI)
- [x] **Agent view:** accepted/rejected + why (rule id + reason)
- [x] **Agent view:** receipt / decision-receipt linkage
- [x] **Kurier:** surface `proof.kurierUrl` on receipts / decision receipts (tx / aggregation / job id)
- [x] **Lean alignment:** Owner-editable fields match AmountPolicy + Agent Mandate (cap, budget, paused, …)
- [x] Scripted demo agent (`pnpm agent -- --scene=all|block|allow|replay`) + Agent view “Run demo sequence”

---

## Day-before checklist

- [ ] Cold start: build → API → web → `/health` OK
- [ ] Owner set → Agent BLOCK → Agent ALLOW rehearsed
- [ ] Kurier link opens to a real submission (or recording fallback)
- [ ] Screenshot / recording backup of both views
- [ ] Wallet funded (ETH for gas + USDC for each ALLOW)
- [ ] Trust caveat line memorized

---

## Success criteria

After the demo, the audience can answer:

1. **Who** sets the spend limit? (Owner view)
2. **What** happens when the agent exceeds it? (Agent view: BLOCK + why)
3. **Where** is the proof? (Kurier submission link)

---

## Related docs

- [README.md](./README.md) — product concept and architecture
- [SETUP.md](./SETUP.md) — local setup
- [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) — live integration status
- [apps/api/README.md](./apps/api/README.md) — API modes and endpoints
- [PHASE_0_10_CHECKLIST.md](./PHASE_0_10_CHECKLIST.md) — phase completion
