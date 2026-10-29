import { assertLiveRuntimeEnv, resolvePipelineMode } from "./pipeline/index.js";
import { buildApp } from "./app.js";
import { embeddedProofServiceEnabled, startProofService } from "./auto-prove.js";

const mode = resolvePipelineMode();
if (mode === "base") {
  assertLiveRuntimeEnv();
}

const app = await buildApp(process.env.SWARAJ_DEV_TOKEN ?? "");
// Recurring proof worker (both queues + publication). SWARAJ_PROOF_SERVICE=external when it runs elsewhere.
const stopProofService = embeddedProofServiceEnabled() ? startProofService() : undefined;
app.addHook("onClose", async () => {
  await stopProofService?.();
});
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void app.close();
  });
}
try {
  const port = Number(process.env.PORT ?? 3000);
  const address = await app.listen({ host: "127.0.0.1", port });
  console.log(`Swaraj API: ${address} (pipeline mode: ${mode} — live Base, no mock fallback)`);
} catch (error) {
  await app.close();
  throw error;
}
