import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type pg from "pg";
import type { PoolHandle } from "./pool.js";

const MIGRATIONS_DIR = fileURLToPath(new URL("../migrations", import.meta.url));

export interface MigrationStatus {
  ordinal: number;
  label: string;
  appliedAt: string;
}

function parseOrdinal(fileName: string): number | undefined {
  const match = /^(\d+)-[a-z0-9-]+\.sql$/.exec(fileName);
  return match ? Number(match[1]) : undefined;
}

/** Applies pending migrations in order, one transaction each. Safe to call repeatedly. */
export async function applyMigrations(
  handle: PoolHandle,
  dir: string = MIGRATIONS_DIR,
): Promise<MigrationStatus[]> {
  // The first migration also declares this table for compose/initdb runs,
  // but the application runner must be able to start from a completely
  // empty database before it can ask which migrations have already run.
  await handle.raw.query(`
    CREATE TABLE IF NOT EXISTS applied_migrations (
      ordinal integer PRIMARY KEY,
      label text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const files = (await readdir(dir))
    .map((name) => ({ name, ordinal: parseOrdinal(name) }))
    .filter((entry): entry is { name: string; ordinal: number } => entry.ordinal !== undefined)
    .sort((a, b) => a.ordinal - b.ordinal);

  for (const entry of files) {
    const client = await handle.raw.connect();
    try {
      const done = await client.query<{ ordinal: number }>(
        "SELECT 1 FROM applied_migrations WHERE ordinal = $1",
        [entry.ordinal],
      );
      if (!done.rowCount || done.rowCount === 0) {
        const sql = await readFile(`${dir}/${entry.name}`, "utf8");
        await client.query("BEGIN");
        try {
          await client.query(sql);
          await client.query("COMMIT");
        } catch (err) {
          await client.query("ROLLBACK");
          throw new Error(`migration ${entry.name} failed: ${String(err)}`);
        }
      }
    } finally {
      client.release();
    }
  }

  // The runtime API uses namespaced tables so it can coexist with the
  // generic ledger above. This schema is intentionally idempotent and is
  // not recorded as a numbered migration because it owns a separate model.
  const runtimeSchema = await readFile(`${dir}/runtime-schema.sql`, "utf8");
  await handle.raw.query(runtimeSchema);

  return listMigrations(handle);
}

export async function listMigrations(handle: PoolHandle): Promise<MigrationStatus[]> {
  const result = await handle.raw.query<{
    ordinal: number;
    label: string;
    applied_at: Date;
  }>(
    "SELECT ordinal, label, applied_at FROM applied_migrations ORDER BY ordinal",
  );
  return result.rows.map((row) => ({
    ordinal: row.ordinal,
    label: row.label,
    appliedAt: new Date(row.applied_at).toISOString(),
  }));
}

export type DbClient = pg.PoolClient;
