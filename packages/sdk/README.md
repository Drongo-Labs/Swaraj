# `@swaraj/sdk`

TypeScript HTTP client for the Swaraj gateway: submit unified actions, read receipts, and receive signed **permits** on every ALLOW.

Install inside this monorepo with `"@swaraj/sdk": "workspace:*"`. Public npm packaging is tracked in [`NPM_PUBLISH_CHANGES.md`](./NPM_PUBLISH_CHANGES.md).

## Quickstart

```ts
import { Swaraj } from "@swaraj/sdk";

const swaraj = new Swaraj({
  baseUrl: process.env.SWARAJ_URL!,          // or omit and set SWARAJ_URL / SWARAJ_BASE_URL
  apiKey: process.env.SWARAJ_DEV_TOKEN!,     // or SWARAJ_API_KEY
  applicationId: process.env.SWARAJ_APPLICATION_ID!,
});

const action = {
  intentId: "intent_pay_1",
  agent: "agent:treasury",
  action: "PAYMENT",
  resource: { service: "near_transfer" },
  context: { amount: "5", currency: "NEAR", recipient: "shop.testnet" },
  policyHash: "0x" + "9".repeat(64),
  timestamp: Date.now(),
  expiry: Date.now() + 300_000,
  idempotencyKey: "invoice-1042",
  signature: "0x" + "00".repeat(65),
};

const result = await swaraj.submitUnifiedAction(action);

if (result.decision === "ALLOW") {
  // Hand `result.permit` to the counterparty (API / merchant / tool server).
  // They verify with checkPermit / requirePermit from @swaraj/verify.
  console.log(result.permit.issuer, result.permit.expiresAt);
  if (result.receiptId) {
    const receipt = await swaraj.waitForReceipt(result.receiptId, {
      timeoutMs: 60_000,
      pollIntervalMs: 1_000,
    });
    console.log(receipt.status); // PROVED | NON_PROVABLE | …
  }
} else if (result.decision === "NEEDS_APPROVAL") {
  console.log("waiting on human", result.approvalId, result.expiresAt);
} else {
  console.log("blocked", result.violations);
}
```

HTTPS is required except for loopback (`http://127.0.0.1`, `localhost`). Credentials, query strings, and fragments in `baseUrl` are rejected.

## API

| Method | Gateway | Notes |
| --- | --- | --- |
| `submitUnifiedAction(action)` | `POST /v1/applications/:id/unified-actions` | Returns `ALLOW` (with `permit`), `BLOCK`, or `NEEDS_APPROVAL` (HTTP 202) |
| `getReceipt(receiptId)` | `GET /v1/applications/:id/receipts/:receiptId` | Single fetch |
| `waitForReceipt(receiptId, opts?)` | polls `getReceipt` | Stops on `PROVED` / `NON_PROVABLE` / `INVALIDATED` / `DEV_UNVERIFIED` |
| `getPolicy` / `upsertPolicy` | policy routes | Unchanged |
| `submitAction(intent)` | `POST …/actions` | **Deprecated** legacy envelope |

### Permits

On `ALLOW`, the gateway returns a short-lived signed `permit` for that exact action (capped lifetime). Agents forward it to the service that executes the side effect. That service should:

1. Read the permit (e.g. `swaraj-permit` header via `encodePermit` / `decodePermit`)
2. Call `checkPermit` from `@swaraj/verify` (or mount `requirePermit`)
3. Refuse the request if the permit is missing, forged, expired, reused, or for a different action

`BLOCK` and `NEEDS_APPROVAL` never include a permit.

### Errors and timeouts

- Failed HTTP responses throw `SwarajHttpError` with `status`, `body`, and `code` when the JSON body has `error`.
- Default timeout is 30s (`defaultTimeoutMs`). Override per call with `{ timeoutMs }` or `{ signal }`.
- `waitForReceipt` throws `SwarajTimeoutError` if the receipt stays non-terminal past `timeoutMs` (default 60s).

### Environment defaults

If you call `new Swaraj()` (or omit fields), Node picks up:

| Option | Env |
| --- | --- |
| `baseUrl` | `SWARAJ_URL` or `SWARAJ_BASE_URL` |
| `apiKey` | `SWARAJ_DEV_TOKEN` or `SWARAJ_API_KEY` |
| `applicationId` | `SWARAJ_APPLICATION_ID` |

Keep tokens out of browsers and model prompts; run the SDK in a trusted agent / backend process.
