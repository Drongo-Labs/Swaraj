import { z } from "zod";
import {
  Identifier as identifier,
  ActionRequestSchema as actionRequest,
  ActionResultSchema as actionResult,
  ReceiptSchema as receipt,
  PolicyRecordSchema as policyRecord,
  type ActionRequest, type ActionResult, type Receipt, type PolicyRecord,
} from "@swaraj/contracts";
export type { ActionRequest, ActionResult, Receipt, PolicyRecord } from "@swaraj/contracts";

export interface SwarajOptions {
  baseUrl: string;
  apiKey: string;
  applicationId: string;
  /** Override the transport for tests or local examples. */
  fetch?: typeof globalThis.fetch;
}

export class SwarajHttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Swaraj request failed with HTTP ${status}`);
    this.name = "SwarajHttpError";
    this.status = status;
  }
}

/** Prototype HTTP client; authorization and proof verification belong on the backend. */
export class Swaraj {
  readonly #baseUrl: string;
  readonly #apiKey: string;
  readonly #applicationId: string;
  readonly #fetch: typeof globalThis.fetch;

  constructor(options: SwarajOptions) {
    const url = new URL(options.baseUrl);
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
      throw new Error("Use HTTPS, or HTTP on loopback for local development");
    }
    if (url.username || url.password || url.search || url.hash) {
      throw new Error("baseUrl must not contain credentials, a query, or a fragment");
    }
    this.#baseUrl = url.href.replace(/\/+$/, "");
    this.#apiKey = z.string().trim().min(1).parse(options.apiKey);
    this.#applicationId = identifier.parse(options.applicationId);
    this.#fetch = options.fetch ?? globalThis.fetch;
  }

  async submitAction(intent: ActionRequest): Promise<ActionResult> {
    const body = actionRequest.parse(intent);
    return actionResult.parse(await this.#request("actions", {
      method: "POST",
      body: JSON.stringify(body),
    }));
  }

  async getReceipt(receiptId: string): Promise<Receipt> {
    const id = identifier.parse(receiptId);
    const result = receipt.parse(await this.#request(`receipts/${id}`, { method: "GET" }));
    if (result.receiptId !== id) throw new Error("Receipt ID does not match the request");
    return result;
  }

  async getPolicy(policyId: string): Promise<PolicyRecord> {
    const id = identifier.parse(policyId);
    return policyRecord.parse(await this.#request(`policies/${id}`, { method: "GET" }));
  }

  async upsertPolicy(body: {
    policyId?: string;
    version?: number;
    definition: Record<string, unknown>;
  }): Promise<PolicyRecord> {
    return policyRecord.parse(await this.#request("policies", {
      method: "POST",
      body: JSON.stringify(body),
    }));
  }

  async #request(path: string, init: RequestInit): Promise<unknown> {
    const response = await this.#fetch(
      `${this.#baseUrl}/v1/applications/${this.#applicationId}/${path}`,
      {
        ...init,
        headers: {
          authorization: `Bearer ${this.#apiKey}`,
          accept: "application/json",
          ...(init.body ? { "content-type": "application/json" } : {}),
        },
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!response.ok) throw new SwarajHttpError(response.status);
    return response.json();
  }
}
