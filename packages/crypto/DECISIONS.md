# Phase 1 crypto decisions

These are the day-1 decisions from the Phase 1 plan. Phase 7.11 (Rust) must match them byte for byte; `test/vectors.json` is the contract. **Proposed by Kushagra's Phase 1 work; confirm with the team before Phase 7 starts.**

| Decision | Choice | Notes |
|---|---|---|
| Hash function | **keccak256** | Native to viem/EVM; `tiny-keccak` in Rust. |
| Signature scheme | **secp256k1 over the 32-byte receipt digest** (raw ECDSA, RFC 6979 deterministic, 65-byte `r‖s‖v` hex) | The digest is already domain-separated, so no EIP-191 prefix. EIP-712 was the plan's recommendation; it can be layered on later by changing what the digest is, at the cost of a version bump. |
| Version tag | `v1` in `swaraj.v1.<TYPE>` | Any change to canonicalization, layouts or self-field tables bumps it to `v2`. |

## Layouts

- **Canonical bytes:** UTF-8 JSON, keys sorted by code point (= UTF-8 byte order), no whitespace. Strings use `JSON.stringify` escaping: `\"`, `\\`, `\b \f \n \r \t`, other control characters below U+0020 as lowercase `\u00xx`, everything else (including U+007F) literal UTF-8. Lone surrogates are rejected. Numbers are safe integers only (no `-0`); everything else large is a decimal string. No `null`, floats, `undefined`.
- **Object hash:** `keccak256("swaraj.v1." + TYPE ‖ 0x00 ‖ canonicalBytes(object minus self fields))`.
- **Self fields removed (top level only):** `intentHash`, `policyHash`, `stateHash`, `evidenceRoot`, `signature` + `receiptHash` (see `SELF_FIELDS`).
- **List commitment (evidence root):** `keccak256("swaraj.v1." + TYPE + ".list" ‖ 0x00 ‖ uint32_be(count) ‖ leaf_1 ‖ … ‖ leaf_n)` with `leaf_i = hashObject(TYPE, item_i)` as raw 32 bytes. Order is significant; the Evidence Bundle sorts items by `itemId` first.
- **Key id:** `keccak256("swaraj.v1.KEY_ID" ‖ 0x00 ‖ address20)`.
- **Receipt signing:** the signed digest is `hashObject(RECEIPT, receipt minus signature)`. `signerKeyId` is inside the signed content, so a signature cannot be re-attributed to another key id.
- **Sets:** `allowedVenues`, `allowedAssets`, evidence `items` and state `balances` must arrive already sorted and duplicate-free; the schemas reject anything else rather than silently reorder (`normalizePolicyProfile` sorts raw input first).
