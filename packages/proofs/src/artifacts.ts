import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Filesystem artifact store. Each proven statement lands as one JSON file
 * under the artifact root, addressed by receipt and statement id, so a
 * proof artifact survives independently of the database.
 */

export interface VerificationBundle {
  statementId: string;
  canonicalText: string;
  /** Digest of the evidence the proof was produced against, when the pipeline supplied one. */
  evidenceDigest?: string | undefined;
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
