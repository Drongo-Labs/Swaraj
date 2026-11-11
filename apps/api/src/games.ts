import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const GameSlugSchema = z
  .string()
  .regex(/^[a-z][a-z0-9_-]{1,31}$/, "slug must match ^[a-z][a-z0-9_-]{1,31}$");

export const CreateGameBodySchema = z.strictObject({
  displayName: z.string().min(1).max(64),
  slug: GameSlugSchema.optional(),
  applicationId: z
    .string()
    .regex(/^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,63}$/)
    .optional(),
});

export type GameRecord = {
  slug: string;
  displayName: string;
  applicationId: string;
  mandatePath: string;
  createdAt: string;
};

type GamesRegistry = { games: GameRecord[] };

/** Repo `examples/` root. Override with SWARAJ_EXAMPLES_DIR. */
export function resolveExamplesRoot(env: NodeJS.ProcessEnv = process.env): string {
  if (env.SWARAJ_EXAMPLES_DIR?.trim()) return path.resolve(env.SWARAJ_EXAMPLES_DIR.trim());
  // Works from both apps/api/src and apps/api/dist → repo examples/
  const apiPackageRoot = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(apiPackageRoot, "../..");
  return path.join(repoRoot, "examples");
}

function registryPath(examplesRoot: string): string {
  return path.join(examplesRoot, "games.json");
}

function slugify(displayName: string): string {
  const base = displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  if (/^[a-z][a-z0-9_-]{1,31}$/.test(base)) return base;
  throw new Error("could_not_derive_slug");
}

export async function loadGamesRegistry(examplesRoot: string): Promise<GamesRegistry> {
  const file = registryPath(examplesRoot);
  const raw = await readFile(file, "utf8");
  const parsed = JSON.parse(raw) as GamesRegistry;
  if (!parsed || !Array.isArray(parsed.games)) {
    throw new Error("invalid_games_registry");
  }
  return parsed;
}

async function saveGamesRegistry(examplesRoot: string, registry: GamesRegistry): Promise<void> {
  const file = registryPath(examplesRoot);
  await writeFile(file, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
}

export async function listGames(examplesRoot: string): Promise<GameRecord[]> {
  const registry = await loadGamesRegistry(examplesRoot);
  return registry.games;
}

export async function getGame(examplesRoot: string, slug: string): Promise<GameRecord | undefined> {
  const games = await listGames(examplesRoot);
  return games.find((g) => g.slug === slug);
}

export function absoluteMandatePath(examplesRoot: string, game: GameRecord): string {
  return path.join(examplesRoot, game.mandatePath);
}

export async function readGameMandate(examplesRoot: string, game: GameRecord): Promise<unknown> {
  const file = absoluteMandatePath(examplesRoot, game);
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as unknown;
}

export async function writeGameMandate(
  examplesRoot: string,
  game: GameRecord,
  mandate: unknown,
): Promise<void> {
  const file = absoluteMandatePath(examplesRoot, game);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(mandate, null, 2)}\n`, "utf8");
}

function starterMandate(slug: string): Record<string, unknown> {
  return {
    mandateId: `${slug}_mandate_v1`,
    version: 1,
    agent: `${slug}-agent`,
    defaultEffect: "DENY",
    validFrom: 1789990000000,
    validUntil: 1900000000000,
    rules: [
      {
        ruleId: "a_forbid_wild_draw_four",
        effect: "FORBID",
        action: "APP_ACTION",
        predicates: [
          { field: "context.name", operator: "EQ", value: "play_card" },
          { field: "context.param", name: "cardValue", operator: "GT", value: "104" },
        ],
      },
      {
        ruleId: "a_permit_game_actions",
        effect: "PERMIT",
        action: "APP_ACTION",
        predicates: [
          { field: "resource.app", operator: "EQ", value: slug },
          { field: "context.name", operator: "IN", values: ["draw_card", "play_card"] },
          { field: "context.paramBool", name: "onTurn", operator: "EQ", value: true },
        ],
      },
      {
        ruleId: "forbid_off_turn",
        effect: "FORBID",
        action: "APP_ACTION",
        predicates: [{ field: "context.paramBool", name: "onTurn", operator: "EQ", value: false }],
      },
      {
        ruleId: "forbid_wager_over_cap",
        effect: "FORBID",
        action: "PAYMENT",
        predicates: [
          { field: "resource.service", operator: "EQ", value: `${slug}_wager` },
          { field: "context.amount", operator: "GT", value: "5000000" },
        ],
      },
      {
        ruleId: "permit_wager_near_in_cap",
        effect: "PERMIT",
        action: "PAYMENT",
        predicates: [
          { field: "resource.service", operator: "EQ", value: `${slug}_wager` },
          { field: "context.amount", operator: "LTE", value: "5000000" },
          { field: "context.currency", operator: "EQ", value: "USDC" },
        ],
      },
    ],
  };
}

function packageJson(slug: string, displayName: string): string {
  return `${JSON.stringify(
    {
      name: `swaraj-${slug}`,
      version: "0.0.1",
      private: true,
      type: "module",
      description: `Swaraj-governed light scaffold for ${displayName}: mandate + gateway client.`,
      scripts: {
        typecheck: "tsc --noEmit",
        "register-mandate": "tsx src/registerMandate.ts",
      },
      dependencies: {
        "@swaraj/rules": "workspace:*",
        "@swaraj/schemas": "workspace:*",
        zod: "^4.1.0",
      },
      devDependencies: {
        "@types/node": "^22.10.0",
        tsx: "^4.19.0",
        typescript: "^5.7.0",
      },
    },
    null,
    2,
  )}\n`;
}

function readme(slug: string, displayName: string, applicationId: string): string {
  return `# ${displayName}

Light Swaraj game scaffold generated from the Games dashboard.

- **Application id:** \`${applicationId}\`
- **Mandate:** \`mandate/${slug}-mandate.json\`
- **Client:** \`src/swaraj/client.ts\`

## Register the mandate

\`\`\`bash
export SWARAJ_API_URL=http://localhost:3000
export SWARAJ_DEV_TOKEN=…   # ≥32 chars
export SWARAJ_APPLICATION_ID=${applicationId}
pnpm register-mandate
\`\`\`

Edit rules in the Swaraj dashboard (Games → ${displayName}) or edit the mandate JSON directly, then Save / Activate.
`;
}

