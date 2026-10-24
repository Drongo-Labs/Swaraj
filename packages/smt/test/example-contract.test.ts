import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { decide, renderSmtScript, type PolicyDoc } from "../dist/index.js";

/**
 * Contract test for examples/json-to-smt.md: the JSON blocks published in
 * the example must run against the real gateway and produce exactly the
 * documented results. If the example or the compiler drifts, this fails.
 */

const examplePath = fileURLToPath(new URL("../../../examples/json-to-smt.md", import.meta.url));

function extractJsonBlocks(markdown: string): unknown[] {
  const blocks: unknown[] = [];
  const pattern = /```json\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(markdown)) !== null) {
    blocks.push(JSON.parse(match[1]!));
  }
  return blocks;
}

test("the published example policy runs and matches its documented outcomes", async () => {
  const markdown = await readFile(examplePath, "utf8");
  const blocks = extractJsonBlocks(markdown);

  const policyBlock = blocks.find(
    (block): block is Record<string, unknown> =>
      typeof block === "object" && block !== null && "policyId" in block,
  );
  assert.ok(policyBlock, "example must contain a policy JSON block");
  // The example publishes the wire form (JSON numbers); the smt layer
  // accepts it directly.
  const policy = policyBlock as unknown as PolicyDoc;

  const allowBlock = blocks.find(
    (block): block is Record<string, unknown> =>
      typeof block === "object" && block !== null && "values" in block,
  );
  assert.ok(allowBlock, "example must contain an action JSON block");
  const action = { values: (allowBlock.values as Record<string, string>) };

  // Documented: amountCents 25000 is ALLOW.
  const allowed = await decide(policy, action);
  assert.equal(allowed.outcome, "ALLOW");
  assert.deepEqual(allowed.violatedRuleIds, []);

  // The rendered script matches the shape documented in the example:
  // every field declared, every rule id commented, check-sat at the end.
  const script = renderSmtScript(policy, { binding: undefined });
  for (const field of policy.fields) {
    assert.ok(script.includes(`(declare-const ${field} Int)`));
  }
  for (const rule of [...policy.assumptions, ...policy.rules]) {
    assert.ok(script.includes(rule.ruleId));
  }
  assert.ok(script.trimEnd().endsWith("(check-sat)"));

  // Documented: amountCents 250000 is BLOCK with exactly amount.cap.
  const blocked = await decide(policy, {
    values: { ...action.values, amountCents: "250000" },
  });
  assert.equal(blocked.outcome, "BLOCK");
  assert.deepEqual(blocked.violatedRuleIds, ["amount.cap"]);
});
