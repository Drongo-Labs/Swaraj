# Swaraj Phase 2 — NEAR Runbook & Operator Guide

> **Sprint Window:** Fri 31 Oct → Sat 1 Nov 2026  
> **Lead:** Kushagra Tiwari · **Support & Operations:** Kushal  
> **Status:** P0 Shipped & Verified · Feature 8 Deferred

---

## 1. Overview & Objective

This runbook allows any operator to clone, configure, run, and verify the **Swaraj Phase 2 NEAR Integration** independently.

Swaraj sits between autonomous AI agents and execution venues to enforce owner-defined **Agent Mandates** (fail-closed, permit/forbid policies). In Phase 2:
- The same mandate engine gates **NEAR Trading** (`REF_FINANCE_NEAR`) and **NEAR Payments** (`near_ft_transfer`).
- Every decision returns an honest product status: **`allowed`**, **`blocked`**, **`proved`**, or **`can’t prove`**.
- Deterministic fixture adapters (`@swaraj/evidence` and `@swaraj/capability`) allow running complete, reproducible demos without external testnet token dependencies or RPC flakiness.

---

## 2. Prerequisites

- **Node.js**: `v20.10.0+` (v22+ or v24+ recommended)
- **Package Manager**: `pnpm` (`v9.0.0+` or `v10.0.0+`)
- **OS**: Linux, macOS, or Windows (PowerShell / Command Prompt)

Verify your environment:
```bash
node -v
pnpm -v
```

---

## 3. Installation & Build

Clone the repository and install workspace dependencies:

```bash
# 1. Install dependencies across all monorepo packages
pnpm install

# 2. Build the workspace packages in dependency order
pnpm --filter @swaraj/schemas build
pnpm --filter @swaraj/crypto build
pnpm --filter @swaraj/smt build
pnpm --filter @swaraj/contracts build
pnpm --filter @swaraj/rules build
pnpm --filter @swaraj/evidence build
pnpm --filter @swaraj/capability build
pnpm --filter @swaraj/database build
pnpm --filter @swaraj/receipts build
pnpm --filter @swaraj/proofs build
pnpm --filter @swaraj/api build
pnpm --filter @swaraj/sdk build
pnpm --filter @swaraj/example build
pnpm --filter @swaraj/web build
```

---

## 4. Running the 4 Demo Scenes (CLI)

The demo script demonstrates both **ALLOW** and **BLOCK** paths for NEAR trading and NEAR payments against [`packages/contracts/fixtures/near-mandate-combined.json`](packages/contracts/fixtures/near-mandate-combined.json).

### Run All 4 Scenes at Once
```bash
pnpm --filter @swaraj/example near-demo -- --scene=all
```

### Run Individual Scenes
```bash
# Scene 1: Trade ALLOW (50 USDC on REF_FINANCE_NEAR, limit is 100 USDC)
pnpm --filter @swaraj/example near-demo -- --scene=trade.allow

# Scene 2: Trade BLOCK (100.000001 USDC on REF_FINANCE_NEAR, exceeds limit)
pnpm --filter @swaraj/example near-demo -- --scene=trade.block

# Scene 3: Payment ALLOW (1 USDC via near_ft_transfer to vendor.near, limit is 5 USDC)
pnpm --filter @swaraj/example near-demo -- --scene=payment.allow

# Scene 4: Payment BLOCK (5.000001 USDC via near_ft_transfer, exceeds limit)
pnpm --filter @swaraj/example near-demo -- --scene=payment.block
```

### Expected Output Summary
| Scene | Action | Target / Venue | Amount | Decision | Matched Rule / Attribution | Product Status |
|---|---|---|---|---|---|---|
| `trade.allow` | `SPOT_TRADE` | `REF_FINANCE_NEAR` | 50 USDC | `ALLOW` | `permit_near_trade_venue` | `allowed` |
| `trade.block` | `SPOT_TRADE` | `REF_FINANCE_NEAR` | 100.000001 USDC | `BLOCK` | `forbid_near_trade_amount` | `blocked` |
| `payment.allow` | `PAYMENT` | `near_ft_transfer` | 1 USDC | `ALLOW` | `permit_near_payment` | `allowed` |
| `payment.block` | `PAYMENT` | `near_ft_transfer` | 5.000001 USDC | `BLOCK` | `forbid_near_payment_amount` | `blocked` |

