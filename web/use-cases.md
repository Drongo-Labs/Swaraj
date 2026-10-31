# Swaraj — Agent use case ideas

**Date:** 2026-10-27

Classes: **A** schema-ready · **B** compositions · **C** new actions later · **D** games

---

## A — Schema-ready

### A0. Spot trading *(live)*
Agent proposes swaps under owner caps (amount, slippage, venue, assets, budget). Over-limit trades BLOCK; in-policy trades get a one-shot capability and a receipt. Current Swaraj demo on Base / Uniswap.

### A1. Treasury / vendor payout
Finance or ops agent pays invoices and vendors. Owner sets amount/daily caps, currency, and recipient allowlists so the agent cannot send funds to a hallucinated or unknown payee.

### A2. Support refund
Customer-support agent issues refunds only within per-refund and rolling caps, and only against a real original payment id — so it cannot “goodwill” refund arbitrary amounts.

### A3. Deploy gate
Coding / DevOps agent may deploy to staging freely (within repo allowlist) but production only from approved branches (e.g. `main`). Stops “only staging” prompt rules from being ignored.

### A4. Erasure / retention
Privacy agent handles deletion requests with soft-delete only (or hard-delete only for allowlisted object types). Blocks catastrophic hard-wipes of billing or deployment records.

---

## B — Compositions

### B1. Commerce settlement desk
One policy gates a fleet: settlement agent pays sellers (`PAYMENT`); exception agent issues refunds (`REFUND`) only against settled payments; shared daily budget across both.

### B2. FinOps + deploy
Cost-aware infra agent may deploy or scale only if remaining cloud budget covers the projected spend — spend and environment bound in the same gate.

### B3. Dual-control treasury
Research agents may draft or analyze; only designated exec agents can submit money actions (`PAYMENT` / `SPOT_TRADE`). Mandate is tied to agent identity, not one god-mode chat.

---

## C — New actions later

### C1. Withdraw / transfer
Move assets off a venue or to cold wallets only to allowlisted destinations, within amount and cooldown limits.

### C2. Grant / revoke access
Security agent changes IAM or secrets only under role ceilings, resource scope, and short TTLs — no standing “admin” for the agent.

### C3. Procurement / card spend
Ops agent books POs or card charges only for allowlisted vendors/categories (MCC) under amount and cost-center caps.

### C4. Brokerage / neobank orders
Agent places off-chain orders only on allowlisted instruments within notional and pattern rules.

### C5. DeFi stake / LP
Agent changes staking or LP positions only on allowlisted protocols/pools within slippage and size limits.

### C6. Insurance / escrow claim
Agent pays claims only when bound to an approved claim id and amount ≤ approved payout.

### C7. DAO vote
Agent casts votes only on allowlisted proposals inside the voting window, with voting-power evidence.

---

## D — Games

*(Stakes, payouts, bots, and in-game economy — not move legality or RNG fairness.)*

### D1. Match / table buy-in
Agent joins paid matches, tables, or tournaments only within max stake, daily loss budget, and allowlisted venues. Blocks over-staking bots.

### D2. Prize / jackpot claim
Agent claims winnings only when bound to a finished match or ticket id, and only for the owed amount / allowlisted recipient.

### D3. Tournament payout desk
Ops agent pays bracket winners from a prize pool under place-based split rules and pool budget — wrong winner or overpay is BLOCK’d.

### D4. House / rake
House agent takes rake or seeds pots only inside float and fee-bps limits. Standing house keys without a mandate are the failure mode.

### D5. In-game economy / shop
NPC or economy agent mints, sells, or burns scarce items under item-type allowlists and mint/treasury caps — stops unbounded inflation from an agent.

### D6. Esports / fantasy stake
User-delegated agent places parlays or fantasy entries only on allowlisted events within stake and bankroll rules — “max $20/bet” enforced at the gate, not in the prompt.
