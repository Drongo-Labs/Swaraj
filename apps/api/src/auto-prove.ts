import { openPool } from "@swaraj/database";
import { runOneProofJob } from "@swaraj/proofs";

/** Off with SWARAJ_AUTO_PROVE=0; it needs Postgres, where the proof queue lives. */
function autoProveEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SWARAJ_AUTO_PROVE !== "0" && Boolean(env.DATABASE_URL?.trim());
}

/** Whether the API should run the proof queue itself. */
export function embeddedProofServiceEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return autoProveEnabled(env) && env.SWARAJ_PROOF_SERVICE !== "external";
}

/** Drains jobs, then waits. Errors only delay the next pass, because leased jobs retry from Postgres. */
export function startProofLoop(runOne: () => Promise<unknown>, idleMs = 2000): () => Promise<void> {
  let stopped = false;
  let wake: (() => void) | undefined;
  const done = (async () => {
    while (!stopped) {
      const worked = await runOne().catch((error: unknown) => {
        console.error("[proof-service]", error);
        return undefined;
      });
      if (worked === undefined && !stopped) {
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, idleMs);
          wake = () => {
            clearTimeout(timer);
            resolve();
          };
        });
      }
    }
  })();
  return async () => {
    stopped = true;
    wake?.();
    await done;
  };
}

export function startProofService(): () => Promise<void> {
  const pool = openPool();
  const { SWARAJ_SP1_ELF: elfPath, SWARAJ_SP1_HOST_BIN: hostBin, SWARAJ_SP1_DECISION_ELF: decisionElf } = process.env;
  const stop = startProofLoop(() =>
    runOneProofJob(pool, {
      artifactRoot: process.env.SWARAJ_PROOF_ARTIFACT_ROOT ?? "./artifacts",
      ...(elfPath && hostBin ? { sp1: { elfPath, hostBin } } : {}),
      ...(decisionElf && hostBin ? { decisionSp1: { elfPath: decisionElf, hostBin } } : {}),
    }),
  );
  return async () => {
    await stop();
    await pool.close();
  };
}

export function proofStackStatus(env: NodeJS.ProcessEnv = process.env): {
  autoProve: boolean;
  sp1: string;
  zkVerify: string;
  kurier: string;
  submission: string;
  destination: string;
} {
  const sp1Ready = Boolean(env.SWARAJ_SP1_HOST_BIN?.trim() && env.SWARAJ_SP1_ELF?.trim() && env.SWARAJ_SP1_VKEYS?.trim());
  const seed = Boolean(env.ZKVERIFY_SEED_PHRASE?.trim());
  const kurierReady = Boolean(env.KURIER_API_KEY?.trim());
  const chainId = env.KURIER_CHAIN_ID?.trim();
  // Configuration presence only; it is not evidence that any live submission succeeded.
  return {
    autoProve: autoProveEnabled(env),
    sp1: sp1Ready ? "configured" : "missing_env",
    // Kurier pays for submissions, so verification needs only a read-only zkVerify session.
    zkVerify: seed ? "zkverify" : kurierReady ? "zkverify_read_only" : "missing_env",
    kurier: kurierReady ? "configured" : "missing_env",
    submission: kurierReady ? "kurier" : seed ? "zkverify_direct" : "missing_env",
    destination: kurierReady && chainId === "84532" ? "base-sepolia" : kurierReady && chainId ? `unsupported:${chainId}` : "none",
  };
}
