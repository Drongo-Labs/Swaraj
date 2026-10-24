import { Swaraj } from "@swaraj/sdk";

const demo = process.argv.includes("--demo");
const live = process.argv.includes("--live");
const sceneArg = process.argv.find((a) => a.startsWith("--scene="))?.slice("--scene=".length);
const scene = sceneArg ?? (live || !demo ? "all" : "allow");

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name}, or run with --demo`);
  return value;
}

function say(line: string) {
  console.log(`\n[agent] ${line}`);
}

const mockFetch: typeof fetch = async (_url, init) =>
  Response.json(
    init?.method === "POST"
      ? { decision: "ALLOW", receiptId: "receipt_demo", status: "PENDING", capabilityId: "cap_demo" }
      : {
          receiptId: "receipt_demo",
          status: "NON_PROVABLE",
          reason: "Mock transport: offline SDK wiring only",
        },
  );

const swaraj = new Swaraj({
  baseUrl: live ? requiredEnv("SWARAJ_URL") : demo ? "https://swaraj.example" : requiredEnv("SWARAJ_URL"),
  apiKey: live || !demo ? requiredEnv(live ? "SWARAJ_DEV_TOKEN" : "SWARAJ_AGENT_KEY") : "demo-only",
  applicationId: live || !demo ? requiredEnv("SWARAJ_APPLICATION_ID") : "app_demo",
  ...(demo && !live ? { fetch: mockFetch } : {}),
});

async function propose(action: "trade.spot" | "trade.block", key: string, narration: string) {
  say(narration);
  console.log(`→ proposing ${action} (${key})`);
  const result = await swaraj.submitAction({
    action,
    input: {},
    idempotencyKey: key,
  });
  if (result.decision === "ALLOW") {
    say(`ALLOWED — capability bound; fetching receipt ${result.receiptId}`);
    console.log(result);
    console.log(await swaraj.getReceipt(result.receiptId));
  } else {
    say(
      `BLOCKED — ${result.violations.map((v) => `rule ${v.ruleId}: ${v.reason}`).join("; ")}`,
    );
    console.log(result);
  }
  return result;
}

async function runScenes() {
  const stamp = Date.now();
  if (scene === "allow" || scene === "all") {
    const allow = await propose(
      "trade.spot",
      `agent-allow-${stamp}`,
      "Within-policy trade (~10 USDC). Expect ALLOW + receipt.",
    );
    if (allow.decision !== "ALLOW") process.exitCode = 1;
  }
  if (scene === "block" || scene === "all") {
    const block = await propose(
      "trade.block",
      `agent-block-${stamp}`,
      "Over-limit trade (~600 USDC). Expect BLOCK + violated rules.",
    );
    if (block.decision !== "BLOCK") process.exitCode = 1;
  }
  if (scene === "replay" || scene === "all") {
    say("Replay / second over-limit attempt — gate must still hold.");
    const again = await propose(
      "trade.block",
      `agent-replay-${stamp}`,
      "Retrying oversized intent with a new idempotency key.",
    );
    if (again.decision !== "BLOCK") process.exitCode = 1;
  }
}

if (demo && !live) {
  console.log("OFFLINE MOCK DEMO — SDK wiring only");
  await propose("trade.spot", "invoice-1042", "Offline mock propose.");
} else {
  console.log(`TRADING AGENT — scene=${scene} against live/local API`);
  console.log("Watch Agent · Activity in the web UI for the same decisions.");
  await runScenes();
}
