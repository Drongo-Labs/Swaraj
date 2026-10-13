import { keccak256, recoverAddress } from "viem";
import type { Hex } from "./types.js";
import { canonicalize } from "./canonical.js";
import { deriveKeyId, type KeyRegistry } from "./keys.js";
import type { Signer } from "./signing.js";

export type PolicyChangeAuthorization = {
  previousPolicyHash: Hex;
  previousPolicyVersion: number;
  newPolicyHash: Hex;
  newPolicyVersion: number;
  authorizedAt: number;
  ownerKeyId: Hex;
  signature: Hex;
};

export type UnsignedPolicyChangeAuthorization = Omit<PolicyChangeAuthorization, "signature">;

const encoder = new TextEncoder();
const DOMAIN = "swaraj.v1.POLICY_CHANGE";

function digestBytes(value: UnsignedPolicyChangeAuthorization): Hex {
  const body = canonicalize(value);
  const tag = encoder.encode(DOMAIN);
  const bytes = new Uint8Array(tag.length + 1 + body.length);
  bytes.set(tag, 0);
  bytes[tag.length] = 0;
  bytes.set(body, tag.length + 1);
  return keccak256(bytes);
}

export function policyChangeDigest(value: UnsignedPolicyChangeAuthorization): Hex {
  return digestBytes(value);
}

export async function signPolicyChange(
  value: Omit<UnsignedPolicyChangeAuthorization, "ownerKeyId"> & { ownerKeyId?: Hex },
  signer: Signer,
): Promise<PolicyChangeAuthorization> {
  const ownerKeyId = value.ownerKeyId ?? deriveKeyId(signer.address);
  if (ownerKeyId !== deriveKeyId(signer.address)) throw new Error("ownerKeyId does not match signer");
  const unsigned: UnsignedPolicyChangeAuthorization = { ...value, ownerKeyId };
  const signature = await signer.signDigest(policyChangeDigest(unsigned));
  return { ...unsigned, signature };
}

export async function verifyPolicyChange(
  authorization: PolicyChangeAuthorization,
  registry: KeyRegistry,
): Promise<boolean> {
  try {
    if (!Number.isSafeInteger(authorization.previousPolicyVersion) || authorization.previousPolicyVersion < 1) return false;
    if (!Number.isSafeInteger(authorization.newPolicyVersion) || authorization.newPolicyVersion < 1) return false;
    if (!Number.isSafeInteger(authorization.authorizedAt) || authorization.authorizedAt < 0) return false;
    if (authorization.newPolicyVersion <= authorization.previousPolicyVersion) return false;
    if (authorization.ownerKeyId !== deriveKeyId(registry.get(authorization.ownerKeyId)?.address ?? "0x0000000000000000000000000000000000000000")) return false;
    if (!registry.isValidAt(authorization.ownerKeyId, authorization.authorizedAt)) return false;
    const key = registry.get(authorization.ownerKeyId);
    if (!key) return false;
    const { signature: _signature, ...unsigned } = authorization;
    const recovered = await recoverAddress({ hash: policyChangeDigest(unsigned), signature: authorization.signature });
    return recovered.toLowerCase() === key.address.toLowerCase();
  } catch {
    return false;
  }
}
