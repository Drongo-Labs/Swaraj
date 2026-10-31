"use client";

import React from "react";
import { Faq1, FaqItem } from "@/components/ui/faq-1";

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Why not just put the rules in the system prompt?",
    category: "Architecture & Prompts",
    answer:
      "Prompt instructions are suggestions to a model — vulnerable to jailbreaks, hallucination, and conversational drift. Swaraj moves your business rules out of the model and into an external gate that checks every action before execution. What happens inside the model stops mattering.",
  },
  {
    id: "faq-2",
    question: "What exactly is \"proven\"?",
    category: "Lean 4 & Formal Verification",
    answer:
      "Three layers. (1) Each decision is made by a deterministic Z3 evaluation of the mandate. (2) The gate's core properties — default deny, forbid-always-wins, and no execution without ALLOW — are formal theorems, machine-checked by the Lean 4 kernel, not just covered by tests. (3) A proof worker generates a zkVM (SP1) proof per decision and attaches it to the receipt, promoting it to PROVED.",
  },
  {
    id: "faq-3",
    question: "What's inside a receipt?",
    category: "Proof-Carrying Receipts",
    answer:
      "A signed, hash-bound record: the intent hash, the mandate hash and version in force, the decision, and the exact rules that fired. PROVED receipts add proof metadata (proof hash, program key hash, public-inputs hash). The receipt is portable — it verifies against your data without trusting our servers.",
  },
  {
    id: "faq-4",
    question: "So my agent can never misbehave?",
    category: "Security Boundary",
    answer:
      "For every action routed through Swaraj, execution without an ALLOW is proven impossible — that's the Lean theorem. The honest boundary: an agent holding raw credentials outside the pipeline is out of any policy engine's reach; production deployments keep keys in TEE/HSM custody so the governed executor is the only spender. We'd rather state the boundary than pretend it away.",
  },
  {
    id: "faq-5",
    question: "What happens when an action is blocked?",
    category: "Enforcement & Auditing",
    answer:
      "Nothing executes. No side effects, no API call, no fee. The block is recorded like any decision — with the rule id that fired — so you can audit attempts, not just outcomes.",
  },
  {
    id: "faq-6",
    question: "Can the rules change over time?",
    category: "Mandates & Governance",
    answer:
      "Yes — by the owner, only. Mandates are versioned; every revision creates a new version, and every receipt binds to the version in force at decision time. Tighten the cap after an incident and history stays verifiable — old decisions still check out against the rules that governed them.",
  },
  {
    id: "faq-7",
    question: "What does integrating look like?",
    category: "Developer Integration",
    answer:
      "Your agent sends a typed intent through the SDK (or via the MCP bridge), receives ALLOW + a one-shot capability token, and executes. The mandate schema, the gateway, and the receipt pipeline are already built — you write rules, not infrastructure.",
  },
];

export function FaqBlock() {
  return (
    <div className="w-full bg-white dark:bg-[#161616] border-t border-[#303030]/15 dark:border-[#303030]">
      <Faq1
        id="faq"
        title="Frequently Asked Questions"
        faqs={FAQ_ITEMS}
        footerText="Have a custom architecture or compliance requirement?"
        footerLinkText="Speak with our team"
        footerLinkHref="#contact"
      />
    </div>
  );
}

export { Faq1 };
