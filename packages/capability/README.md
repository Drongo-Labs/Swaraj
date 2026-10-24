# @swaraj/capability

Phase 5 capability tokens, budget reservations, and execution adapters.

- Issue a short-lived, single-use, audience-bound capability only after ALLOW.
- Hold a durable reservation on issue; commit on execute; release on failure/expiry paths.
- `createMockExecutionAdapter` — validates the capability, returns a fixture Base tx (no RPC).
- `createBaseUniswapExecutionAdapter` — verifies capability, approves ERC20, submits Uniswap v3 `exactInputSingle` on Base (SwapRouter02), returns the real `txHash`.

Requires `trade` fields (`assetIn`, `assetOut`, `amount`, `maxSlippageBps`, `limitPrice`) for the live adapter.
