export type { CanonicalValue, Hex } from "./types.js";

export { canonicalize, toCanonicalValue } from "./canonical.js";

export { parseStrictJson } from "./strictJson.js";

export {
  domainTag,
  hashObject,
  hashList,
  verifyObjectHash,
  stripSelfFields,
  SELF_FIELDS,
} from "./hash.js";

export { KeyRegistry, deriveKeyId, type KeyEntry } from "./keys.js";

export {
  LocalKeySigner,
  signReceipt,
  verifyReceiptSignature,
  type Signer,
} from "./signing.js";

export {
  policyChangeDigest,
  signPolicyChange,
  verifyPolicyChange,
  type PolicyChangeAuthorization,
  type UnsignedPolicyChangeAuthorization,
} from "./policy-change.js";
export {
  decisionReceiptDigest,
  signDecisionReceipt,
  verifyDecisionReceiptSignature,
  type SignedDecisionReceipt,
  type UnsignedDecisionReceipt,
} from "./decision-receipt.js";
