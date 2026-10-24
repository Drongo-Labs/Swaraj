import pg from "pg";

export interface PoolHandle {
  raw: pg.Pool;
  close(): Promise<void>;
}

/**
 * Open a Postgres pool from DATABASE_URL (or an explicit URL).
 */
export function openPool(url = process.env.DATABASE_URL): PoolHandle {
  if (!url) throw new Error("DATABASE_URL is not set");
  const raw = new pg.Pool({ connectionString: url, max: 5, idleTimeoutMillis: 10_000 });
  return { raw, close: () => raw.end() };
}

export async function pingDatabase(handle: PoolHandle): Promise<boolean> {
  const result = await handle.raw.query<{ one: number }>("SELECT 1 AS one");
  return result.rows[0]?.one === 1;
}
