# Swaraj Phase 2 — NEAR Runbook & Operator Guide

> **Sprint Window:** Fri 31 Oct → Sat 1 Nov 2026  
> **Lead:** Kushagra Tiwari · **Support & Operations:** Kushal  
> **Status:** NEAR payments and Ref Finance swaps run on testnet. See section 7 for limits.

---

## 1. Overview & Objective

This runbook allows any operator to clone, configure, run, and verify the **Swaraj Phase 2 NEAR Integration** independently.

Swaraj sits between autonomous AI agents and execution venues to enforce owner-defined **Agent Mandates** (fail-closed, permit/forbid policies). In Phase 2:
- The same mandate engine gates **NEAR Trading** (`REF_FINANCE_NEAR`) and **NEAR Payments** (`near_ft_transfer`).
- Every decision returns an honest product status: **`allowed`**, **`blocked`**, **`proved`**, or **`can’t prove`**.
- With `NEAR_ACCOUNT_ID` and `NEAR_PRIVATE_KEY` set on the API, permitted actions execute on chain. Without them, fixture adapters run instead and every allowed action ends at `cant_prove`, so a fixture run can never show `proved`.

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

## 4. Running the Demo Scenes (CLI)

Every scene goes through the running API, so it needs Postgres and a started API. Without `DATABASE_URL`, no receipt is stored.

```bash
# Terminal 1
pnpm db:up
export DATABASE_URL=postgresql://swaraj:<password>@127.0.0.1:5432/swaraj
export SWARAJ_DEV_TOKEN=development-test-token-at-least-32-characters
SWARAJ_FORCE_MOCK=1 pnpm --filter @swaraj/api start

# Terminal 2
export SWARAJ_DEV_TOKEN=development-test-token-at-least-32-characters
pnpm --filter @swaraj/example near-demo -- --scene=all
```

### Fixture scenes

These use [`near-mandate-combined.json`](packages/contracts/fixtures/near-mandate-combined.json).

| Scene | Action | Amount | Decision | Rule | Product status |
|---|---|---|---|---|---|
| `trade.allow` | `SPOT_TRADE` on `REF_FINANCE_NEAR` | 50 USDC | `ALLOW` | `permit_near_trade_venue` | `cant_prove` |
| `trade.block` | `SPOT_TRADE` on `REF_FINANCE_NEAR` | 100.000001 USDC | `BLOCK` | `forbid_near_trade_amount` | `blocked` |
| `payment.allow` | `PAYMENT` via `near_ft_transfer` | 1 USDC | `ALLOW` | `permit_near_payment` | `cant_prove` |
| `payment.block` | `PAYMENT` via `near_ft_transfer` | 5.000001 USDC | `BLOCK` | `forbid_near_payment_amount` | `blocked` |

### Live testnet scenes

These spend real testnet funds and use [`near-mandate-live.json`](packages/contracts/fixtures/near-mandate-live.json), which caps each action at 0.01 NEAR.

```bash
# Set on the API before starting it
export NEAR_ACCOUNT_ID=<account>.testnet NEAR_PRIVATE_KEY=ed25519:... NEAR_REF_POOL_ID=17

# Once per account, before the first swap (about 0.475 NEAR)
pnpm --filter @swaraj/example build
pnpm --filter @swaraj/example near-setup

NEAR_DEMO_RECIPIENT=<account>.testnet pnpm --filter @swaraj/example near-demo -- --scene=live.allow
pnpm --filter @swaraj/example near-demo -- --scene=live.trade
pnpm --filter @swaraj/example near-demo -- --scene=live.block
```

Nothing runs proof jobs automatically, so run the worker to move a receipt to `proved`:

```bash
pnpm proofs:worker
```

Then export the receipt and check it with no Swaraj service running:

```bash
curl -H "authorization: Bearer $SWARAJ_DEV_TOKEN" \
  http://127.0.0.1:3000/v1/applications/app_near_live/receipts/<receiptId>/bundle > bundle.json
node packages/verify/dist/cli.js bundle.json --issuer <issuer address> --near-rpc https://rpc.testnet.near.org
```

Take the issuer address from the application owner. The format is in [`spec/receipt-v1.md`](spec/receipt-v1.md).

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
| **`proved`** | `PROVED` | The worker re-derived the decision and bound the evidence. The default sink is local (`zkv_local_`), so this is not a zero-knowledge proof unless SP1 and a remote sink are configured. |
| **`cant_prove`** | `NON_PROVABLE` / `INVALIDATED` | Missing, conflicted, or unprovable evidence. Never falsely called "proved". |
| **`needs_approval`** | `NEEDS_APPROVAL` | Paused for a person. Nothing executes until they approve it with the approver token. |

---

## 7. Scope & Limits

| Feature | Status | Limits |
|---|---|---|
| 6: NEAR adapter and templates | Native transfers and Ref Finance swaps verified on testnet | `near_ft_transfer` is built and unit tested but has not run live. Mainnet is untested. |
| 7: Receipt statuses | Done | `proved` means the local sink by default |
| 8: Private Mandate | See section 8 | Standalone proof, not connected to the gateway |
| 9: MCP gateway | `swaraj-mcp-gateway` is done | Gates `tools/call` only; other MCP requests pass through |
| 10: Human approval | API, proofs and status badge | No approve button in the UI. Base trades that need approval are refused. |
| 11: Verified programs only | Done | Certificates are signed by the certifier and not compared with on-chain code |
| 12, 13: Rule checks and diff | `POST /mandates/check` | The diff reports `complete: false` when it hits its search cap |
| 14: Random testing | Done | Checks the proved characterization, and does not run the Lean model |
| 15: Public spec and checker | `spec/`, `swaraj-verify` | Blocked actions use Decision Receipts, which the bundle does not cover |
| 16: Web2 evidence | Stripe and GitHub signed webhooks | Tested with simulated signed events, not real accounts |

Other things to know:

- Proof jobs need `pnpm proofs:worker`; nothing runs them automatically.
- Tests that touch the database need Postgres. Set `SWARAJ_TEST_DATABASE_URL` to a disposable database to include the API-on-Postgres tests.
- Actions are only signature-checked when the mandate names an `agentSigner`. Without one, the API token is the only check.

---

## 8. Private Mandate

The rules stay secret, a salted commitment is public, and an SP1 proof shows an action passed them. The guest aborts on anything but ALLOW, so a blocked action has no proof.

```bash
pnpm --filter @swaraj/proofs build:sp1:private
cargo build --release --manifest-path packages/proofs/host/Cargo.toml
```

`runPrivateMandate` in `@swaraj/proofs` runs the guest, and passing `proofPath` produces a proof.

**Use Groth16 for real privacy.** SP1's default STARK proof is not guaranteed to be zero knowledge, so it should not be treated as hiding the rules. Pass `groth16: true`, or `--groth16` to the host, for the zero-knowledge wrap. Groth16 needs SP1's large circuit download on first use. It has not worked yet: one attempt on an Apple Silicon Mac failed after 75 minutes with `artifact not found`, an internal SP1 error whose cause is unknown. Do not call a Private Mandate private until a Groth16 proof verifies.

The rules stay hidden from the public, not from whoever runs the prover, because the prover reads them.

Check a proof with:

```bash
packages/proofs/host/target/release/swaraj-gate-host packages/proofs/artifacts/swaraj-private-guest --verify <proof>
```
