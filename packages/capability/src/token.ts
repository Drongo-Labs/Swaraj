import { keccak256 } from "viem";
import { deriveKeyId, type Hex, type Signer } from "@swaraj/crypto";
import { CAPABILITY_AUDIENCE, type CapabilityClaims, type CapabilityToken } from "./types.js";

const encoder = new TextEncoder();

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/** Domain-separated digest of capability claims (no signature fields). */
export function capabilityDigest(claims: CapabilityClaims): Hex {
  const payload = JSON.stringify({
    audience: claims.audience,
    capabilityId: claims.capabilityId,
    intentHash: claims.intentHash,
    policyHash: claims.policyHash,
    accountRef: claims.accountRef,
    idempotencyKey: claims.idempotencyKey,
    amount: claims.amount,
    issuedAt: claims.issuedAt,
    expiresAt: claims.expiresAt,
  });
  return keccak256(concat(encoder.encode("swaraj.v1.CAPABILITY"), new Uint8Array([0]), encoder.encode(payload)));
}

export async function signCapability(claims: CapabilityClaims, signer: Signer): Promise<CapabilityToken> {
  const signerKeyId = deriveKeyId(signer.address);
  const signature = await signer.signDigest(capabilityDigest(claims));
  return { ...claims, signature, signerKeyId };
}

export function buildCapabilityId(intentHash: string, idempotencyKey: string): string {
  const raw = keccak256(concat(encoder.encode(intentHash), encoder.encode("|"), encoder.encode(idempotencyKey)));
  return `cap_${raw.slice(2, 18)}`;
}

export function createClaims(input: {
  capabilityId: string;
  intentHash: Hex;
  policyHash: Hex;
  accountRef: Hex;
  idempotencyKey: string;
  amount: string;
  issuedAt: number;
  expiresAt: number;
}): CapabilityClaims {
  return {
    capabilityId: input.capabilityId,
    intentHash: input.intentHash,
    policyHash: input.policyHash,
    accountRef: input.accountRef,
    idempotencyKey: input.idempotencyKey,
    audience: CAPABILITY_AUDIENCE,
    amount: input.amount,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
  };
}
