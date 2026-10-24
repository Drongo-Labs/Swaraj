/**
 * HTTP client for the Swaraj application API. This is the same contract the
 * TypeScript SDK will wrap: submit an action, inspect a receipt, read a
 * policy. Only the three operations the MCP tools need are implemented.
 */

export interface SubmitActionRequest {
  applicationId: string;
  policyId: string;
  input: Record<string, string>;
  idempotencyKey?: string;
}

export interface SubmitActionResponse {
  decision: "ALLOW" | "BLOCK";
  receiptId?: string;
  violatedRuleIds: string[];
  policyDigest: string;
}

export interface ReceiptView {
  receiptId: string;
  state: "PENDING" | "PROVED" | "NON_PROVABLE" | "INVALIDATED";
  proofRef?: string;
  claim: unknown;
}

export interface PolicyView {
  policyId: string;
  revision: number;
  digest: string;
  ruleIds: string[];
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`Swaraj API returned ${status}: ${body.slice(0, 200)}`);
    this.name = "ApiError";
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  token: string;
  fetchImpl?: typeof fetch;
}

export class SwarajApiClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.token = options.token;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async submitAction(request: SubmitActionRequest): Promise<SubmitActionResponse> {
    const body: Record<string, unknown> = {
      applicationId: request.applicationId,
      policyId: request.policyId,
      input: request.input,
    };
    if (request.idempotencyKey !== undefined) body.idempotencyKey = request.idempotencyKey;
    return this.call<SubmitActionResponse>("POST", "/actions", body);
  }

  async getReceipt(receiptId: string): Promise<ReceiptView> {
    return this.call<ReceiptView>("GET", `/receipts/${encodeURIComponent(receiptId)}`);
  }

  async getPolicy(policyId: string): Promise<PolicyView> {
    return this.call<PolicyView>("GET", `/policies/${encodeURIComponent(policyId)}`);
  }

  private async call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      authorization: `Bearer ${this.token}`,
    };
    const init: RequestInit =
      body === undefined
        ? { method, headers }
        : { method, headers, body: JSON.stringify(body) };
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, init);
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return (await response.json()) as T;
  }
}
