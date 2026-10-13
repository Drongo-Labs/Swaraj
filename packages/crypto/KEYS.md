# Receipt signing keys: identity, rotation, revocation

Every receipt carries `signerKeyId = keccak256("swaraj.v1.KEY_ID" ‖ 0x00 ‖ address)`. Verifiers hold a `KeyRegistry` of entries:

| Field | Meaning |
|---|---|
| `keyId` | Derived from `address`; the registry refuses a mismatch. |
| `address` | Lowercase secp256k1 address. |
| `validFrom` | Inclusive. Receipts with `createdAt` earlier are invalid. |
| `validUntil` | Exclusive. Omitted while the key is current. |
| `revokedAt` | Receipts with `createdAt` at or after this are invalid. Omitted unless revoked. |

A receipt verifies when its signature recovers to the registered address **and** `validFrom <= createdAt < validUntil` **and** (`revokedAt` unset **or** `createdAt < revokedAt`). Unknown keys, malformed receipts and any mismatch return `false`.

The private key comes from `SWARAJ_SIGNER_PRIVATE_KEY` (`LocalKeySigner.fromEnv`). It is never logged, serialized or inspectable. To move to KMS/HSM, implement the `Signer` interface (`address`, `signDigest`); callers do not change.

## Add a key
1. Generate the key in the target environment; record its address.
2. `registry.add({ keyId: deriveKeyId(address), address, validFrom })`, with `validFrom` set to when it goes live.
3. Publish the updated registry entries to every verifier before the key signs anything.

## Rotate (planned retirement)
1. Add the new key with `validFrom = T`.
2. At `T`, switch the signer to the new key and call `registry.retire(oldKeyId, T)`.
3. Receipts signed by the old key before `T` stay valid forever; anything the old key signs stamped `T` or later is rejected.

## Revoke (compromise)
1. Decide the earliest time the key may have been misused, `R`. Call `registry.revoke(keyId, R)`, then rotate to a new key immediately.
2. Receipts stamped before `R` remain valid; at or after `R` they are invalid and must be re-issued under a new key after review.
3. **Limitation:** `createdAt` is asserted by the signer. A thief holding the key can backdate receipts to before `R`. Choose `R` conservatively (before the earliest possible compromise) and, once receipts are anchored externally (Phase 3+/8, e.g. an on-chain or witnessed log with independent timestamps), require an anchor timestamp before honoring pre-`R` receipts from a revoked key.

`retire` and `revoke` can each be applied once per key and are never undone; correct a mistake by adding a new key.
