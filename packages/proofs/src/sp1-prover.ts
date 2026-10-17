import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { PolicyDoc } from "@swaraj/smt";
import type { GroundBinding } from "./verifier.js";

/**
 * Drives the SP1 host binary to prove the guest over a committed gate
 * input. The guest recomputes the statement id from the same canonical
 * text the TypeScript worker computed; a mismatch aborts the proof, so
 * a successful proof is also a cross-language parity check.
 */

export interface Sp1ProverConfig {
  /** Path to the guest ELF produced by `pnpm build:sp1`. */
  elfPath: string;
  /** Path to the compiled host binary (`packages/proofs/host`). */
  hostBin: string;
}

export interface Sp1GateInput {
  policy: PolicyDoc;
  action: GroundBinding;
  policyDocDigest: string;
  expectedStatementId: string;
}

export interface Sp1ProofOutcome {
  statementId: string;
  /** Path where the host wrote the serialized proof. */
  proofPath: string;
}

export class Sp1ProverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Sp1ProverError";
  }
}

export async function proveStatementViaSp1(
  config: Sp1ProverConfig,
  input: Sp1GateInput,
): Promise<Sp1ProofOutcome> {
  const workDir = await mkdtemp(join(tmpdir(), "swaraj-sp1-"));
  try {
    const inputPath = join(workDir, "gate-input.json");
    await writeFile(inputPath, JSON.stringify(input), "utf8");

    const run = await new Promise<{ code: number; stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(config.hostBin, [config.elfPath, inputPath, "--prove"], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (chunk: Buffer) => {
        stdout += chunk.toString("utf8");
      });
      child.stderr?.on("data", (chunk: Buffer) => {
        stderr += chunk.toString("utf8");
      });
      child.on("error", reject);
      child.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
    });

    if (run.code !== 0) {
      throw new Sp1ProverError(
        `sp1 host exited ${run.code}: ${run.stderr.slice(0, 400) || run.stdout.slice(0, 400)}`,
      );
    }

    const statementId = /^statement_id=(stmt_[0-9a-f]{64})$/m.exec(run.stdout)?.[1];
    const proofPath = /^proof=(.+)$/m.exec(run.stdout)?.[1];
    if (!statementId || !proofPath) {
      throw new Sp1ProverError(`sp1 host output missing statement_id/proof: ${run.stdout.slice(0, 200)}`);
    }
    if (statementId !== input.expectedStatementId) {
      throw new Sp1ProverError(
        `guest parity failure: guest derived ${statementId}, worker derived ${input.expectedStatementId}`,
      );
    }
    await readFile(proofPath);

    return { statementId, proofPath };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
