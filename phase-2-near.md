# Swaraj Phase 2 — 48-hour sprint (31 Oct → 1 Nov)

**Window:** **Fri 31 Oct → Sat 1 Nov 2026** (hard stop end of 1 Nov)  
**Scope:** Features **6 · 7** must ship. Feature **8** only if both are demo-green by midday 1 Nov.  
**Phase 1 (done):** unified actions, permit/forbid + default deny, Agent Mandate, policy hash, Lean proofs.

**Owners:** **Kushagra** (lead / major) · **Kushal** (support)

---

## Done means (1 Nov EOD)

1. Same mandate engine gates **NEAR trading** and **NEAR payment** (ALLOW + BLOCK demos).  
2. Receipts/API show honest statuses: **allowed · blocked · proved · can’t prove**.  
3. `pnpm check` (or agreed subset) green; demo script runs without hand-waving.  
4. *(Only if spare)* Private Mandate stretch sketch or thin demo — **not** required to call Phase 2 done.

---

## Feature map

| # | Feature | Owner | Priority |
|---|---|---|---|
| **6** | NEAR adapter + payment & trading templates | **Kushagra** | **P0 — must** |
| **7** | Clear receipt statuses | **Kushagra** | **P0 — must** |
| **8** | Private Mandate | Kushagra + Kushal | **P2 — drop first if late** |
| — | Accounts, demo scenes, UI labels, runbook | **Kushal** | **P0 — must** |

**48h rule:** Prefer **mock/fixture NEAR evidence + real mandate BLOCK/ALLOW** over a fragile live chain path. Live testnet is nice-to-have; honest gate + statuses are mandatory.

---

## Day plan

### Day 1 — Friday 31 Oct

| Block | Kushagra | Kushal |
|---|---|---|
| **Morning** | NEAR adapter interface + stub/fixture execute+evidence path; trading mandate template | NEAR/.env placeholders, runbook skeleton, trade fixture JSON |
| **Afternoon** | Wire authorize → capability → adapter → receipt for **trade**; BLOCK + ALLOW scenes | `trade.block` / `trade.allow` in `apps/example`; smoke with Kushagra |
| **Evening** | Start **payment** template + same path; begin receipt status mapping (7) | Payment fixtures; UI/status label draft for four statuses |

**Day 1 exit:** Trade ALLOW + BLOCK working on NEAR-labeled path (fixture OK). Payment stub started. Status enum sketch written.

---

### Day 2 — Saturday 1 Nov

| Block | Kushagra | Kushal |
|---|---|---|
| **Morning** | Finish payment ALLOW + BLOCK; lock receipt status API/UI contract (7) | `payment.block` / `payment.allow` scenes; wire labels in web if needed |
| **Afternoon** | Harden fail-closed (missing evidence → can’t prove); tests for 6+7 | Full demo dry run + checklist; fix runbook |
| **Late afternoon** | Freeze demo; **only then** touch Private Mandate (8) if green | Submission notes / backup recording |
| **EOD** | Tag/branch ready; no open P0 bugs on demo path | Operator can run demo solo from runbook |

**Day 2 exit (hard):** Trade + payment demos · four statuses honest · CI green · runbook handed off.

---

## Kushagra — major (what you build)

### 6. NEAR adapter + templates (P0)

- Adapter behind existing venue/execute interface (`packages/evidence` / capability).  
- Templates: **trading** (amount, venue/assets) · **payments** (amount, currency, recipient).  
- Reuse Agent Mandate + default deny — **no second engine**.  
- Path: intent → mandate/SMT decision → capability on ALLOW → NEAR adapter → evidence → receipt.  
- Fixture/mock NEAR OK for 48h; fail closed on bad/missing evidence.

### 7. Receipt statuses (P0)

Map product language ↔ engine:

| Product | Engine meaning |
|---|---|
| **allowed** | Decision ALLOW (execution may be in progress / pending receipt) |
| **blocked** | Decision BLOCK + attributable rule ids (no capability) |
| **proved** | Receipt `PROVED` with real proof metadata only |
| **can’t prove** | `NON_PROVABLE` — missing/insufficient evidence |

Schemas + API + demo must never call something proved without proof.

### 8. Private Mandate (P2 — after freeze only)

Hash-only public mandate + ZK “passed hidden rules.” Skip entirely if Day 2 afternoon isn’t green on 6+7.

---

## Kushal — support (what you build)

- `.env.example` NEAR placeholders + **runbook** (start API, run four scenes).  
- Demo scenes: `trade.block` · `trade.allow` · `payment.block` · `payment.allow`.  
- Mandate fixture JSON matching Kushagra’s templates.  
- UI labels for the four statuses.  
- 1 Nov dry run + backup screen recording.  
- Do **not** redesign crypto or fork the policy language.

---

## Sync points (mandatory)

| When | Sync |
|---|---|
| **31 Oct EOD** | 15 min: trade demo works? payment plan clear? |
| **1 Nov noon** | Go/no-go on feature 8; freeze demo path if not |
| **1 Nov EOD** | Exit checklist signed off |

---

## Out of scope (do not touch these two days)

- MCP gateway (9) · human approval (10) · Web2 Stripe/GitHub (16)  
- Landing page · new action types beyond trade/payment  
- Live NEAR mainnet · perfect ZK privacy demo  

---

## Exit checklist — 1 Nov EOD

- [ ] NEAR **trading**: ALLOW + BLOCK demo  
- [ ] NEAR **payment**: ALLOW + BLOCK demo  
- [ ] Statuses: allowed / blocked / proved / can’t prove (honest)  
- [ ] CI / `pnpm check` green on sprint branch  
- [ ] Kushal runbook + four scenes runnable  
- [ ] Feature 8: done **or** explicitly deferred (write “deferred” in runbook)

---

*48-hour Phase 2 plan. Kushagra owns 6+7. Kushal owns demo/ops. Feature 8 is optional under this deadline.*
