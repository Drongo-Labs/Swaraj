#!/usr/bin/env node
/**
 * Nov 8 demo: NearProofSink takes a decision fixture from PENDING → PROVED
 * on the deployed receipts contract (verifier-backed).
 *
 * Requires env:
 *   NEAR_ACCOUNT_ID / NEAR_PRIVATE_KEY  — owner of the receipts contract
 *   NEAR_RECEIPTS_CONTRACT_ID           — deployed swaraj-receipts account
 * Optional:
 *   NEAR_RPC_URL
 *   NEAR_FIXTURE=decision-allow-groth16|decision-block-groth16
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NearProofSink, claimHashFromStatement } from "../dist/near-sink.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const name = process.env.NEAR_FIXTURE ?? "decision-allow-groth16";
const fixture = JSON.parse(readFileSync(join(root, "fixtures", `${name}.json`), "utf8"));

// public_values = bincode String: 8-byte LE length + utf8 statement
const pv = Buffer.from(fixture.public_values, "hex");
const stmtLen = Number(pv.readBigUInt64LE(0));
const canonicalText = pv.subarray(8, 8 + stmtLen).toString("utf8");
const claimHash = claimHashFromStatement(canonicalText);

const accountId = process.env.NEAR_ACCOUNT_ID?.trim();
const privateKey = process.env.NEAR_PRIVATE_KEY?.trim();
const receiptsContractId = process.env.NEAR_RECEIPTS_CONTRACT_ID?.trim();
if (!accountId || !privateKey || !receiptsContractId) {
  console.error("Set NEAR_ACCOUNT_ID, NEAR_PRIVATE_KEY, NEAR_RECEIPTS_CONTRACT_ID");
  process.exit(1);
}

console.log({ fixture: name, claimHash, statementPreview: canonicalText.slice(0, 160) });

const sink = new NearProofSink({
  accountId,
  privateKey,
  receiptsContractId,
  rpcUrl: process.env.NEAR_RPC_URL,
  resolveProof: () => ({
    program: fixture.program,
    publicValuesHex: fixture.public_values,
    proofHex: fixture.proof,
  }),
});

const statementId = `near_demo_${name}_${Date.now()}`;
const attestation = await sink.submit({
  statementId,
  canonicalText,
  createdAt: new Date().toISOString(),
});
console.log("PROVED", attestation);
