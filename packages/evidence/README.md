# @swaraj/evidence

Phase 2 venue adapter and evidence collection.

- `createMockVenueAdapter` — exact `txHash → EvidenceBundle` fixtures for CI/tests.
- `createBaseVenueAdapter` — live Base RPC: loads receipt/logs, waits for N confirmations (default 12), then sets `finalityResult: "FINAL"`. Fail-closed on missing/reverted txs and finality timeout.
- Normalize/validate and canonical `evidenceRoot` via `hashList(EVIDENCE_BUNDLE, items)`.

Integrity uses `CHAIN_STATE_PROOF` with `proofHash = blockHash` (chain-binding label). The SP1 guest still does not cryptographically verify Merkle proofs (Phase 7 boundary).
