# Integrating with Swaraj

How an application and its agents talk to Swaraj. Sections marked
**implemented** are verified by tests in this repo; the rest state the
contract the remaining pieces must honor. When in doubt, the code under
`packages/smt`, `packages/database`, `packages/proofs`, and `apps/mcp`
is the source of truth.

## Model

Swaraj sits between agents and effects. An application owner registers
actions, rules, and integrations; agents submit actions through the SDK
or MCP; Swaraj decides through the policy gateway, executes through a
controlled adapter, and emits receipts that are eventually proof-bound.

## 1. What the application owner defines

**Pending.** Action schemas, policies, trusted state sources, execution
adapters, evidence rules — activated by owner-approved configuration
changes. The policy format itself is implemented (see
`examples/json-to-smt.md`): a typed integer rule document with
assumptions, rules, and stable rule ids.

## 2. Registration and activation

**Pending** (owner-side API). The persistence layer is ready:
`policy_revisions` stores versioned rule documents with canonical
digests and a single-live-revision constraint.

## 3. Submitting an action

**Implemented and tested** (against `apps/mcp/test/pipeline-fixture.ts`,
which pins the route contract on the real packages):

```text
POST /actions
Authorization: Bearer <token>
{ "applicationId": "app_demo", "policyId": "pol_…",
  "input": { "amountCents": "25000", "limitCents": "100000" },
  "idempotencyKey": "invoice-1042" }
```

Responses:

```json
{ "decision": "ALLOW", "receiptId": "rcpt_…", "violatedRuleIds": [], "policyDigest": "pol_…" }
{ "decision": "BLOCK", "violatedRuleIds": ["amount.cap"], "policyDigest": "pol_…" }
```

Semantics, enforced by tests:

- Every field value is a decimal string; non-integer, missing, or
  unknown values fail closed to BLOCK.
- ALLOW means accepted into the execution workflow — a receipt exists in
  `PENDING`; it does not mean executed or proved.
- BLOCK is a decision, not an error: the violated rule ids come from the
  gateway's per-rule negation probes, are stored with the decision
  record, and are reproducible from the stored SMT-LIB script.
- Reusing an `idempotencyKey` returns the original receipt instead of
  creating a second economic action.

## 4. Reading receipts

**Implemented and tested:**

```text
GET /receipts/:id  → { receiptId, state, proofRef?, claim }
GET /policies/:id → { policyId, revision, digest, ruleIds }
```

| `state` | Meaning |
|---|---|
| `PENDING` | Execution/evidence/proof processing incomplete; do not report a verified outcome |
| `PROVED` | The statement was attested (and, when SP1 is configured, guest-proven); `proofRef` names the sink attestation |
| `NON_PROVABLE` | The required claim could not be established; terminal |
| `INVALIDATED` | A previously accepted claim lost validity (e.g. reorg); terminal |

Illegal transitions are rejected by a database trigger, not only by
application code, and every transition is appended to `receipt_events`.

## 5. MCP access

**Implemented.** `swaraj-mcp` (`apps/mcp`, start with `pnpm dev:mcp`)
speaks MCP over stdio and calls the API above with the same credentials
as the SDK. Requires `SWARAJ_URL` and `SWARAJ_DEV_TOKEN`.

| Tool | Arguments | Result |
|---|---|---|
| `swaraj_submit_action` | `applicationId`, `policyId`, `input` (decimal strings), optional `idempotencyKey` | Decision JSON; BLOCK carries `isError: true` with the violated rules |
| `swaraj_get_receipt` | `receiptId` | Receipt state, `proofRef`, claim |
| `swaraj_get_policy` | `policyId` | Revision, digest, rule ids |

Invalid arguments are tool results with `isError: true`; unknown tools
are JSON-RPC errors (-32602). Administration and credential provisioning
stay outside the tool surface. Hosted transport (Streamable HTTP with
the MCP authorization flow) remains planned.

## 6. Retries and configuration changes

**Partially implemented and tested** (idempotency, decision records):

- Persist the idempotency key before first submission; retries with the
  same key return the same receipt (tested).
- Every decision is stored with its SMT-LIB script, so any ALLOW/BLOCK
  is replayable against any SMT solver (tested via the pinned vectors).
- Policy versioning and stale-policy rejection land with the
  owner-side API (section 2).

## 7. Deployment topologies

Today the Compose file runs the development Postgres (the only
infrastructure service); schema migrations load automatically on first
boot and idempotently from the application. The proof worker runs
in-process (`pnpm proofs:worker`) against the same Postgres queue — no
separate queue service. Lean checking (`pnpm check:lean`) and Rust tests
(`pnpm check:rust`) belong to the development pipeline, not the runtime.
A hosted deployment bundle does not exist yet.
