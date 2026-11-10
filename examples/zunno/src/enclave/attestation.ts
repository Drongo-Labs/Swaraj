import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * What the rules engine says about where it runs. Outside a TEE it says so:
 * `tee: "none"`, and a client that requires a TEE refuses to play. On an Intel
 * TDX VM (Linux configfs-tsm) it returns a hardware quote whose report data
 * binds the caller's nonce and the engine's code hash.
 */

export interface Attestation {
  tee: "none" | "tdx";
  nonce: string;
  /** SHA-256 over the enclave's source files. */
  codeHash: string;
  /** Base64 TDX quote; present only when `tee` is "tdx". */
  quote?: string;
}

const TSM_REPORTS = "/sys/kernel/config/tsm/report";

export function codeHash(files: string[]): string {
  const hash = createHash("sha256");
  for (const file of files) hash.update(readFileSync(file));
  return hash.digest("hex");
}

/** Report data: SHA-256(nonce) then the code hash, 64 bytes as TDX expects. */
export function reportData(nonce: string, code: string): Buffer {
  return Buffer.concat([createHash("sha256").update(nonce).digest(), Buffer.from(code, "hex")]);
}

export function attest(nonce: string, code: string, reports = TSM_REPORTS): Attestation {
  if (!existsSync(reports)) return { tee: "none", nonce, codeHash: code };
  // ponytail: written against the Linux configfs-tsm ABI, not yet run on a TDX VM.
  // Verify on the Google Cloud deploy before relying on it.
  // Some non-TDX Linux hosts (e.g. CI runners) expose configfs-tsm without a TDX
  // provider. If no quote can be made, say "none" honestly rather than fail.
  let entry: string | undefined;
  try {
    entry = mkdtempSync(join(reports, "zunno-"));
    writeFileSync(join(entry, "inblob"), reportData(nonce, code));
    const quote = readFileSync(join(entry, "outblob")).toString("base64");
    return { tee: "tdx", nonce, codeHash: code, quote };
  } catch {
    return { tee: "none", nonce, codeHash: code };
  } finally {
    if (entry) {
      try {
        rmdirSync(entry);
      } catch {
        // nothing to clean up
      }
    }
  }
}

/** Client side: the answer must echo our nonce, and a TEE must be present when required. */
export function checkAttestation(answer: Attestation, nonce: string, requireTee: boolean): string | null {
  if (answer.nonce !== nonce) return "attestation does not echo the nonce";
  if (requireTee && (answer.tee !== "tdx" || !answer.quote)) return "rules engine is not running in a TEE";
  // ponytail: a TDX quote is not yet verified against Intel's collateral; add that with the Google Cloud deploy.
  return null;
}
