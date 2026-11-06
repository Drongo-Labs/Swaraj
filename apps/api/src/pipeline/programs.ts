import { createHash } from "node:crypto";
import type { UnifiedAction } from "@swaraj/schemas";
import { recoverAddress } from "viem";
import { z } from "zod";

/** Mandates with a `programCertifier` only reach certified programs. Signatures are checked on every action, so the store needs no trust. */

export const ProgramCertificateSchema = z.strictObject({
  program: z.string().min(1).max(256),
  codeHash: z.string().min(1).max(128),
  /** Unix milliseconds. */
  expiresAt: z.number().int().positive(),
  signature: z.string().regex(/^0x[0-9a-fA-F]{130}$/),
});
export type ProgramCertificate = z.infer<typeof ProgramCertificateSchema>;

export function certificateDigest(certificate: Omit<ProgramCertificate, "signature">): `0x${string}` {
  const message = ["swaraj/program-certificate/v1", certificate.program, certificate.codeHash, certificate.expiresAt].join("\n");
  return `0x${createHash("sha256").update(message).digest("hex")}`;
}

/** The program an action reaches; undefined when it reaches none, as with a deploy or delete. */
export function programOf(action: UnifiedAction): string | undefined {
  switch (action.action) {
    case "APP_ACTION": return action.resource.target;
    case "SPOT_TRADE": return action.resource.venue;
    case "PAYMENT": return action.resource.service;
    default: return undefined;
  }
}

export async function certificateValid(
  certificate: ProgramCertificate,
  certifier: string,
  now: number,
): Promise<boolean> {
  if (now >= certificate.expiresAt) return false;
  try {
    const recovered = await recoverAddress({
      hash: certificateDigest(certificate),
      signature: certificate.signature as `0x${string}`,
    });
    return recovered.toLowerCase() === certifier.toLowerCase();
  } catch {
    return false;
  }
}

export async function programAllowed(
  action: UnifiedAction,
  certifier: string,
  certificates: readonly ProgramCertificate[],
  now: number,
): Promise<boolean> {
  const program = programOf(action);
  if (program === undefined) return true;
  for (const certificate of certificates) {
    if (certificate.program === program && (await certificateValid(certificate, certifier, now))) return true;
  }
  return false;
}
