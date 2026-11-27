import { z } from "zod";
import {
  Identifier as identifier,
  ActionRequestSchema as actionRequest,
  ActionResultSchema as actionResult,
  ReceiptSchema as receipt,
  PolicyRecordSchema as policyRecord,
  type ActionRequest,
  type ActionResult,
  type Receipt,
  type PolicyRecord,
} from "@swaraj/contracts";

export type { ActionRequest, ActionResult, Receipt, PolicyRecord } from "@swaraj/contracts";

/** Signed ALLOW permit from the gateway. Counterparties verify with `checkPermit` from `@swaraj/verify`. */
export type Permit = {
  version: "swaraj/permit/v1";
  applicationId: string;
  action: unknown;
  intentHash: string;
  mandateHash: string;
  decision: "ALLOW";
  matchedRuleIds: string[];
  approvedBy?: string;
  receiptId?: string;
  /** Unix milliseconds. */
  expiresAt: number;
  issuer: string;
  signature: string;
};

const PermitSchema = z.object({
  version: z.literal("swaraj/permit/v1"),
  applicationId: z.string().min(1),
  action: z.unknown(),
  intentHash: z.string().min(1),
  mandateHash: z.string().min(1),
  decision: z.literal("ALLOW"),
  matchedRuleIds: z.array(z.string()),
  approvedBy: z.string().optional(),
  receiptId: z.string().optional(),
  expiresAt: z.number().int().nonnegative(),
  issuer: z.string().min(1),
  signature: z.string().min(1),
});

export type UnifiedActionAllow = {
  decision: "ALLOW";
  permit: Permit;
  productStatus?: string;
  status?: string;
  intentHash?: string;
  policyHash?: string;
  receiptId?: string;
  receipt?: { id: string; state: string };
  approvedBy?: string;
  mandate?: unknown;
  activityId?: string;
  execution?: unknown;
  [key: string]: unknown;
};

export type UnifiedActionBlock = {
  decision: "BLOCK";
  productStatus?: string;
  violations?: Array<{ ruleId: string; reason: string; budget?: Record<string, string> }>;
  intentHash?: string;
  policyHash?: string;
  mandate?: unknown;
  activityId?: string;
  decisionReceipt?: unknown;
  [key: string]: unknown;
};

export type UnifiedActionNeedsApproval = {
  decision: "NEEDS_APPROVAL";
  approvalId: string;
  productStatus?: string;
  intentHash?: string;
  policyHash?: string;
  approvalStatus?: string;
  expiresAt?: number;
  approvalSlaMs?: number;
  mandate?: unknown;
  [key: string]: unknown;
};

export type UnifiedActionResult = UnifiedActionAllow | UnifiedActionBlock | UnifiedActionNeedsApproval;

export type RequestOptions = {
  /** Per-call timeout in ms. Overrides `defaultTimeoutMs`. Ignored when `signal` is set. */
  timeoutMs?: number;
  /** Abort the request. Caller owns the signal lifecycle. */
  signal?: AbortSignal;
};

export type WaitForReceiptOptions = {
  /** Default 60_000. */
  timeoutMs?: number;
  /** Default 1_000. */
  pollIntervalMs?: number;
  signal?: AbortSignal;
};

export type SwarajOptions = {
  /** Defaults to `SWARAJ_URL` or `SWARAJ_BASE_URL`. */
  baseUrl?: string;
  /** Defaults to `SWARAJ_DEV_TOKEN` or `SWARAJ_API_KEY`. */
  apiKey?: string;
  /** Defaults to `SWARAJ_APPLICATION_ID`. */
  applicationId?: string;
  /** Default request timeout in ms (default 30_000). */
  defaultTimeoutMs?: number;
  /** Override the transport for tests or local examples. */
  fetch?: typeof globalThis.fetch;
};

const TERMINAL_RECEIPT = new Set(["PROVED", "NON_PROVABLE", "INVALIDATED", "DEV_UNVERIFIED"]);

