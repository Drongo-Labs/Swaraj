# @swaraj/sdk

Prototype TypeScript HTTP client for Swaraj. This package implements `submitAction` and `getReceipt` against a proposed HTTP contract, using schemas from `@swaraj/contracts`. The development API and MCP bridge are scaffolded, but execution and receipt storage return unavailable errors. Application registration, policy management, canonical intent construction, and receipt cryptographic verification remain planned work. The packages are not published.

## Use inside this workspace

Add `"@swaraj/sdk": "workspace:*"` to an application's dependencies, run `pnpm install`, then `pnpm build` from the workspace root. Import the package by name:

```ts
import { Swaraj } from "@swaraj/sdk";

const swaraj = new Swaraj({
  baseUrl: process.env.SWARAJ_URL!,
  apiKey: process.env.SWARAJ_AGENT_KEY!,
  applicationId: process.env.SWARAJ_APPLICATION_ID!,
});

const result = await swaraj.submitAction({
  action: "payment.send",
  input: { recipient: "vendor_acme", amountCents: "5000", currency: "USD" },
  idempotencyKey: "invoice-1042",
});

if (result.decision === "ALLOW") {
  const receipt = await swaraj.getReceipt(result.receiptId);
  console.log(receipt.status);
}
```

The payment action illustrates the interface; its backend adapter is not implemented. Run `pnpm example` at the workspace root for a fully offline mock transport demonstration. That demo always ends with `NON_PROVABLE` and performs no external action.

## Prototype HTTP contract

| Method | Endpoint | Response |
|---|---|---|
| `submitAction` | `POST /v1/applications/:applicationId/actions` | `ALLOW` with a pending receipt ID, or `BLOCK` with violations |
| `getReceipt` | `GET /v1/applications/:applicationId/receipts/:receiptId` | Receipt status, optional claim/reason, and additional backend metadata |

The SDK attaches a bearer credential, validates the request envelope and basic response shape with Zod, rejects redirects, and times out requests after 30 seconds. It requires HTTPS except for loopback development URLs. Use it in a trusted application backend or agent runtime; keep credentials out of browser bundles and model prompts.

`SwarajHttpError` exposes the HTTP status for non-success responses. Network/timeout errors and schema validation errors propagate to the caller. A timeout does not mean an action failed to execute. There are no automatic retries: preserve the original request and idempotency key for backend reconciliation, and never replace a key merely because a request timed out.

Receipt status is a backend report. Reading `PROVED` does not independently verify a proof or signature; the full receipt verification contract is not implemented. Application-specific rules, trusted state, account scope, capability enforcement, and durable idempotency must be enforced by the eventual backend.

## Build and package

Requires Node.js 22.12+ and pnpm 10.12.1. The build emits ESM JavaScript and TypeScript declarations. Native `fetch` handles transport; runtime dependencies are Zod and the shared contracts package.

Packing the SDK rewrites its workspace dependency to the matching contracts version. A separate repository therefore also needs that contracts package; use workspace imports during development, or package both and configure the consumer to resolve `@swaraj/contracts` to its local tarball. Publish the matching contracts version before distributing an SDK release. Rust, SP1, Z3, and Lean are not shipped inside this client package.
