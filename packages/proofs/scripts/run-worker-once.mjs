import { applyMigrations, openPool } from "@swaraj/database";
import { runOneProofJob } from "../dist/index.js";

const pool = openPool();
try {
  await applyMigrations(pool);
  const artifactRoot = process.env.SWARAJ_PROOF_ARTIFACT_ROOT ?? "./artifacts";
  const outcome = await runOneProofJob(pool, { artifactRoot });
  console.log(outcome
    ? `proved ${outcome.receiptId} -> ${outcome.statementId} (${outcome.proofRef})`
    : "proof queue is empty");
} finally {
  await pool.close();
}
