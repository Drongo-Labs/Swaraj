import { applyMigrations, openPool } from "@swaraj/database";
import { runOneProofJob } from "../dist/index.js";

const pool = openPool();
try {
  await applyMigrations(pool);
  const artifactRoot = process.env.SWARAJ_PROOF_ARTIFACT_ROOT ?? "./artifacts";

  // The SP1 guest proves the statement when the toolchain artifacts are
  // configured; otherwise the worker produces the deterministic local
  // verification bundle only.
  const hostBin = process.env.SWARAJ_SP1_HOST_BIN;
  const sp1 =
    process.env.SWARAJ_SP1_ELF !== undefined && hostBin !== undefined
      ? { elfPath: process.env.SWARAJ_SP1_ELF, hostBin }
      : undefined;
  const decisionSp1 =
    process.env.SWARAJ_SP1_DECISION_ELF !== undefined && hostBin !== undefined
      ? { elfPath: process.env.SWARAJ_SP1_DECISION_ELF, hostBin }
      : undefined;

  const outcome = await runOneProofJob(pool, { artifactRoot, sp1, decisionSp1 });
  console.log(outcome
    ? `proved ${outcome.receiptId} -> ${outcome.statementId} (${outcome.proofRef})`
    : "proof queue is empty");
} finally {
  await pool.close();
}