function readEnv(name: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  const value = proc?.env?.[name];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function resolveOptions(options: SwarajOptions = {}): {
  baseUrl: string;
  apiKey: string;
  applicationId: string;
  defaultTimeoutMs: number;
  fetch?: typeof globalThis.fetch;
} {
  const baseUrl = options.baseUrl ?? readEnv("SWARAJ_URL") ?? readEnv("SWARAJ_BASE_URL");
  const apiKey = options.apiKey ?? readEnv("SWARAJ_DEV_TOKEN") ?? readEnv("SWARAJ_API_KEY");
  const applicationId = options.applicationId ?? readEnv("SWARAJ_APPLICATION_ID");
  if (!baseUrl) throw new Error("baseUrl is required (or set SWARAJ_URL / SWARAJ_BASE_URL)");
  if (!apiKey) throw new Error("apiKey is required (or set SWARAJ_DEV_TOKEN / SWARAJ_API_KEY)");
  if (!applicationId) throw new Error("applicationId is required (or set SWARAJ_APPLICATION_ID)");
  return {
    baseUrl,
    apiKey,
    applicationId,
    defaultTimeoutMs: options.defaultTimeoutMs ?? 30_000,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  };
}

export class SwarajHttpError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly code?: string;

  constructor(status: number, body: unknown = undefined) {
    const code =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: unknown }).error)
        : undefined;
    const detail =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : undefined;
    const message = code
      ? detail
        ? `Swaraj request failed with HTTP ${status}: ${code} (${detail})`
        : `Swaraj request failed with HTTP ${status}: ${code}`
      : `Swaraj request failed with HTTP ${status}`;
    super(message);
    this.name = "SwarajHttpError";
    this.status = status;
    this.body = body;
    if (code !== undefined) this.code = code;
  }
}