function tsconfig(): string {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        rootDir: "src",
        types: ["node"],
      },
      include: ["src/**/*.ts"],
    },
    null,
    2,
  )}\n`;
}

function mandateSchemaStub(): string {
  return `/**
 * Local re-export of Swaraj Agent Mandate schemas for offline typing.
 * Runtime validation for dashboard Activate uses @swaraj/schemas on the API.
 */
export {
  AgentMandateSchema as AgentMandateWireSchema,
  type AgentMandate as AgentMandateWire,
  type MandatePredicate,
  type MandateRule,
} from "@swaraj/schemas";
`;
}

function clientStub(): string {
  return `import type { AgentMandateWire } from "./mandateSchema.js";

export interface GatewayDecision {
  outcome: "ALLOW" | "BLOCK";
  violatedRuleIds: string[];
  matchedPermitRuleIds?: string[];
  decisionId?: string;
}

/** Thin Swaraj API client: register mandate + evaluate unified actions. */
export class SwarajClient {
  constructor(
    private readonly baseUrl: string,
    private readonly applicationId: string,
    private readonly token: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private url(path: string): string {
    return \`\${this.baseUrl.replace(/\\/$/, "")}/v1/applications/\${encodeURIComponent(this.applicationId)}\${path}\`;
  }

  private async post(path: string, body: unknown): Promise<{ status: number; json: Record<string, unknown> }> {
    const response = await this.fetchImpl(this.url(path), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: \`Bearer \${this.token}\`,
      },
      body: JSON.stringify(body),
    });
    let json: Record<string, unknown> = {};
    try {
      json = (await response.json()) as Record<string, unknown>;
    } catch {
      // Non-JSON error body: status alone decides.
    }
    return { status: response.status, json };
  }

  async registerMandate(
    mandate: AgentMandateWire,
  ): Promise<{ mandateId: string; version: number; policyHash: string; ruleCount: number }> {
    const { status, json } = await this.post("/mandates", mandate);
    if (status !== 201) {
      throw new Error(\`mandate registration failed: \${status} \${JSON.stringify(json).slice(0, 300)}\`);
    }
    return {
      mandateId: String(json.mandateId),
      version: Number(json.version),
      policyHash: String(json.policyHash),
      ruleCount: Number(json.ruleCount),
    };
  }

  async evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision> {
    let status: number;
    let json: Record<string, unknown>;
    try {
      ({ status, json } = await this.post("/unified-actions", { action: wireAction }));
    } catch (error) {
      throw new GatewayUnavailableError(error instanceof Error ? error.message : "gateway unreachable");
    }
    if (status === 400) return { outcome: "BLOCK", violatedRuleIds: ["schema.invalid"] };
    if (status === 404) return { outcome: "BLOCK", violatedRuleIds: ["mandate.not_found"] };
    if (status !== 200) return { outcome: "BLOCK", violatedRuleIds: [\`http.\${status}\`] };
    const outcome = json.decision === "ALLOW" ? "ALLOW" : "BLOCK";
    const mandate = (json.mandate ?? {}) as {
      matchedRuleIds?: string[];
      matchedPermitRuleIds?: string[];
    };
    const result: GatewayDecision = {
      outcome,
      violatedRuleIds: outcome === "BLOCK" ? (mandate.matchedRuleIds ?? []) : [],
    };
    if (outcome === "ALLOW" && mandate.matchedPermitRuleIds) {
      result.matchedPermitRuleIds = mandate.matchedPermitRuleIds;
    }
    if (typeof json.activityId === "string") result.decisionId = json.activityId;
    return result;
  }
}

export class GatewayUnavailableError extends Error {}
`;
}

function registerMandateScript(slug: string): string {
  return `import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SwarajClient } from "./swaraj/client.js";
import type { AgentMandateWire } from "./swaraj/mandateSchema.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mandatePath = path.join(root, "mandate", "${slug}-mandate.json");

const baseUrl = process.env.SWARAJ_API_URL ?? "http://localhost:3000";
const applicationId = process.env.SWARAJ_APPLICATION_ID ?? "${slug}";
const token = process.env.SWARAJ_DEV_TOKEN;
if (!token || token.length < 32) {
  throw new Error("SWARAJ_DEV_TOKEN (≥32 chars) is required");
}

const mandate = JSON.parse(await readFile(mandatePath, "utf8")) as AgentMandateWire;
const client = new SwarajClient(baseUrl, applicationId, token);
const result = await client.registerMandate(mandate);
console.log(JSON.stringify(result, null, 2));
`;
}

export async function createGameScaffold(
  examplesRoot: string,
  input: { displayName: string; slug?: string; applicationId?: string },
): Promise<GameRecord> {
  const slug = input.slug ?? slugify(input.displayName);
  const parsedSlug = GameSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    throw Object.assign(new Error("invalid_slug"), { code: "invalid_slug" as const });
  }

  const registry = await loadGamesRegistry(examplesRoot);
  if (registry.games.some((g) => g.slug === slug)) {
    throw Object.assign(new Error("game_exists"), { code: "game_exists" as const });
  }

  const gameDir = path.join(examplesRoot, slug);
  try {
    await access(gameDir);
    throw Object.assign(new Error("game_dir_exists"), { code: "game_exists" as const });
  } catch (err) {
    if ((err as { code?: string }).code === "game_exists") throw err;
    // ENOENT → ok to create
  }

  const applicationId = input.applicationId ?? slug;
  const mandateRel = `${slug}/mandate/${slug}-mandate.json`;
  const record: GameRecord = {
    slug,
    displayName: input.displayName.trim(),
    applicationId,
    mandatePath: mandateRel,
    createdAt: new Date().toISOString(),
  };

  await mkdir(path.join(gameDir, "mandate"), { recursive: true });
  await mkdir(path.join(gameDir, "src", "swaraj"), { recursive: true });

  await writeFile(path.join(gameDir, "package.json"), packageJson(slug, record.displayName), "utf8");
  await writeFile(path.join(gameDir, "README.md"), readme(slug, record.displayName, applicationId), "utf8");
  await writeFile(path.join(gameDir, "tsconfig.json"), tsconfig(), "utf8");
  await writeFile(
    path.join(gameDir, "mandate", `${slug}-mandate.json`),
    `${JSON.stringify(starterMandate(slug), null, 2)}\n`,
    "utf8",
  );
  await writeFile(path.join(gameDir, "src", "swaraj", "mandateSchema.ts"), mandateSchemaStub(), "utf8");
  await writeFile(path.join(gameDir, "src", "swaraj", "client.ts"), clientStub(), "utf8");
  await writeFile(path.join(gameDir, "src", "registerMandate.ts"), registerMandateScript(slug), "utf8");

  registry.games.push(record);
  await saveGamesRegistry(examplesRoot, registry);
  return record;
}
