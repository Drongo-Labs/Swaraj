import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { PolicyDoc } from "@swaraj/smt";
import type { GroundBinding } from "./verifier.js";

/** Drives the SP1 host. The guest recomputes the statement id, so a mismatch aborts the proof. */

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
  proofBytes: Uint8Array;
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
        cwd: workDir,
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

    const statementId = /^statement_id=(stmt_[0-9a-f]{64})\r?$/m.exec(run.stdout)?.[1];
    const proofLine = /^proof=([^\r\n]+)\r?$/m.exec(run.stdout)?.[1];
    if (!statementId || !proofLine) {
      throw new Sp1ProverError(`sp1 host output missing statement_id/proof: ${run.stdout.slice(0, 200)}`);
    }
    if (statementId !== input.expectedStatementId) {
      throw new Sp1ProverError(
        `guest parity failure: guest derived ${statementId}, worker derived ${input.expectedStatementId}`,
      );
    }
    // The host runs with its working directory inside ours and prints a
    // path relative to it; read the bytes now, before the cleanup below.
    const proofPath = proofLine.startsWith("/") ? proofLine : join(workDir, proofLine);
    const proofBytes = new Uint8Array(await readFile(proofPath));

    return { statementId, proofBytes };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
