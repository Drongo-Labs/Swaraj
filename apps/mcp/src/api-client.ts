/** HTTP client for the Swaraj gateway API. */

export type SubmitActionResponse = {
  decision?: "ALLOW" | "BLOCK";
  productStatus?: string;
  receiptId?: string;
  mandate?: { reason?: string; matchedRuleIds?: string[]; matchedPermitRuleIds?: string[] };
  [key: string]: unknown;
};

export type ReceiptView = {
  receiptId: string;
  status: string;
  productStatus: string;
  [key: string]: unknown;
};

export type MandateView = {
  mandate: Record<string, unknown>;
  [key: string]: unknown;
};

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

  submitAction(applicationId: string, action: unknown): Promise<SubmitActionResponse> {
    return this.call("POST", `${app(applicationId)}/unified-actions`, { action });
  }

  getReceipt(applicationId: string, receiptId: string): Promise<ReceiptView> {
    return this.call("GET", `${app(applicationId)}/receipts/${encodeURIComponent(receiptId)}`);
  }

  getMandate(applicationId: string): Promise<MandateView> {
    return this.call("GET", `${app(applicationId)}/mandates`);
  }

  private async call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { authorization: `Bearer ${this.token}` };
    if (body !== undefined) headers["content-type"] = "application/json";
    const init: RequestInit =
      body === undefined ? { method, headers } : { method, headers, body: JSON.stringify(body) };
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, init);
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return (await response.json()) as T;
  }
}

function app(applicationId: string): string {
  return `/v1/applications/${encodeURIComponent(applicationId)}`;
}
