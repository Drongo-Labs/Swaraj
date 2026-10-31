# Swaraj — Formal Authorization and Verification for AI Agents

Swaraj is a universal formal authorization and evidence-verification layer for autonomous AI agents. It checks proposed actions against a declared policy before execution and produces portable evidence receipts afterward, under explicit evidence and finality assumptions.

[Problem](#problem) · [Example](#example) · [Current status](#current-status) · [How it works](#how-it-works) · [Getting started](#getting-started) · [Limitations](#limitations-and-trust-assumptions) · [Technical documentation](#technical-documentation)

## Problem

An AI agent with execution credentials can take actions that exceed its owner's instructions, such as spending more than an approved trading limit. Instructions in a prompt do not enforce that limit at the point of execution, and the agent's own report is not enough to verify what happened externally.

Swaraj's design puts an enforceable policy check between the agent and execution, then checks evidence from the venue before issuing a verified receipt.

## Example

Consider an owner who approves a maximum of $100 per trade on an allowed Base venue. This is an illustrative walkthrough of the intended behavior, not a live demo; policy enforcement uses integer atomic units.

| Step | Proposed action or event | Intended result |
|---|---|---|
| 1 | The agent proposes a $150 trade. | Swaraj blocks it before execution because it exceeds the limit. |
| 2 | The agent proposes a $50 trade that also passes every other policy and freshness check. | Swaraj issues a short-lived, single-use permission bound to that exact action. |
| 3 | The execution adapter validates the permission and submits the trade. | Evidence and proof collection proceed with a PENDING receipt. |
| 4 | Authoritative execution evidence meets the finality rules, and the required proof and signature checks succeed. | The TRADE_EXECUTED receipt becomes PROVED. |
| 5 | Alternatively, the trade occurs but its evidence or proof fails the requirements. | The receipt becomes NON_PROVABLE; that status does not undo the trade. |

## Current status

**Status:** Product and technical concept. This repository contains the design README; it does not yet contain a runnable Swaraj application, installation setup, or demo.

**Concept version:** 0.2 · **Concept date:** September 15, 2026.

Trading on Base is the planned first reference application for the Crypto World's Fair hackathon. A trade provides a measurable action with clear policy constraints and canonical on-chain evidence.

The [implementation gap assessment](#current-implementation-gap-assessment) describes the separate ZKReceipt reference codebase based on the inspection cited under [source basis](#source-basis). The [MVP and roadmap](#mvp-scope-and-technical-roadmap) describe work required for Swaraj; they are not a list of completed features.

## How it works

1. **Propose:** The agent submits a structured request describing the exact action, called an **Action Intent**. The owner-approved **Policy Profile** defines its limits.
2. **Authorize:** The Z3 policy gateway checks the intent against the policy and current state. A passing action receives a **capability token**: permission for that specific action, with an expiry and protections against reuse.
3. **Execute:** The execution adapter validates that permission, submits the action, and collects venue evidence.
4. **Verify:** The evidence verifier checks authenticity and finality. A zkVM produces a proof that the verification program ran correctly, and zkVerify checks the submitted proof. The receipt records the resulting claim and verification status.

Lean proofs cover reusable properties of the policy and workflow before release. Authorization happens before execution; evidence verification and receipt proofs happen afterward.

## Getting started

For now, getting started means reviewing the design and reference implementation:

1. Follow the [runtime flow](#runtime-flow) and [receipt statuses](#status-semantics) to understand the example's allow, block, and verification outcomes.
2. Read the [canonical objects](#canonical-objects), [spot-trade policy](#policy-template-spot-trade), and [security requirements](#mandatory-security-requirements) to understand the integration contract.
3. Inspect the [ZKReceipt reference repository](https://github.com/ayush4345/zkReciept) alongside the [gap assessment](#current-implementation-gap-assessment). Follow that repository's own setup instructions when exploring its code.
4. Use the [phased roadmap](#phased-roadmap) to identify implementation work, and the [technical success criteria](#technical-success-criteria) to judge completion.

## Limitations and trust assumptions

Swaraj is not a trading bot, exchange, custody service, strategy generator, or generic AI chatbot. This document is not a security audit, legal opinion, production-readiness certification, or evidence that any external venue integration is live.

The formal guarantees depend on correctly implemented and authenticated Policy Profiles, Action Intents, State Snapshots, Evidence Bundles, and execution gateways, along with correct cryptography, secure keys/storage, constrained execution credentials, and a gateway the agent cannot bypass. They do not establish that:

- The model reasoned correctly or understood the user perfectly.
- A financial strategy is profitable or suitable. ORDER_PLACED and TRADE_EXECUTED do not establish PnL, strategy intent, price quality, or best execution without a separate explicit claim and evidence model.
- External APIs, chains, exchanges, or counterparties are inherently truthful.
- A human-written policy is wise or correctly captures intended business rules.
- A proof of a receipt automatically proves an external action happened without authentic evidence.

A mathematically valid proof over false or manipulated inputs remains a valid proof of the wrong statement. Commitments and zero-knowledge proofs do not provide full confidential execution, and on-chain proof verification does not eliminate execution, custody, or market risk.

## Technical documentation

The detailed specification below defines the intended architecture and implementation requirements.

- [Architecture and guarantees](#architecture-and-guarantees)
- [Core concepts](#core-concepts) and [end-to-end flow](#end-to-end-flow)
- [Formal methods design](#formal-methods-design)
- [Trading-focused policy profiles](#trading-focused-policy-profiles)
- [Security and privacy requirements](#security-and-privacy-requirements)
- [MVP scope and technical roadmap](#mvp-scope-and-technical-roadmap)
- [Current implementation gap assessment](#current-implementation-gap-assessment)
- [Success criteria and future applications](#success-criteria-and-future-applications)

### Architecture and guarantees

#### Explicit architecture decision

Swaraj is a verifier-first architecture based on typed intents, deterministic policy enforcement, formal specifications, ZK proofs, and evidence/finality rules.

Confidentiality is optional and implemented through data minimization, encrypted off-chain storage, commitments, and zero-knowledge proof design.

#### What Swaraj establishes

Under declared assumptions, Swaraj can establish that:

- A typed agent action passed or failed a versioned formal policy.
- A permitted action followed an approved workflow.
- A proof verifier executed a deterministic validation program against committed inputs.
- Available evidence supports a domain-specific external-action claim under stated source and finality rules.

### Core concepts

#### The separation of authority

| Component | Responsibility | Cannot decide |
|---|---|---|
| Trading agent | Observes markets and proposes a structured trade | Whether it is formally authorized to execute |
| Action Intent | Canonical typed description of the proposed action | Whether the action meets policy |
| SMT gateway | Makes a fast deterministic allow/block decision under current state | Whether the policy itself is correctly designed |
| Lean proof suite | Proves properties of policy semantics, compiler, workflow, and receipt logic | Whether a concrete real-time market state is correct |
| Execution adapter | Sends an authorized action to a selected venue and retrieves evidence | Whether agent behavior was acceptable without policy authorization |
| Evidence verifier | Assesses provenance, conflicts, finality, and claim requirements | Whether unavailable or unauthenticated evidence is true |
| zkVM prover | Proves deterministic verification ran over committed inputs | Whether inputs were truthful before commitment |
| zkVerify | Verifies/aggregates submitted ZK proofs and enables portable on-chain proof references | Producing the proof, interpreting free-form policies, or validating raw solver output |

#### Canonical objects

**Action Intent**

The only action format the execution gateway accepts. It uses typed enumerations and integer units rather than unrestricted free-form strings.

Required fields include: intent ID, action type, venue, account reference, asset identifiers, atomic amount, leverage/limit parameters where applicable, expiry, idempotency key, policy version, and intent hash.

**Policy Profile**

A versioned, human-reviewed, machine-readable mandate. Example constraints: allowed venues/assets, position cap, daily turnover cap, leverage cap, slippage cap, reserve requirement, quote freshness, cooldown, finality rule, and policy expiry.

**State Snapshot**

The bounded state used for an authorization decision: balances/positions where relevant, reserved budget, used daily turnover, last action timestamp, current policy status, and evidence/quote freshness. Every snapshot is timestamped and committed.

**Evidence Bundle**

A typed, provenance-labeled set of venue artifacts. Source classes include canonical chain state, signed venue attestation, unsigned venue API, third-party indexer, and agent-local log. Acceptance rules are defined under [external evidence requirements](#external-evidence-requirements).

**Receipt**

A machine-readable output whose status is PENDING, PROVED, NON_PROVABLE, or INVALIDATED. It commits to the intent, policy, evidence, finality rule, verifier version, and proof metadata.

### End-to-end flow

#### Runtime flow

```
1. Trading agent proposes a typed Action Intent
                       ↓
2. Swaraj validates schema and input freshness
                       ↓
3. SMT policy gateway evaluates Policy + State + Intent
                       ↓
           ┌───────────┴────────────┐
           │                        │
        UNSAT                    SAT / ALLOW
           │                        │
           ▼                        ▼
   Blocked result            Capability token issued
   + violated rules                 ↓
                          Execution adapter submits trade
                                      ↓
                       Venue / chain / exchange evidence
                                      ↓
                   Evidence and finality verification
                                      ↓
             zkVM proves deterministic receipt verification
                                      ↓
                      zkVerify verifies / aggregates proof
                                      ↓
           Portable receipt: PROVED / NON_PROVABLE / INVALIDATED
```

#### Required execution rule

An execution adapter must accept only a valid, short-lived capability bound to the exact action intent hash, policy hash, account scope, expiry, and idempotency key. The agent must not hold a second unrestricted execution path.

#### Evidence flow

1. Collect raw venue artifacts.
2. Normalize them into typed evidence items.
3. Validate source class, timestamp, integrity, and required evidence tags.
4. Detect conflicts and fail closed where conflict rules require it.
5. Apply venue-specific finality policy.
6. Produce a canonical evidence root.
7. Run the deterministic verifier program on intent, policy, snapshot, and evidence root.
8. Generate a proof and receipt.

#### Status semantics

| Status | Meaning |
|---|---|
| PENDING | Request accepted; evidence/proof collection not complete |
| PROVED | The deterministic verifier accepted committed inputs and the proof was verified under declared assumptions |
| NON_PROVABLE | Evidence, source quality, finality, schema, policy, or proof requirements failed; this is not proof of wrongdoing |
| INVALIDATED | A previously accepted claim became invalid under declared rules, such as reorg/finality rollback or policy invalidation |

### Formal methods design

#### SMT / Z3 — runtime authorization

SMT is the primary runtime control. It checks each proposed action immediately before any external effect.

**Typical constraints**

- `venue ∈ allowed_venues`
- `asset ∈ allowed_assets`
- `trade_value × 10,000 ≤ portfolio_value × max_position_bps`
- `daily_turnover + trade_value ≤ daily_turnover_cap`
- `estimated_slippage_bps ≤ maximum_slippage_bps`
- `leverage ≤ maximum_leverage`
- `current_time ≤ mandate_expiry`
- `current_time - last_trade_time ≥ cooldown_seconds`
- `quote_age_seconds ≤ quote_freshness_limit`
- `pending_reservations + trade_value ≤ remaining_budget`

**Design rules**

- Use integers: atomic asset units, basis points, integer timestamps, and block heights.
- Do not use floating-point values for policy enforcement.
- Policy and action fields must be typed/enumerated wherever feasible.
- Generate a reproducible SMT-LIB query for each decision.
- Store result, policy hash, state hash, action intent hash, and unsat-core explanation.
- Treat unknown, missing, malformed, stale, or contradictory safety-critical inputs as block conditions.

**Output**

ALLOW with a capability token, or BLOCK with policy IDs and a safe explanation. Solver results are not themselves ZK proofs.

#### Lean 4 — verify the framework, not every trade

Lean verifies reusable properties before policy release or runtime deployment.

**Lean proof targets**

- Policy DSL correctness: well-typed policies compile deterministically.
- Compiler soundness: compiled SMT constraints preserve the declared policy semantics for the supported policy subset.
- Monotonic restriction: adding a restrictive rule cannot enlarge action permissions.
- Lifecycle safety: invalid transitions such as PENDING → PROVED without verification are impossible in the model.
- Receipt binding: a receipt cannot remain valid if its intent, policy, evidence root, or verifier reference changes.
- Information flow: private-labeled values cannot reach public receipt fields without an approved declassification rule.
- Execution sequence: signing/execution requires prior successful authorization for the identical intent.

Natural language can help draft a policy but cannot directly become production policy. Every policy must be translated to a typed representation, reviewed, compiled, tested, versioned, and approved.

#### zkVM — prove deterministic verification execution

Implement a deterministic verifier program that receives committed inputs and validates:

- Policy hash and policy version.
- Intent hash and typed action fields.
- State snapshot hash and freshness.
- SMT decision/certificate or independently re-evaluated supported constraints.
- Evidence root and evidence admissibility.
- Venue/finality policy.
- Correct construction of the receipt claim.

The zkVM outputs commitments only. It must not expose strategy, balance, position size, or raw account identifiers unless the use case intentionally chooses disclosure.

#### zkVerify — public proof verification

Submit actual SP1, Risc0, Groth16, UltraHonk, or other supported proofs to zkVerify. Register/version verification keys and include public-input commitments. zkVerify verifies and can aggregate proofs.

### Trading-focused policy profiles

#### Policy template: spot trade

- Allowed venue and chain.
- Allowed input/output assets.
- Maximum trade amount in atomic units.
- Maximum percentage of portfolio in basis points.
- Maximum daily turnover.
- Maximum slippage.
- Minimum liquidity and quote freshness.
- Allowed order type.
- Price-impact ceiling.
- Cooldown and maximum trades per interval.
- Policy expiry and emergency pause flag.

#### Policy template: perpetual trade

All spot controls plus:

- Maximum leverage.
- Maximum notional and margin.
- Maximum open interest exposure.
- Required stop-loss/take-profit policy if supported by venue.
- Liquidation-distance safety threshold.
- Funding-rate bounds.
- Position direction / net exposure constraints.

#### Policy template: cross-venue execution

- Approved source and destination venues.
- Asset and route allowlist.
- Maximum bridge/execution fee.
- Maximum expected settlement duration.
- Partial-execution and timeout rules.
- Required evidence/finality per leg.
- Explicit halt behavior when any leg becomes uncertain.

#### Policy template: evidence acceptance

- Required evidence tags for each claim.
- Source-class precedence.
- Whether unsigned APIs are supplementary only.
- Required confirmation depth, settlement/finality condition, or venue-specific finality rule.
- Maximum evidence age.
- Conflict behavior: default NON_PROVABLE.

#### First supported claims

- **ORDER_PLACED**: authoritative venue acceptance supports that a placement attempt was accepted.
- **TRADE_EXECUTED**: authoritative execution artifacts support that a fill/execution occurred.

### Security and privacy requirements

#### Mandatory security requirements

- The agent has no direct unrestricted execution credential.
- Execution capability is short-lived, single-use, audience-bound, intent-bound, and policy-bound.
- Every policy/action/state/evidence object has canonical serialization and domain-separated hash commitments.
- State reservations and idempotency protections are durable across restart.
- Policy changes, key changes, and verifier-key changes are versioned and owner-authorized.
- Unknown input, solver failure, proof failure, evidence conflict, or finality uncertainty fails closed.
- Raw signatures must replace placeholder hashes before any production integrity claim.
- Prover/verifier implementation must be independently tested against altered public inputs, altered evidence, old keys, replayed receipts, and invalid proof artifacts.

#### Privacy requirements without an enclave

- Encrypt sensitive records at rest and in transit.
- Avoid sending raw balances, strategies, account identifiers, or full trade records to unnecessary providers.
- Use commitments as zkVM public inputs; retain raw data only in controlled storage.
- Enforce data labels and public/private receipt fields.
- Offer minimal selective disclosure for auditors/integrators.
- Clearly explain residual privacy leakage from venue trades, timing, public-chain state, IP/RPC metadata, and counterparties.

#### External evidence requirements

- Prefer canonical chain state or cryptographically authenticated venue evidence.
- Unsigned APIs and indexers are supplementary unless explicitly allowed by a claim policy.
- Agent-local logs can support debugging but cannot establish an external truth claim on their own.
- CEX integrations require explicit source-authenticity design, such as authenticated API evidence or a carefully evaluated zkTLS approach.

### MVP scope and technical roadmap

#### MVP: formal trade authorization plus post-trade receipt

Support one chain-based venue first. Prefer a venue where canonical on-chain evidence is readily available, rather than a CEX or multi-leg cross-chain strategy.

**MVP requirements**

- Typed Action Intent and Policy Profile schemas.
- Integer-safe SMT/Z3 policy gateway.
- One policy template for an on-chain spot trade.
- Single execution adapter gated by intent-bound capability tokens.
- Evidence collector for canonical chain state.
- Durable receipt lifecycle and idempotency/retry handling.
- ORDER_PLACED and TRADE_EXECUTED claims.
- Real zkVM proof generation for the deterministic verifier program.
- zkVerify submission and proof-status tracking.
- Receipt viewer that clearly shows proof status and declared assumptions.

**MVP exclusions**

- Full LLM-inference proofs.
- Automated natural-language policy deployment.
- CEX proof support.
- Cross-chain trading.

The [limitations and trust assumptions](#limitations-and-trust-assumptions) and [mandatory security requirements](#mandatory-security-requirements) also apply to the MVP.

#### Phased roadmap

**Phase 0 — repair verification integrity**

Replace synthetic venue adapters, hash-only proof metadata, and hash-based pseudo-signatures with explicit development mocks and real implementations. Add canonical serialization and a real digital-signature scheme for receipts.

**Phase 1 — SMT trade gateway**

Add typed schemas, policy compiler, Z3 authorization, capability tokens, durable reservations, and property tests. Demonstrate allowed and blocked trades against one testnet venue.

**Phase 2 — real proof and zkVerify**

Write an SP1 verifier program, prove the deterministic verification result, submit it to zkVerify, track finalization, and bind the finalized statement to the receipt.

**Phase 3 — Lean assurance suite**

Formalize policy semantics, compiler properties, lifecycle transitions, data-flow/privacy rules, and receipt bindings. Treat Lean proofs as required release artifacts for supported policy features.

**Phase 4 — additional venues and evidence**

Add one venue at a time. Each integration must define source precedence, finality, identifier mapping, evidence normalization, adversarial tests, and failure semantics.

**Phase 5 — optional privacy extensions**

Evaluate private evidence storage, ZK selective disclosure, and authenticated CEX evidence. Do not introduce a confidential-compute platform unless product requirements change.

### Current implementation gap assessment

#### Existing strengths in ZKReceipt

The current ZKReceipt implementation already contains useful conceptual boundaries:

- Claim taxonomy distinguishing ORDER_PLACED and TRADE_EXECUTED.
- Fail-closed receipt states and non-provable reasons.
- A source-precedence policy concept.
- A receipt schema with policy, provenance, timing, proof, and integrity fields.
- An asynchronous receipt-engine structure and venue-adapter abstraction.

#### Gaps to close

| Current pattern | Why insufficient | Required change |
|---|---|---|
| Evidence-tag checks and source string checks | Does not express dynamic trading limits or authenticate evidence | Add typed evidence schemas, venue-specific validation, and policy constraints |
| Fixed policy/finality identifiers | Does not bind a receipt to a concrete active policy | Versioned Policy Profile with canonical policy hash |
| Synthetic adapters | Cannot prove real venue execution | Implement one live Base adapter and robust fixture/replay tests |
| Hash-only proof metadata | Is not an SP1/Pico/Risc0 proof | Generate and verify an actual proof artifact |
| Verifier only compares a public-input hash | Does not verify a cryptographic proof | Integrate native prover verification and proof-network verification state |
| Hash described as a signature | Does not provide cryptographic signer authenticity | Use a real asymmetric signing scheme and key identity/rotation policy |
| Lifecycle only in JSON specification | Runtime may violate intended transition rules | Implement typed lifecycle transitions and prove/model invariants |
| Free-form references/payload fields | Weakens formal safety and can carry ambiguous data | Use typed fields/enums, bounded strings, schemas, and canonical encodings |

#### Design rule

Do not issue PROVED for a development mock. Use an explicit development status or return NON_PROVABLE until proof, evidence, and signature requirements are genuinely met.

### Success criteria and future applications

#### Technical success criteria

- An agent action outside a formal policy is deterministically blocked before execution.
- A valid action can execute only with a fresh capability bound to its exact intent and active policy.
- Altering action parameters, account scope, policy, evidence root, or expiry invalidates authorization or receipt verification.
- Replays, concurrent requests, and restarts cannot bypass budgets or create duplicate economic actions in the trading reference use case.
- A valid proof verifies locally and through the selected proof-verification route with intended public-input commitments.
- Evidence conflicts, stale inputs, and finality failure return NON_PROVABLE.
- Lean proof artifacts cover supported policy/compiler/lifecycle invariants.
- Sensitive raw state is not included in public proof inputs or public receipt fields by default.

#### Future domain examples

- An autonomous payments agent cannot exceed an approved vendor budget.
- A treasury agent cannot transfer funds outside an owner-defined mandate.
- A deployment agent cannot release code before required tests and approvals exist.
- A data agent cannot export private data to an unauthorized destination.

These are future use cases. Do not claim that Swaraj supports them until their domain schemas, policy semantics, evidence models, and execution adapters are implemented.

#### Buyer hypotheses

- Agent-framework builders needing a standardized trust layer.
- Trading-agent operators needing verifiable policy compliance.
- Funds and DAOs needing restricted automation with auditable evidence.
- Protocols that want to accept agent actions only when proof-backed policy conditions are met.
- Teams operating high-impact agents across other domains after the trading reference application validates the core.

Relevant references:

- https://github.com/ayush4345/zkReciept
- https://docs.zkverify.io/architecture/mainchain/mainchain_api
- https://docs.zkverify.io/architecture/proof-submission-interface
- https://docs.zkverify.io/overview/zkverifyjs

### Phase 4 completion checklist

- [x] PostgreSQL authorization decision persistence and integration test
- [x] Deterministic replay of stored SMT-LIB
- [x] Owner-authorized policy-version changes
- [x] Boundary/property tests for supported policy constraints

## Phases 8–9: proof worker and Decision Receipts

See [`INTEGRATION_STATUS.md`](./INTEGRATION_STATUS.md), [`packages/proofs/PHASE8_STATUS.md`](packages/proofs/PHASE8_STATUS.md) and [`packages/proofs/PHASE9_STATUS.md`](packages/proofs/PHASE9_STATUS.md). Run `pnpm test:phase8` and `pnpm test:phase9`.

## Phase 10: Lean assurance suite

[`packages/lean/Swaraj/Phase10.lean`](packages/lean/Swaraj/Phase10.lean) kernel-checks the policy DSL compiler, monotonic restriction, receipt lifecycle and binding, declassification, authorization-before-execution and Decision Receipt properties. Run `pnpm check:lean` (requires Lean/Lake). Task-level status for Phases 0–10 is in [`PHASE_0_10_CHECKLIST.md`](./PHASE_0_10_CHECKLIST.md).
