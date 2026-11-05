# Swaraj receipt bundle v1

A receipt bundle lets anyone check a Swaraj decision without trusting or
contacting Swaraj. Get one from
`GET /v1/applications/:id/receipts/:receiptId/bundle`, then run:

```sh
swaraj-verify bundle.json --issuer <issuer address> [--near-rpc <url>]
```

The issuer address must come from the application owner, not from the bundle.
The command exits 0 when the bundle is valid and 1 when it is not.

## Fields

| Field | Meaning |
|---|---|
| `version` | `swaraj/receipt-bundle/v1` |
| `receiptId` | Receipt identifier |
| `state` | Must be `PROVED` |
| `proofRef` | Reference from the proof sink |
| `action` | The unified action as submitted |
| `mandate` | The Agent Mandate that decided it |
| `intentHash` | `0x` + SHA-256 of the canonical action serialization |
| `mandateHash` | `hashObject(POLICY_PROFILE, mandate)` |
| `decision` | `ALLOW`, or `NEEDS_APPROVAL` for an action a person approved |
| `matchedRuleIds` | Rule ids that decided it |
| `approvedBy` | Who approved a `NEEDS_APPROVAL` decision |
| `evidenceDigest` | Root of the on-chain evidence; absent if nothing executed on chain |
| `near` | NEAR transaction hash, signer and expected effect; absent off NEAR |
| `statementText` | Canonical statement, below |
| `statementId` | `stmt_` + SHA-256 of `statementText` |
| `issuer` | Issuer address, informational |
| `signature` | Issuer secp256k1 signature, below |

## Statement

Lines joined by `\n`, with no trailing newline. Rule ids are sorted, and `-`
stands in for an empty list. The `approved_by` and `evidence` lines appear only
when their fields are present.

```text
swaraj/statement/mandate/v1
intent=<intentHash>
mandate=<mandateHash>
decision=<decision>
matched=<id,id>
approved_by=<approvedBy>
evidence=<evidenceDigest>
```

## Signature

The issuer signs the SHA-256 digest of these lines, joined by `\n`:

```text
swaraj/receipt-bundle/v1
<receiptId>
<statementId>
<state>
<proofRef>
```

## What a verifier checks

1. `action` and `mandate` parse under the strict schemas.
2. `intentHash` and `mandateHash` recompute.
3. Evaluating the mandate on the action gives `decision` and `matchedRuleIds`,
   and a `NEEDS_APPROVAL` decision names an approver.
4. `statementText` and `statementId` recompute.
5. `state` is `PROVED`.
6. `signature` recovers to the expected issuer.
7. If `near` is present, its receiver and amount match the action.
8. With `--near-rpc`, the transaction is final and matches on chain.

## What a valid bundle does not show

- **The default proof sink is local.** A `zkv_local_` `proofRef` means Swaraj's
  worker re-derived the decision. It is not a zero-knowledge proof.
- **`evidenceDigest` commits to RPC data.** The light-client proof is hashed,
  and its Merkle path is not verified. `--near-rpc` trusts the chosen RPC.
- **`approvedBy` is the issuer's record.** The approver's token is checked by
  the API, and the approver does not sign the bundle.
- **Blocked actions use Decision Receipts,** which this bundle does not cover.
