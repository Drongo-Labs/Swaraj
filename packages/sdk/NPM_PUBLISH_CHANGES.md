# `@swaraj/sdk` — changes needed before npm publish

Split across **Ayush**, **Kushagra**, and **Kushal**. Packaging hygiene is mostly planned; the client is **not** product-ready to publish yet.

Repo: `Drongo-Labs/Swaraj` · Package: `packages/sdk` @ `0.0.0`

---

## Who owns what

| Person | Focus | Owns until |
| --- | --- | --- |
| **Ayush** | Architecture, npm identity, contract decisions, final review | Strategy locked + green-light to publish |
| **Kushagra** | Live API alignment + SDK client features + product docs/tests | SDK talks to current gateway and is usable |
| **Kushal** | Build pipeline, package metadata, Changesets, CI publish, dry-run | Installable dual-format package on npm |

```text
Ayush (decide) ──► Kushagra (client) ──► Kushal (pack + ship)
         ▲                                    │
         └──────── review / merge ◄───────────┘
```

---

## Ayush

### Decisions (do first)

- [ ] Confirm npm scope: keep `@swaraj` or rename (`@swaraj-network` / unscoped)
- [ ] Confirm packaging strategy: **Option B — bundle `@swaraj/contracts` into SDK** (as in the master plan), leave **`zod` external**
- [ ] Confirm first-release surface: unified actions + receipts + permits only (mandates / budgets / approvals = later)
- [ ] Set up npm org access + Trusted Publishing (OIDC) or assign who holds the token

### Review / merge gates

- [ ] Review Kushagra’s SDK API PR (shapes match gateway; permits documented)
- [ ] Review Kushal’s packaging / CI PR (`publint` + arethetypeswrong clean)
- [ ] Approve Changeset → `0.1.0` and first publish

### Correct repo metadata (block wrong URLs)

```json
"repository": {
  "type": "git",
  "url": "https://github.com/Drongo-Labs/Swaraj.git",
  "directory": "packages/sdk"
},
"bugs": { "url": "https://github.com/Drongo-Labs/Swaraj/issues" },
"homepage": "https://github.com/Drongo-Labs/Swaraj/tree/main/packages/sdk#readme"
```

---

## Kushagra — done

### 1. Align SDK with the live API

- [x] `submitUnifiedAction` → `POST …/unified-actions`
- [x] `permit` on ALLOW; docs point at `@swaraj/verify` `checkPermit` / `requirePermit`
- [x] Tests cover ALLOW / BLOCK / NEEDS_APPROVAL / permit / receipts
- [x] README quickstart rewritten for real shapes
- [x] Legacy `submitAction` kept deprecated for `/actions`

### 2. Client production helpers

- [x] `SwarajHttpError` with `status`, `body`, `code`
- [x] `waitForReceipt` + `SwarajTimeoutError`
- [x] `defaultTimeoutMs` + per-call `timeoutMs` / `signal`
- [x] Env defaults (`SWARAJ_URL` / `SWARAJ_BASE_URL`, `SWARAJ_DEV_TOKEN` / `SWARAJ_API_KEY`, `SWARAJ_APPLICATION_ID`)
- [x] `pnpm --filter @swaraj/sdk test` green (10/10)

### Hand-off to Kushal

SDK source + README + tests ready for tsup / metadata / Changesets.

---

## Kushal

### 1. Build & package (after Ayush locks Option B)

- [ ] Add `tsup` to `packages/sdk`: ESM + CJS, `dts: true`, sourcemaps, `clean: true`
- [ ] Bundle `@swaraj/contracts` into SDK output; move it to `devDependencies`
- [ ] Keep **`zod` as a real dependency** (do not bundle)
- [ ] Update `package.json`:
  - `publishConfig.access: public` (+ provenance)
  - top-level `main` / `module` / `types`
  - dual `exports` (`import` / `require` / `types`)
  - `engines: >=18.0.0`
  - description, keywords, author, license, **Drongo-Labs** repository fields
  - `files: ["dist", "README.md", "LICENSE"]`
- [ ] Add `packages/sdk/LICENSE` (MIT from repo root)
- [ ] `prepack` → build
- [ ] Pass `publint` and `@arethetypeswrong/cli --pack` (node10 / node16 / bundler)

### 2. Release automation

- [ ] Add Changesets at repo root; track `@swaraj/sdk`
- [ ] `publish.yml`: **manual / tag / Changesets release PR** for first releases (not publish-on-every-`main` push)
- [ ] Dry-run: `pnpm --filter @swaraj/sdk publish --dry-run --no-git-checks`
- [ ] Pack `.tgz`, install in a scratch app; verify:
  - `import { Swaraj } from "@swaraj/sdk"`
  - `const { Swaraj } = require("@swaraj/sdk")`
- [ ] With Ayush: create Changeset for `0.1.0` and run first publish

---

## Shared sequence

1. **Ayush** — scope name + Option B + v0.1 surface  
2. **Kushagra** — live API client + helpers + docs/tests  
3. **Kushal** — tsup / metadata / Changesets / CI / dry-run  
4. **Ayush** — review both PRs  
5. **Kushal + Ayush** — publish `0.1.0`

Parallel OK after step 1: Kushagra on client while Kushal scaffolds `tsup` + package.json (merge carefully).

---

## Out of scope for first publish

- Full mandate / budget / approval management in the SDK  
- Publishing every `@swaraj/*` workspace package  
- Browser credential UX beyond README warnings  

---

## Current snapshot

| Item | Now |
| --- | --- |
| Version | `0.0.0` |
| Formats | ESM only (`tsc`) |
| Deps | `@swaraj/contracts` `workspace:*`, `zod` |
| Engines | `>=22` |
| Errors | status only |
| Receipts | single `getReceipt` |
| Docs | prototype README |
| On npm | `@swaraj/sdk` / `@swaraj/contracts` not published |