export class SwarajTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SwarajTimeoutError";
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new Error("aborted"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason ?? new Error("aborted"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function parseUnifiedActionResult(value: unknown): UnifiedActionResult {
  const row = z
    .object({ decision: z.enum(["ALLOW", "BLOCK", "NEEDS_APPROVAL"]) })
    .passthrough()
    .parse(value);
  if (row.decision === "ALLOW") {
    const permit = PermitSchema.parse(row.permit) as Permit;
    return { ...row, decision: "ALLOW", permit };
  }
  if (row.decision === "NEEDS_APPROVAL") {
    const approvalId = z.string().min(1).parse(row.approvalId);
    return { ...row, decision: "NEEDS_APPROVAL", approvalId };
  }
  return { ...row, decision: "BLOCK" };
}

/** HTTP client for the Swaraj gateway: unified actions, receipts, and policies. */
export class Swaraj {
  readonly #baseUrl: string;
  readonly #apiKey: string;
  readonly #applicationId: string;
  readonly #defaultTimeoutMs: number;
  readonly #fetch: typeof globalThis.fetch;

  constructor(options: SwarajOptions = {}) {
    const resolved = resolveOptions(options);
    const url = new URL(resolved.baseUrl);
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
      throw new Error("Use HTTPS, or HTTP on loopback for local development");
    }
    if (url.username || url.password || url.search || url.hash) {
      throw new Error("baseUrl must not contain credentials, a query, or a fragment");
    }
    this.#baseUrl = url.href.replace(/\/+$/, "");
    this.#apiKey = z.string().trim().min(1).parse(resolved.apiKey);
    this.#applicationId = identifier.parse(resolved.applicationId);
    this.#defaultTimeoutMs = resolved.defaultTimeoutMs;
    this.#fetch = resolved.fetch ?? globalThis.fetch;
  }

  get applicationId(): string {
    return this.#applicationId;
  }

  /**
   * Submit a unified action to the live gateway (`POST …/unified-actions`).
   * ALLOW includes a signed `permit` for counterparties; BLOCK and NEEDS_APPROVAL do not.
   */
  async submitUnifiedAction(action: unknown, options?: RequestOptions): Promise<UnifiedActionResult> {
    if (typeof action !== "object" || action === null || Array.isArray(action)) {
      throw new Error("action must be a plain object");
    }
    const json = await this.#request(
      "unified-actions",
      { method: "POST", body: JSON.stringify({ action }) },
      options,
      { okStatuses: [200, 202] },
    );
    return parseUnifiedActionResult(json);
  }

  /** @deprecated Prefer `submitUnifiedAction` against the live mandate gateway. */
  async submitAction(intent: ActionRequest, options?: RequestOptions): Promise<ActionResult> {
    const body = actionRequest.parse(intent);
    return actionResult.parse(
      await this.#request("actions", { method: "POST", body: JSON.stringify(body) }, options),
    );
  }

  async getReceipt(receiptId: string, options?: RequestOptions): Promise<Receipt> {
    const id = identifier.parse(receiptId);
    const result = receipt.parse(await this.#request(`receipts/${id}`, { method: "GET" }, options));
    if (result.receiptId !== id) throw new Error("Receipt ID does not match the request");
    return result;
  }

  /**
   * Poll `getReceipt` until the receipt reaches a terminal status or `timeoutMs` elapses.
   * Terminal: PROVED, NON_PROVABLE, INVALIDATED, DEV_UNVERIFIED.
   */
  async waitForReceipt(receiptId: string, options: WaitForReceiptOptions = {}): Promise<Receipt> {
    const timeoutMs = options.timeoutMs ?? 60_000;
    const pollIntervalMs = options.pollIntervalMs ?? 1_000;
    if (timeoutMs <= 0) throw new Error("timeoutMs must be positive");
    if (pollIntervalMs <= 0) throw new Error("pollIntervalMs must be positive");
    const started = Date.now();
    for (;;) {
      if (options.signal?.aborted) throw options.signal.reason ?? new Error("aborted");
      const current = await this.getReceipt(
        receiptId,
        options.signal ? { signal: options.signal } : {},
      );
      if (TERMINAL_RECEIPT.has(current.status)) return current;
      const remaining = timeoutMs - (Date.now() - started);
      if (remaining <= 0) {
        throw new SwarajTimeoutError(
          `Timed out after ${timeoutMs}ms waiting for receipt ${receiptId} (last status: ${current.status})`,
        );
      }
      await sleep(Math.min(pollIntervalMs, remaining), options.signal);
    }
  }

  async getPolicy(policyId: string, options?: RequestOptions): Promise<PolicyRecord> {
    const id = identifier.parse(policyId);
    return policyRecord.parse(await this.#request(`policies/${id}`, { method: "GET" }, options));
  }

  async upsertPolicy(
    body: {
      policyId?: string;
      version?: number;
      definition: Record<string, unknown>;
    },
    options?: RequestOptions,
  ): Promise<PolicyRecord> {
    return policyRecord.parse(
      await this.#request("policies", { method: "POST", body: JSON.stringify(body) }, options),
    );
  }

  async #request(
    path: string,
    init: RequestInit,
    options: RequestOptions = {},
    meta: { okStatuses?: number[] } = {},
  ): Promise<unknown> {
    const okStatuses = new Set(meta.okStatuses ?? [200]);
    const signal =
      options.signal ??
      AbortSignal.timeout(options.timeoutMs ?? this.#defaultTimeoutMs);
    const response = await this.#fetch(
      `${this.#baseUrl}/v1/applications/${this.#applicationId}/${path}`,
      {
        ...init,
        headers: {
          authorization: `Bearer ${this.#apiKey}`,
          accept: "application/json",
          ...(init.body ? { "content-type": "application/json" } : {}),
          ...(init.headers ?? {}),
        },
        redirect: "error",
        signal,
      },
    );
    const rawText = await response.text();
    let body: unknown = undefined;
    if (rawText !== "") {
      try {
        body = JSON.parse(rawText) as unknown;
      } catch {
        body = rawText;
      }
    }
    if (!okStatuses.has(response.status)) {
      throw new SwarajHttpError(response.status, body);
    }
    return body;
  }
}
