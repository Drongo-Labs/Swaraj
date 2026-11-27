---
"@swaraj/sdk": minor
---

Initial release of `@swaraj/sdk`:
- Align client with live gateway `POST /v1/applications/:id/unified-actions` endpoint
- Surface signed `permit` on `ALLOW` decisions for counterparty verification
- Add `waitForReceipt` receipt polling helper with terminal status detection, timeout, and abort signal support
- Add `SwarajHttpError` with parsed response bodies and `SwarajTimeoutError`
- Dual-package build supporting both ESM (`import`) and CommonJS (`require`) with bundled TypeScript declarations
- Fallback to standard environment variables (`SWARAJ_URL`, `SWARAJ_DEV_TOKEN`, `SWARAJ_APPLICATION_ID`)
