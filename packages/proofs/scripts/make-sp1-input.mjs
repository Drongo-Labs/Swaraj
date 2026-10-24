import { readFileSync, writeFileSync } from "node:fs";
import { buildStatement, fromWirePolicy, reevaluateGround, statementId } from "../dist/index.js";
const vectors = JSON.parse(readFileSync("vectors/gate-vectors.json", "utf8"));
const wirePolicy = vectors.policies.pol_vectors_trade;
const action = { values: { amountCents: "25000", limitCents: "100000", dailyUsedCents: "0", dailyCapCents: "500000" } };
// The wire policy (JSON numbers) is exactly what the Rust engine consumes.
const policy = fromWirePolicy(wirePolicy);
const decision = reevaluateGround(policy, action);
const statement = buildStatement(policy, action, decision);
const id = statementId(statement);
const input = { policy: wirePolicy, action, policyDocDigest: statement.policyDocDigest, expectedStatementId: id };
writeFileSync("/tmp/sp1-gate-input.json", JSON.stringify(input, null, 2));
console.log("ts statement id:", id);
