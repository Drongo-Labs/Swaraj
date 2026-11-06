import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed provider records as evidence. Unsigned, stale or mismatched records do not count. */

const STRIPE_TOLERANCE_SECONDS = 300;

function sameText(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

const hmacHex = (secret: string, payload: string) => createHmac("sha256", secret).update(payload).digest("hex");

/** Stripe-Signature: t=<seconds>,v1=<hmac>; several v1 values appear during secret rotation. */
export function stripeSignatureValid(rawBody: string, header: string | undefined, secret: string, nowSeconds: number): boolean {
  if (header === undefined) return false;
  const parts = header.split(",").map((part) => part.split("=", 2) as [string, string]);
  const timestamp = Number(parts.find(([key]) => key === "t")?.[1]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > STRIPE_TOLERANCE_SECONDS) return false;
  const expected = hmacHex(secret, `${timestamp}.${rawBody}`);
  return parts.some(([key, value]) => key === "v1" && sameText(value, expected));
}

/** X-Hub-Signature-256: sha256=<hmac>. */
export function githubSignatureValid(rawBody: string, header: string | undefined, secret: string): boolean {
  return header !== undefined && sameText(header, `sha256=${hmacHex(secret, rawBody)}`);
}

type PaymentTerms = { amount: string; currency: string; recipient: string };
type DeployTerms = { repo: string; commitHash: string; environment: string };

/** The receipt a Stripe event settles, carried in the payment's metadata. */
export function stripeReceiptId(event: unknown): string | undefined {
  const id = (event as StripeEvent)?.data?.object?.metadata?.swaraj_receipt_id;
  return typeof id === "string" ? id : undefined;
}

type StripeEvent = {
  type?: string;
  data?: {
    object?: {
      amount?: number;
      currency?: string;
      metadata?: Record<string, unknown>;
      transfer_data?: { destination?: string };
    };
  };
};

export function stripeEventMatches(event: unknown, terms: PaymentTerms): boolean {
  const { type, data } = event as StripeEvent;
  const payment = data?.object;
  return type === "payment_intent.succeeded"
    && payment?.amount !== undefined
    && String(payment.amount) === terms.amount
    && payment.currency?.toUpperCase() === terms.currency
    && payment.transfer_data?.destination === terms.recipient;
}

type GithubEvent = {
  deployment_status?: { state?: string };
  deployment?: { sha?: string; environment?: string; payload?: { swaraj_receipt_id?: unknown } };
  repository?: { full_name?: string };
};

/** The receipt a GitHub deployment settles, carried in the deployment's payload. */
export function githubReceiptId(event: unknown): string | undefined {
  const id = (event as GithubEvent)?.deployment?.payload?.swaraj_receipt_id;
  return typeof id === "string" ? id : undefined;
}

export function githubDeploymentMatches(event: unknown, terms: DeployTerms): boolean {
  const { deployment_status: status, deployment, repository } = event as GithubEvent;
  return status?.state === "success"
    && deployment?.sha === terms.commitHash
    && deployment?.environment?.toUpperCase() === terms.environment
    && repository?.full_name === terms.repo;
}
