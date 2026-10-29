import { spawn, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

function autoProveEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  void env;
  // The merged proof package exposes the generic runOneProofJob worker. The
  // older receipt-specific prover/service scripts were never present in either
  // branch, so spawning them would fail after an otherwise healthy API start.
  return false;
}

function spawnProofs(script: string, label: string) {
  const child = spawn("pnpm", ["--filter", "@swaraj/proofs", script], {
    cwd: root,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });
  const prefix = `[auto-prove:${label}]`;
  child.stdout?.on("data", (chunk: Buffer) => {
    process.stdout.write(`${prefix} ${chunk}`);
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    process.stderr.write(`${prefix} ${chunk}`);
  });
  return child;
}

function runScript(script: string, label: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawnProofs(script, label);
    child.on("exit", (code) => {
      const exitCode = code ?? 1;
      console.log(`[auto-prove:${label}] exited with code ${exitCode}`);
      resolve(exitCode);
    });
    child.on("error", (err) => {
      console.error(`[auto-prove:${label}] failed to start:`, err);
      reject(err);
    });
  });
}

/**
 * Fire-and-forget SP1 prove after ALLOW / BLOCK. The prover enqueues the artifact; the recurring proof
 * service (startProofService, or `pnpm --filter @swaraj/proofs worker:service`) submits it and keeps
 * polling finality, provider status and publication without further API traffic.
 * Disabled when SWARAJ_AUTO_PROVE=0 or SP1 binaries are not configured.
 */
export function scheduleAutoProve(kind: "trade" | "decision"): void {
  if (!autoProveEnabled()) {
    console.log("[auto-prove] skipped (set SWARAJ_SP1_* and leave SWARAJ_AUTO_PROVE unset/1)");
    return;
  }
  void runScript("prover:once", `prover-${kind}`)
    .then((code) => {
      if (code !== 0) console.error(`[auto-prove] prover failed (code ${code}); the ${kind} proof was not enqueued`);
    })
    .catch((err: unknown) => console.error("[auto-prove] prover error:", err));
}

/** Whether the API should supervise the recurring proof service itself. */
export function embeddedProofServiceEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return autoProveEnabled(env) && env.SWARAJ_PROOF_SERVICE !== "external";
}

/**
 * Run the recurring proof service as a supervised child process, restarting it with backoff if it
 * exits. Persisted jobs resume from Postgres on every (re)start. Returns a stop function.
 */
export function startProofService(): () => Promise<void> {
  let child: ChildProcess | undefined;
  let stopped = false;
  let restartDelayMs = 2000;
  let restartTimer: NodeJS.Timeout | undefined;
  const launch = () => {
    const started = Date.now();
    child = spawnProofs("worker:service", "proof-service");
    child.on("error", (err) => console.error("[auto-prove:proof-service] failed to start:", err));
    child.on("exit", (code) => {
      child = undefined;
      if (stopped) return;
      // A service that stayed up for a while restarts quickly; a crash loop backs off up to a minute.
      restartDelayMs = Date.now() - started > 60_000 ? 2000 : Math.min(restartDelayMs * 2, 60_000);
      console.error(`[auto-prove:proof-service] exited with code ${code ?? "null"}; restarting in ${restartDelayMs}ms`);
      restartTimer = setTimeout(launch, restartDelayMs);
    });
  };
  launch();
  return async () => {
    stopped = true;
    clearTimeout(restartTimer);
    const running = child;
    if (!running) return;
    await new Promise<void>((resolve) => {
      const force = setTimeout(() => running.kill("SIGKILL"), 30_000);
      running.once("exit", () => {
        clearTimeout(force);
        resolve();
      });
      // The service finishes its in-flight tick before exiting.
      running.kill("SIGTERM");
    });
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
