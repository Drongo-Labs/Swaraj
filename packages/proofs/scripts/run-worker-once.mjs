import { applyMigrations, openPool } from "@swaraj/database";
import { runOneProofJob, type Sp1ProverConfig } from "../dist/index.js";

const pool = openPool();
try {
  await applyMigrations(pool);
  const artifactRoot = process.env.SWARAJ_PROOF_ARTIFACT_ROOT ?? "./artifacts";

  // The SP1 guest proves the statement when the toolchain artifacts are
  // configured; otherwise the worker produces the deterministic local
  // verification bundle only.
  const sp1: Sp1ProverConfig | undefined =
    process.env.SWARAJ_SP1_ELF !== undefined && process.env.SWARAJ_SP1_HOST_BIN !== undefined
      ? { elfPath: process.env.SWARAJ_SP1_ELF, hostBin: process.env.SWARAJ_SP1_HOST_BIN }
      : undefined;

  const outcome = await runOneProofJob(pool, { artifactRoot, sp1 });
  console.log(outcome
    ? `proved ${outcome.receiptId} -> ${outcome.statementId} (${outcome.proofRef})`
    : "proof queue is empty");
} finally {
  await pool.close();
}
