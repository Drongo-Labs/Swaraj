# Swaraj — Runtime Flow

How an agent action is authorized, executed, and receipted.

```mermaid
flowchart TD
  O["1 · Owner sets Policy Profile<br/>limits · venues · assets · finality"]
  A["2 · Agent proposes Action Intent<br/>typed request — cannot bypass gate"]
  G["3 · SMT Gate<br/>check intent vs policy + state"]

  O --> A --> G

  G -->|over limit / rule fail| B["BLOCK<br/>decision receipt + rule ids<br/>no capability · nothing on chain"]
  G -->|within policy| C["4 · Capability token<br/>short-lived · single-use · intent-bound"]

  C --> E["5 · Execute on Base<br/>adapter validates capability · submits trade"]
  E --> R["6 · Receipt<br/>evidence checked · PENDING → FINAL"]
  R --> P["7 · Proof optional<br/>SP1 · zkVerify · Kurier"]

  style B fill:#fde8e8,stroke:#9b2c2c,color:#5c1515
  style C fill:#e6f4ec,stroke:#0f6b3d,color:#0a3d24
  style G fill:#eef2ef,stroke:#122018,color:#122018
  style P fill:#f7f1e4,stroke:#9a7b3c,color:#5c4a24
```

## Steps

| # | Who | What |
|---|---|---|
| 1 | Owner | Declares the Policy Profile (caps, venues, assets, finality). |
| 2 | Agent | Submits a typed Action Intent. Never holds an unrestricted execution path. |
| 3 | Swaraj | SMT gate: **ALLOW** or **BLOCK** before anything hits the chain. |
| 4 | Swaraj | On ALLOW only — issues a short-lived, single-use capability. |
| 5 | Adapter | Validates capability, executes on Base (e.g. Uniswap v3). |
| 6 | Swaraj | Builds a portable receipt from venue evidence. |
| 7 | Swaraj | Optional: prove verification over committed inputs (SP1 / zkVerify / Kurier). |

**Remember:** Policy → Intent → Gate → Capability → Execute → Receipt → Proof
