import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { UnoEngine } from "../game/engine.js";
import { agentView } from "../game/table.js";
import { attest, codeHash } from "../enclave/attestation.js";

/**
 * The rules engine as a separate process: it owns the deck and both hands.
 * The human's page and `/api/*` see only the human seat; the agent reaches
 * `/agent/*` with its token and sees only its own seat. `/attestation` says
 * where the engine runs. No framework, no build step.
 */

const here = dirname(fileURLToPath(import.meta.url));

/** The code a TEE quote vouches for. */
export const ENCLAVE_SOURCES = [
  join(here, "http.ts"),
  join(here, "..", "game", "engine.ts"),
  join(here, "..", "game", "table.ts"),
  join(here, "..", "zunno", "cards.ts"),
  join(here, "..", "enclave", "attestation.ts"),
];

export interface EnclaveOptions {
  port: number;
  /** Bearer token the agent process must present. At least 32 characters. */
  agentToken: string;
  host?: string;
  /** Starts each game; tests pass a rigged engine. */
  newEngine?: () => UnoEngine;
}

export function startServer(options: EnclaveOptions): Promise<{ url: URL; close: () => Promise<void> }> {
  if (options.agentToken.length < 32) throw new Error("agent token must be at least 32 characters");
  const html = readFileSync(join(here, "..", "..", "ui", "index.html"), "utf-8");
  const code = codeHash(ENCLAVE_SOURCES);
  const newEngine = options.newEngine ?? (() => new UnoEngine());
  const expected = Buffer.from(`Bearer ${options.agentToken}`);
  let engine = newEngine();

  const server = createServer((request, response) => {
    const send = (status: number, body: unknown) => {
      response.writeHead(status, { "content-type": "application/json" });
      response.end(JSON.stringify(body));
    };
    void (async () => {
      try {
        const url = new URL(request.url ?? "/", "http://enclave");
        if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
          response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          response.end(html);
          return;
        }
        // Static assets (Zunno card sprites, backgrounds, sounds) — ui/assets/.
        if (request.method === "GET" && url.pathname.startsWith("/assets/")) {
          const safe = url.pathname.replace(/\.{2,}/g, "").replace(/^\/assets\//, "");
          const assetPath = join(here, "..", "..", "ui", "assets", safe);
          if (!assetPath.startsWith(join(here, "..", "..", "ui", "assets"))) {
            response.writeHead(403).end();
            return;
          }
          try {
            const data = readFileSync(assetPath);
            const ext = assetPath.split(".").pop() ?? "";
            const types: Record<string, string> = {
              webp: "image/webp", png: "image/png", jpg: "image/jpeg",
              mp3: "audio/mpeg", svg: "image/svg+xml",
            };
            response.writeHead(200, { "content-type": types[ext] ?? "application/octet-stream", "cache-control": "public, max-age=86400" });
            response.end(data);
          } catch {
            send(404, { error: "not_found" });
          }
          return;
        }
        if (request.method === "GET" && url.pathname === "/attestation") {
          const nonce = url.searchParams.get("nonce") ?? "";
          if (!/^[0-9a-f]{64}$/.test(nonce)) return send(400, { error: "nonce must be 32 bytes of hex" });
          return send(200, attest(nonce, code));
        }

        // The human seat: the page's own API. It never returns the agent's hand.
        if (request.method === "GET" && url.pathname === "/api/state") return send(200, engine.publicView("human"));
        if (request.method === "POST" && ["/api/new", "/api/play", "/api/draw"].includes(url.pathname)) {
          const body = await readBody(request);
          let error: string | null = null;
          if (url.pathname === "/api/new") engine = newEngine();
          else if (url.pathname === "/api/play") {
            error = engine.play("human", Number(body.handIndex), body.chosenColor !== undefined ? Number(body.chosenColor) : undefined);
          } else if (!engine.draw("human")) error = "Cannot draw right now.";
          return send(error === null ? 200 : 400, { error, state: engine.publicView("human") });
        }

        // The agent seat: token required, own hand only.
        if (url.pathname.startsWith("/agent/")) {
          const supplied = Buffer.from(request.headers.authorization ?? "");
          if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
            return send(401, { error: "unauthorized" });
          }
          if (request.method === "GET" && url.pathname === "/agent/view") return send(200, agentView(engine));
          const body = request.method === "POST" ? await readBody(request) : {};
          if (url.pathname === "/agent/play") {
            const chosen = body.chosenColor === undefined || body.chosenColor === null ? undefined : Number(body.chosenColor);
            return send(200, { error: engine.play("agent", Number(body.handIndex), chosen) });
          }
          if (url.pathname === "/agent/draw") return send(200, { ok: engine.draw("agent") });
          if (url.pathname === "/agent/log") {
            engine.log("agent", String(body.text ?? "").slice(0, 200), body.blocked === true);
            return send(200, { ok: true });
          }
        }
        send(404, { error: "not_found" });
      } catch {
        send(500, { error: "server_error" });
      }
    })();
  });

  return new Promise((resolve) => {
    server.listen(options.port, options.host ?? "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : options.port;
      resolve({
        url: new URL(`http://${options.host ?? "127.0.0.1"}:${port}`),
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}

function readBody(request: import("node:http").IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 4096) request.destroy();
    });
    request.on("end", () => {
      try {
        resolve(raw.length === 0 ? {} : (JSON.parse(raw) as Record<string, unknown>));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}
