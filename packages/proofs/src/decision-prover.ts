import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalize, hashObject, stripSelfFields } from "@swaraj/crypto";
import { ObjectType, parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import type { BundleProof } from "./artifacts.js";

/**
 * Drives the decision guest (packages/proofs/decision-guest) for MANDATE jobs.
 * The guest recomputes the mandate/v1 statement from the canonical bytes; the
 * worker must find exactly the bundle's text or the job fails closed.
 */

export interface DecisionProverConfig {
  /** Path to the decision guest ELF (`pnpm build:sp1:decision`). */
  elfPath: string;
  /** Path to the host built with `--features native-gnark`. */
  hostBin: string;
}

/** What the decision guest reads. All strings are the exact canonical bytes. */
export interface DecisionGuestInput {
  actionWire: string;
  mandateCanonical: string;
  approvedBy?: string;
  evidenceDigest?: string;
}

/** The host's `--export` output: what the NEAR verifier contract takes. */
export type Groth16Export = BundleProof;

export interface DecisionProofOutcome {
  statement: string;
  proofBytes: Uint8Array;
  groth16: Groth16Export;
}

export class DecisionProverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DecisionProverError";
  }
}

const textDecoder = new TextDecoder();

/** Canonical bytes the guest hashes: serializeUnifiedAction / canonicalize(stripSelfFields(...)). */
export function decisionGuestInput(payload: {
  mandate: unknown;
  action: unknown;
  approvedBy?: string;
  evidenceDigest?: string;
}): DecisionGuestInput {
  const actionWire = serializeUnifiedAction(parseUnifiedAction(payload.action));
  const mandateCanonical = textDecoder.decode(
    canonicalize(stripSelfFields(ObjectType.POLICY_PROFILE, payload.mandate)),
  );
  return {
    actionWire,
    mandateCanonical,
    ...(payload.approvedBy !== undefined ? { approvedBy: payload.approvedBy } : {}),
    ...(payload.evidenceDigest !== undefined ? { evidenceDigest: payload.evidenceDigest } : {}),
  };
}

/** The hashes TypeScript records for this payload — the guest must reproduce both. */
export function expectedHashes(input: DecisionGuestInput): { intentHash: string; mandateHash: string } {
  const intentHash = `0x${createHash("sha256").update(input.actionWire, "utf8").digest("hex")}`;
  const mandateHash = hashObject(
    ObjectType.POLICY_PROFILE,
    JSON.parse(input.mandateCanonical) as unknown,
  );
  return { intentHash, mandateHash };
}

function run(hostBin: string, args: string[], cwd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(hostBin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
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
}

/**
 * Proves the decision with Groth16 and exports the verifier payload. The
 * committed statement must equal `expectedStatementText` byte for byte.
 */
export async function proveMandateDecision(
  config: DecisionProverConfig,
  input: DecisionGuestInput,
  expectedStatementText: string,
): Promise<DecisionProofOutcome> {
  const workDir = await mkdtemp(join(tmpdir(), "swaraj-decision-"));
  try {
    const inputPath = join(workDir, "decision-input.json");
    const proofPath = join(workDir, "decision.proof");
    await writeFile(inputPath, JSON.stringify(input), { mode: 0o600 });

    const proved = await run(config.hostBin, [config.elfPath, inputPath, "--prove", "--groth16", "--proof-out", proofPath], workDir);
    if (proved.code !== 0) {
      throw new DecisionProverError(
        `sp1 host exited ${proved.code}: ${proved.stderr.slice(0, 400) || proved.stdout.slice(0, 400)}`,
      );
    }
    // The committed value is the full statement text, which contains newlines.
    const marker = "statement_id=";
    const start = proved.stdout.indexOf(marker);
    if (start < 0) throw new DecisionProverError(`sp1 host output missing statement_id: ${proved.stdout.slice(0, 200)}`);
    const proofMarker = "\nproof=";
    const end = proved.stdout.indexOf(proofMarker, start);
    const statement = proved.stdout.slice(start + marker.length, end < 0 ? undefined : end);
    if (statement !== expectedStatementText) {
      throw new DecisionProverError(
        `guest parity failure: guest committed a different statement than the bundle\nguest:    ${JSON.stringify(statement)}\nexpected: ${JSON.stringify(expectedStatementText)}`,
      );
    }

    const exported = await run(config.hostBin, [config.elfPath, "--export", proofPath], workDir);
    if (exported.code !== 0) {
      throw new DecisionProverError(`sp1 host --export exited ${exported.code}: ${exported.stderr.slice(0, 400)}`);
    }
    // The host prints { program, public_values, proof }, all hex.
    const raw = JSON.parse(exported.stdout.trim().split("\n").pop() ?? "{}") as Record<string, string | undefined>;
    const groth16: Groth16Export = {
      program: raw.program ?? "",
      publicValuesHex: raw.public_values ?? "",
      proofHex: raw.proof ?? "",
    };
    if (!groth16.program || !groth16.publicValuesHex || !groth16.proofHex) {
      throw new DecisionProverError(`sp1 host --export gave no program/public_values/proof: ${exported.stdout.slice(0, 200)}`);
    }
    const proofBytes = new Uint8Array(await readFile(proofPath));
    return { statement, proofBytes, groth16 };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