---

## 5. Running the Interactive Demo UI

The interactive operator UI lives in `apps/web/` (React + Vite).

### Step A: Start the Swaraj API (Mock / Fixture Pipeline)
Open Terminal 1:

**On Linux / macOS:**
```bash
SWARAJ_FORCE_MOCK=1 SWARAJ_DEV_TOKEN=development-test-token-at-least-32-characters pnpm --filter @swaraj/api start
```

**On Windows (PowerShell):**
```powershell
$env:SWARAJ_FORCE_MOCK="1"; $env:SWARAJ_DEV_TOKEN="development-test-token-at-least-32-characters"; pnpm --filter @swaraj/api start
```

*The API will start listening on `http://127.0.0.1:3000`.*

### Step B: Start the Frontend UI
Open Terminal 2:
```bash
pnpm --filter @swaraj/web dev
```

*The frontend UI will start listening on `http://localhost:5173`.*

### Step C: Visual Verification in Browser
1. Open [http://localhost:5173](http://localhost:5173).
2. The header displays:
   - `API live` (green indicator).
   - Mode indicators showing pipeline state.
3. Click the **"Agent · Activity"** tab:
   - Proposed agent intents show as activity feed items.
   - Each decision displays an honest **Product Status Badge**:
     - `ALLOWED` (subtle green badge)
     - `BLOCKED` (crimson red badge)
     - `PROVED` (emerald badge with proof glow)
     - `CAN’T PROVE` (amber warning badge)
   - Selecting any row opens the **Decision Detail panel**, showing the exact rule attribution (`forbid_near_trade_amount`, etc.) and receipt status.

---

## 6. Honest Product Status Mapping (Feature 7)

Swaraj enforces strict honesty between cryptographic engine realities and user-facing statuses:

| Product Status | Engine Status | Meaning |
|---|---|---|
| **`allowed`** | `ALLOW` / `PENDING` | Action passed policy checks; capability issued; execution in flight or awaiting finality. |
| **`blocked`** | `BLOCK` | Denied by mandate (default deny or forbid rule); zero execution capability issued. Attributable rule IDs provided. |
| **`proved`** | `PROVED` | Cryptographic proof generated and verified via zkVerify/SP1. Never shown without proof metadata. |
| **`cant_prove`** | `NON_PROVABLE` / `INVALIDATED` | Missing, conflicted, or unprovable evidence. Never falsely called "proved". |

---

## 7. Scope & Feature Disposition

| Feature | Description | Sprint Status | Notes |
|---|---|---|---|
| **Feature 6** | NEAR adapter + trade & payment templates | **Shipped & Verified** | Mock venue/execution adapters + fixtures in `@swaraj/contracts` |
| **Feature 7** | Clear receipt & product statuses | **Shipped & Verified** | `productStatus` schema, API fields, and UI badge components |
| **Feature 8** | Private Mandate (ZK hidden rules) | **DEFERRED** | Dropped per sprint rule to ensure core demo stability |
| **Feature 9** | MCP Gateway | **OUT OF SCOPE** | Postponed to subsequent sprint |

---

## 8. Exit Checklist — 1 Nov EOD Signoff

- [x] NEAR **trading**: ALLOW + BLOCK demo verified (`trade.allow`, `trade.block`)
- [x] NEAR **payment**: ALLOW + BLOCK demo verified (`payment.allow`, `payment.block`)
- [x] Statuses: `allowed` / `blocked` / `proved` / `can’t prove` mapped honestly and rendered in UI
- [x] Monorepo packages build cleanly (`pnpm build` / core packages)
- [x] All 63 core unit tests pass across schemas, contracts, rules, evidence, capability
- [x] Operator Runbook provided and verified for solo execution
- [x] Feature 8: Explicitly marked as **DEFERRED** in runbook and release notes
