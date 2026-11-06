#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { verifyReceiptBundle, type ReceiptBundle } from "./index.js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { issuer: { type: "string" }, "near-rpc": { type: "string" } },
});
const file = positionals[0];
if (file === undefined || values.issuer === undefined) {
  console.error("usage: swaraj-verify <bundle.json> --issuer <address> [--near-rpc <url>]");
  process.exit(2);
}

const bundle = JSON.parse(readFileSync(file, "utf8")) as ReceiptBundle;
const result = await verifyReceiptBundle(bundle, {
  issuer: values.issuer,
  ...(values["near-rpc"] ? { nearRpcUrl: values["near-rpc"] } : {}),
});
for (const check of result.checks) {
  console.log(`${check.ok ? "ok  " : "FAIL"} ${check.name}${check.detail ? ` (${check.detail})` : ""}`);
}
console.log(result.valid ? "VALID" : "INVALID");
process.exit(result.valid ? 0 : 1);
