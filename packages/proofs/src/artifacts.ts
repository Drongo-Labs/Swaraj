import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** Stores each proven statement as a JSON file, independent of the database. */

/** The host's `--export` output: what the NEAR verifier contract's `prove` takes. */
export interface BundleProof {
  program: string;
  /** Hex-encoded public values (no 0x). */
  publicValuesHex: string;
  /** Hex-encoded proof (no 0x). */
  proofHex: string;
}

export interface VerificationBundle {
  statementId: string;
  canonicalText: string;
  /** Digest of the evidence the proof was produced against, when the pipeline supplied one. */
  evidenceDigest?: string | undefined;
  /** Groth16 export attached by the worker when the decision prover ran. */
  proof?: BundleProof | undefined;
  createdAt: string;
}

export interface ArtifactStore {
  writeBundle(receiptId: string, bundle: VerificationBundle): Promise<string>;
}

export function openArtifactStore(root: string): ArtifactStore {
  return {
    async writeBundle(receiptId, bundle) {
      const dir = join(root, receiptId);
      await mkdir(dir, { recursive: true });
      const path = join(dir, `${bundle.statementId}.json`);
      await writeFile(path, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
      return path;
    },
  };
}

/**
 * Copy a binary proof artifact (e.g. the SP1 proof file) into the store.
 */
export async function storeProofArtifact(
  root: string,
  receiptId: string,
  statementId: string,
  bytes: Uint8Array,
): Promise<string> {
  const dir = join(root, receiptId);
  await mkdir(dir, { recursive: true });
  const path = join(dir, `${statementId}.sp1.bin`);
  await writeFile(path, bytes);
  return path;
}
