import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Private Mandates: the rules stay secret, a salted commitment is public, and
 * an SP1 proof shows an action passed them. The guest
 * (packages/proofs/private-guest) aborts on anything but ALLOW, so a proof
 * cannot exist for a blocked action.
 */

export interface PrivateMandateInput {
  /** Exact JSON text; the commitment is over these bytes. */
  mandateJson: string;
  actionJson: string;
  salt: string;
}

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

export function mandateCommitment(input: Pick<PrivateMandateInput, "mandateJson" | "salt">): string {
  return sha256(`${input.salt}:${input.mandateJson}`);
}

/** The only thing a proof reveals. */
export function privateStatement(input: PrivateMandateInput): string {
  return [
    "swaraj/statement/private-mandate/v1",
    `mandate_commitment=${mandateCommitment(input)}`,
    `action=${sha256(input.actionJson)}`,
    "decision=ALLOW",
  ].join("\n");
}

export type PrivateProofOptions = {
  hostBin: string;
  elfPath: string;
  /** Output path; omit to run the guest without proving. */
  proofPath?: string;
  /** Wrap in Groth16, the only mode that is zero knowledge. */
  groth16?: boolean;
};

function run(command: string, args: string[]): Promise<{ code: number; stdout: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "ignore"] });
    let stdout = "";
    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString("utf8"); });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? 1, stdout }));
  });
}

/** Runs the guest. Resolves to the committed statement, or undefined if the mandate refused the action. */
export async function runPrivateMandate(input: PrivateMandateInput, options: PrivateProofOptions): Promise<string | undefined> {
  const dir = await mkdtemp(join(tmpdir(), "swaraj-private-"));
  try {
    const inputPath = join(dir, "input.json");
    await writeFile(inputPath, JSON.stringify(input), { mode: 0o600 });
    const args = [options.elfPath, inputPath];
    if (options.proofPath !== undefined) {
      args.push("--prove", "--proof-out", options.proofPath);
      if (options.groth16) args.push("--groth16");
    }
    const { code, stdout } = await run(options.hostBin, args);
    if (code !== 0) return undefined;
    const marker = "statement_id=";
    const start = stdout.indexOf(marker);
    const end = stdout.indexOf("\nproof=");
    return start < 0 ? undefined : stdout.slice(start + marker.length, end < 0 ? undefined : end).trim();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
