import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { GameSession } from "../game/session.js";

/** Minimal JSON API + static single-page UI. No framework, no build step. */

const here = dirname(fileURLToPath(import.meta.url));

export function startServer(session: GameSession, port: number): Promise<URL> {
  const html = readFileSync(join(here, "..", "..", "ui", "index.html"), "utf-8");

  const server = createServer((request, response) => {
    void (async () => {
      try {
        if (request.method === "GET" && (request.url === "/" || request.url === "/index.html")) {
          response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          response.end(html);
          return;
        }
        // Static assets (Zunno card sprites, backgrounds, sounds) — ui/assets/.
        if (request.method === "GET" && request.url?.startsWith("/assets/")) {
          const safe = request.url.replace(/\.{2,}/g, "").replace(/^\/assets\//, "");
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
            return;
          } catch {
            response.writeHead(404, { "content-type": "application/json" });
            response.end(JSON.stringify({ error: "not_found" }));
            return;
          }
        }
        if (request.method === "GET" && request.url === "/api/state") {
          response.writeHead(200, { "content-type": "application/json" });
          response.end(JSON.stringify(session.state()));
          return;
        }
        if (request.method === "POST" && (request.url === "/api/new" || request.url === "/api/play" || request.url === "/api/draw")) {
          const body = await readBody(request);
          let error: string | null = null;
          if (request.url === "/api/new") session.newGame();
          else if (request.url === "/api/play") error = await session.humanPlay(Number(body.handIndex), body.chosenColor !== undefined ? Number(body.chosenColor) : undefined);
          else if (request.url === "/api/draw") error = await session.humanDraw();
          response.writeHead(error === null ? 200 : 400, { "content-type": "application/json" });
          response.end(JSON.stringify({ error, state: session.state() }));
          return;
        }
        response.writeHead(404, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "not_found" }));
      } catch (error) {
        response.writeHead(500, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "server_error" }));
        void error;
      }
    })();
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      resolve(new URL(`http://127.0.0.1:${port}`));
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
