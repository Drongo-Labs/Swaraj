import type pg from "pg";

export type BudgetWindow = "DAILY" | "WEEKLY";

export type BudgetReserveInput = {
  receiptId: string;
  appId: string;
  budgetId: string;
  amount: string;
  limit: string;
  windowStart: Date;
  /** Wall clock for the spend row (ms). Defaults to Date.now(); inject in tests. */
  createdAtMs?: number;
};

export type BudgetReserveOk = {
  ok: true;
  used: string;
  remaining: string;
};

export type BudgetReserveExceeded = {
  ok: false;
  reason: "BUDGET_EXCEEDED";
  used: string;
  remaining: string;
  requested: string;
  limit: string;
};

export type BudgetReserveResult = BudgetReserveOk | BudgetReserveExceeded;

export type BudgetSpendStore = {
  tryReserve(input: BudgetReserveInput): Promise<BudgetReserveResult>;
  release(receiptId: string): Promise<void>;
  sumUsed(appId: string, budgetId: string, windowStart: Date): Promise<bigint>;
};

/** Fixed UTC window start: DAILY at 00:00 UTC, WEEKLY at Monday 00:00 UTC. */
export function budgetWindowStart(window: BudgetWindow, nowMs: number): Date {
  const d = new Date(nowMs);
  if (window === "DAILY") {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }
  const day = d.getUTCDay(); // 0 = Sunday
  const daysFromMonday = (day + 6) % 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - daysFromMonday));
}

/** ISO timestamp (Z) when the current window ends. */
export function budgetResetsAt(window: BudgetWindow, nowMs: number): string {
  const start = budgetWindowStart(window, nowMs);
  const ms = window === "DAILY" ? 86_400_000 : 7 * 86_400_000;
  return new Date(start.getTime() + ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Start of the current UTC day as unix seconds (for trade dailyTurnoverCap). */
export function utcDayStartSeconds(nowSec: number): number {
  const d = new Date(nowSec * 1000);
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
}

function asResult(used: bigint, amount: bigint, limit: bigint): BudgetReserveResult {
  const remaining = limit > used ? limit - used : 0n;
  if (used + amount > limit) {
    return {
      ok: false,
      reason: "BUDGET_EXCEEDED",
      used: used.toString(),
      remaining: remaining.toString(),
      requested: amount.toString(),
      limit: limit.toString(),
    };
  }
  return {
    ok: true,
    used: (used + amount).toString(),
    remaining: (limit - used - amount).toString(),
  };
}

/** In-memory store: one promise-chain lock per (appId, budgetId). Enough for single-process demo mode. */
export function createMemoryBudgetSpendStore(): BudgetSpendStore {
  type Row = { receiptId: string; appId: string; budgetId: string; amount: bigint; released: boolean; createdAt: number };
  const rows = new Map<string, Row>();
  const locks = new Map<string, Promise<unknown>>();

  const withLock = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    const prev = locks.get(key) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    locks.set(
      key,
      prev.then(() => gate).catch(() => gate),
    );
    await prev.catch(() => undefined);
    try {
      return await fn();
    } finally {
      release();
    }
  };

  return {
    async tryReserve(input) {
      const amount = BigInt(input.amount);
      const limit = BigInt(input.limit);
      if (amount <= 0n) throw new Error("budget amount must be positive");
      const lockKey = `${input.appId}\0${input.budgetId}`;
      return withLock(lockKey, async () => {
        if (rows.has(input.receiptId)) {
          return { ok: true as const, used: amount.toString(), remaining: "0" };
        }
        let used = 0n;
        const windowMs = input.windowStart.getTime();
        for (const row of rows.values()) {
          if (
            row.appId === input.appId &&
            row.budgetId === input.budgetId &&
            !row.released &&
            row.createdAt >= windowMs
          ) {
            used += row.amount;
          }
        }
        const result = asResult(used, amount, limit);
        if (!result.ok) return result;
        rows.set(input.receiptId, {
          receiptId: input.receiptId,
          appId: input.appId,
          budgetId: input.budgetId,
          amount,
          released: false,
          createdAt: input.createdAtMs ?? Date.now(),
        });
        return result;
      });
    },
    async release(receiptId) {
      const row = rows.get(receiptId);
      if (row) row.released = true;
    },
    async sumUsed(appId, budgetId, windowStart) {
      const windowMs = windowStart.getTime();
      let used = 0n;
      for (const row of rows.values()) {
        if (row.appId === appId && row.budgetId === budgetId && !row.released && row.createdAt >= windowMs) {
          used += row.amount;
        }
      }
      return used;
    },
  };
}

export function createPostgresBudgetSpendStore(pool: pg.Pool): BudgetSpendStore {
  return {
    async tryReserve(input) {
      const amount = BigInt(input.amount);
      const limit = BigInt(input.limit);
      if (amount <= 0n) throw new Error("budget amount must be positive");
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))", [
          input.appId,
          input.budgetId,
        ]);
        const existing = await client.query("SELECT 1 FROM budget_spends WHERE receipt_id = $1", [input.receiptId]);
        if ((existing.rowCount ?? 0) > 0) {
          await client.query("COMMIT");
          return { ok: true, used: amount.toString(), remaining: "0" };
        }
        const sum = await client.query<{ total: string }>(
          `SELECT COALESCE(sum(amount), 0)::text AS total FROM budget_spends
           WHERE app_id = $1 AND budget_id = $2 AND NOT released AND created_at >= $3`,
          [input.appId, input.budgetId, input.windowStart.toISOString()],
        );
        const used = BigInt(sum.rows[0]?.total ?? "0");
        const result = asResult(used, amount, limit);
        if (!result.ok) {
          await client.query("ROLLBACK");
          return result;
        }
        await client.query(
          `INSERT INTO budget_spends (receipt_id, app_id, budget_id, amount)
           VALUES ($1, $2, $3, $4)`,
          [input.receiptId, input.appId, input.budgetId, input.amount],
        );
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    },
    async release(receiptId) {
      await pool.query("UPDATE budget_spends SET released = true WHERE receipt_id = $1", [receiptId]);
    },
    async sumUsed(appId, budgetId, windowStart) {
      const result = await pool.query<{ total: string }>(
        `SELECT COALESCE(sum(amount), 0)::text AS total FROM budget_spends
         WHERE app_id = $1 AND budget_id = $2 AND NOT released AND created_at >= $3`,
        [appId, budgetId, windowStart.toISOString()],
      );
      return BigInt(result.rows[0]?.total ?? "0");
    },
  };
}
