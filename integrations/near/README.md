# @swaraj/near

Everything Swaraj does on NEAR lives here. Import it from `@swaraj/near`.

| Path | Contents |
|---|---|
| `src/execution.ts` | Sends transfers, token transfers and Ref Finance swaps |
| `src/evidence.ts` | Reads a transaction from chain and checks it matches the action |
| `src/settler.ts` | `createNearSettler`, which the API uses to run a permitted action |
| `src/verify.ts` | The NEAR checks behind `swaraj-verify` |
| `src/demo/` | `near-demo` and `near-setup` |
| `mandates/` | Mandate templates |

Without `NEAR_ACCOUNT_ID` and `NEAR_PRIVATE_KEY`, the settler uses fixtures, which end at `cant_prove`.

```ts
import { createNearSettler } from "@swaraj/near";

const settler = createNearSettler(capabilities, signer);
if (settler.handles(action)) {
  const result = await settler.settle(action, { applicationId, intentHash, policyHash });
}
```

The core packages do not depend on this one. A new chain implements `ActionSettler` from `@swaraj/capability` the same way. `apps/api` picks NEAR as the default, and `swaraj-verify` imports the NEAR checks from here.

Setup, demo scenes and limits are in the [root README](../../README.md#run-a-near-scene).
