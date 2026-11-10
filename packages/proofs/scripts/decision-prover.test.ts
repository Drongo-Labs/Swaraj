import assert from "node:assert/strict";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { proveMandateDecision } from "../dist/decision-prover.js";

/** A stand-in SP1 host: prints `statement` when proving and the export JSON on --export. */
async function fakeHost(statement: string): Promise<{ hostBin: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(join(tmpdir(), "fake-host-"));
  const hostBin = join(dir, "host.mjs");
  await writeFile(hostBin, `#!/usr/bin/env node
import { writeFileSync } from "node:fs";
const args = process.argv.slice(2);
if (args[1] === "--export") {
  console.log(JSON.stringify({ program: "0xabc", public_values: "0102", proof: "0304" }));
} else {
  writeFileSync(args[args.indexOf("--proof-out") + 1], "proof-bytes");
  process.stdout.write(${JSON.stringify("statement_id=")} + ${JSON.stringify(statement)} + "\\nproof=x\\n");
}
`);
  await chmod(hostBin, 0o755);
  return { hostBin, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

const input = { actionWire: "{}", mandateCanonical: "{}" };
const statement = "swaraj/statement/mandate/v1\nintent=0x1\nmandate=0x2\ndecision=BLOCK\nmatched=forbid_cap";

test("a matching statement yields the verifier payload from the host's export", async () => {
  const host = await fakeHost(statement);
  try {
    const outcome = await proveMandateDecision({ hostBin: host.hostBin, elfPath: "guest.elf" }, input, statement);
    assert.deepEqual(outcome.groth16, { program: "0xabc", publicValuesHex: "0102", proofHex: "0304" });
    assert.equal(outcome.statement, statement);
  } finally {
    await host.cleanup();
  }
});

test("a different statement fails closed before anything is exported", async () => {
  const host = await fakeHost(statement.replace("BLOCK", "ALLOW"));
  try {
    await assert.rejects(
      proveMandateDecision({ hostBin: host.hostBin, elfPath: "guest.elf" }, input, statement),
      /guest parity failure/,
    );
  } finally {
    await host.cleanup();
  }
});
