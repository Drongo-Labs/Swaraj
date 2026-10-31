"use client";

import React from "react";
import { Faq1, FaqItem } from "@/components/ui/faq-1";

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Why do we need Swaraj if our AI agents already have prompt instructions?",
    category: "Safety & Control",
    answer:
      "System prompts (such as \"never spend more than $1,000\" or \"only transfer to approved vendors\") are merely soft guidelines to an AI model, not enforceable rules. Prompts are vulnerable to hallucinations, unexpected conversational drift, and jailbreak attacks. Swaraj creates an external, unbreakable authorization barrier. Your business policies are enforced before any action reaches an API, payment rail, or database—guaranteeing that agents cannot exceed their limits, no matter what happens inside the model.",
  },
  {
    id: "faq-2",
    question: "How does Swaraj prevent rogue AI agents from causing real-world damage?",
    category: "Risk Mitigation",
    answer:
      "Swaraj separates thinking from doing. The AI agent can analyze data and propose what it wants to do, but it is never given direct access keys or unrestricted execution authority. Swaraj intercepts every proposed action and evaluates it against your policies (such as spend caps, permitted recipients, and rate limits). If an action is over the line, it is blocked immediately—stopping unauthorized transactions or unintended commands before they execute.",
  },
  {
    id: "faq-3",
    question: "Can an agent bypass or find a loophole around Swaraj?",
    category: "Security",
    answer:
      "No. Downstream execution environments (such as cloud services, payment APIs, or database endpoints) only accept single-use, time-limited digital permits generated when Swaraj approves an action. Because the agent never possesses direct, persistent credentials or an alternate execution route, it is impossible for it to circumvent the gate.",
  },
  {
    id: "faq-4",
    question: "Will running policy checks slow down our agents or introduce latency?",
    category: "Performance",
    answer:
      "Not at all. Swaraj evaluates policy constraints deterministically in single-digit milliseconds—substantially faster than an LLM generates a single word. Your autonomous agents continue operating in real time with virtually zero perceptible overhead.",
  },
  {
    id: "faq-5",
    question: "How does Swaraj help our company with compliance, audits, and liability?",
    category: "Compliance & Governance",
    answer:
      "Every action proposal—whether approved or blocked—generates a tamper-proof digital receipt. These receipts capture exactly what the agent intended, which policies were evaluated, why the decision was made, and the execution outcome. This provides an audit-ready paper trail that satisfies internal risk committees, external auditors, and institutional investors.",
  },
  {
    id: "faq-6",
    question: "How difficult is it to integrate Swaraj into our existing AI agent stack?",
    category: "Integration",
    answer:
      "Swaraj is designed for fast, drop-in integration. Whether you use popular frameworks like LangChain, CrewAI, AutoGen, or a custom Python/TypeScript setup, Swaraj operates as lightweight middleware. You define your business guardrails in clean, readable policies and protect your live agents with just a few lines of code.",
  },
  {
    id: "faq-7",
    question: "Does Swaraj need access to our proprietary models, prompts, or sensitive customer data?",
    category: "Privacy & IP",
    answer:
      "No. Swaraj operates on strict data minimization principles. It only reviews the structured action payload (the action type, parameters, and destination) required to evaluate your rules. Your proprietary algorithms, confidential prompts, internal model weights, and sensitive customer data remain completely private and secure within your own infrastructure.",
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
