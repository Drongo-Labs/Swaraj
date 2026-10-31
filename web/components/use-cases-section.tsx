"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CurrencyDollar,
  ArrowsLeftRight,
  GitCommit,
  Trash,
  UsersThree,
  CloudCheck,
  GameController,
  WarningCircle,
  ShieldCheck,
  Check,
  X,
  Buildings,
  ChartLineUp,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { TextureButton } from "@/components/ui/texture-button";

interface UseCaseItem {
  id: string;
  category: "crypto" | "enterprise" | "fleets" | "gaming";
  codeId: string;
  title: string;
  status: "Live MVP" | "Production Schema" | "Composition" | "Ecosystem";
  agentRole: string;
  policySummary: string;
  allowedExample: string;
  blockedExample: string;
  investorImpact: string;
}

const USE_CASES: UseCaseItem[] = [
  {
    id: "a0-spot",
    category: "crypto",
    codeId: "A0. Spot Trading",
    title: "Autonomous DEX & Spot Trading",
    status: "Live MVP",
    agentRole: "Market-making or algorithmic trading agent on Base / Uniswap v3.",
    policySummary: "Max $1,000 per trade, max 50 bps slippage, allowlisted USDC/ETH pairs, 120s cooldown.",
    allowedExample: "$450 swap of USDC to WETH within 25 bps slippage → SAT (Issues one-shot capability token).",
    blockedExample: "$1,500 trade or unapproved meme coin route → UNSAT (Blocked at gate before sending to RPC).",
    investorImpact: "Enables funds to deploy autonomous execution strategies with mathematically bounded drawdown risk.",
  },
  {
    id: "a1-treasury",
    category: "enterprise",
    codeId: "A1. Treasury Payouts",
    title: "Corporate Treasury & Invoicing",
    status: "Production Schema",
    agentRole: "Finance ops agent paying verified contractor invoices and vendor bills.",
    policySummary: "Strict recipient address allowlists, rolling 24h budget limits, approved token currencies.",
    allowedExample: "Paying approved AWS invoice to verified cloud recipient address under $15k daily cap.",
    blockedExample: "Phishing invoice or newly inserted payee address → BLOCKED with recipient-violation proof.",
    investorImpact: "Replaces slow human approval queues for routine operations without risking multi-million treasury drains.",
  },
  {
    id: "a2-refunds",
    category: "enterprise",
    codeId: "A2. Support Refunds",
    title: "Customer Support Refund Caps",
    status: "Production Schema",
    agentRole: "Autonomous AI customer support rep resolving dispute tickets.",
    policySummary: "Max $75 per refund, requires matching valid original charge ID, max $1,000/day pool.",
    allowedExample: "$35 refund matched to existing transaction receipt from yesterday → APPROVED.",
    blockedExample: "Customer prompts agent: 'I was inconvenienced, give me $500 goodwill' → HARD BLOCKED.",
    investorImpact: "Neutralizes prompt-injection social engineering attacks against customer-facing LLM agents.",
  },
  {
    id: "a3-deploy",
    category: "enterprise",
    codeId: "A3. CI/CD DevOps Gates",
    title: "Autonomous Production Deployment Gates",
    status: "Production Schema",
    agentRole: "Coding and DevOps agent managing cloud staging and production clusters.",
    policySummary: "Staging deployments allowed freely; Production only from main branch with green test receipts.",
    allowedExample: "Promote release candidate v2.4 from signed main commit with passing coverage suite.",
    blockedExample: "Agent tries hotfixing production directly from a feature branch → BLOCKED at deployment adapter.",
    investorImpact: "Gives engineering leaders absolute certainty that autonomous coding agents cannot take down production.",
  },
  {
    id: "b1-commerce",
    category: "fleets",
    codeId: "B1. Settlement Desks",
    title: "Multi-Agent Commerce Desk",
    status: "Composition",
    agentRole: "Fleet of agents: settlement agent pays merchants, exception agent handles returns.",
    policySummary: "Shared corporate rolling cap across both agents; refund agent cannot exceed settled volume.",
    allowedExample: "Settlement agent dispenses $5,000 payouts while exception agent returns $200 from valid receipts.",
    blockedExample: "Exception agent attempts to refund more than total pool or without an authoritative settlement root.",
    investorImpact: "First formal security layer capable of orchestrating complex multi-agent collaborative economies.",
  },
  {
    id: "b3-dual-control",
    category: "fleets",
    codeId: "B3. Dual-Control Treasury",
    title: "Separation of Duty & Mandates",
    status: "Composition",
    agentRole: "Market research LLM drafts transactions; execution engine signs only with dual capability.",
    policySummary: "Chat models have zero execution credentials; actions require signed capability binding.",
    allowedExample: "Research agent publishes structured Action Intent; policy gateway checks policy and signs capability.",
    blockedExample: "Compromised prompt attempts to execute raw terminal commands or transfer keys directly.",
    investorImpact: "Eliminates the 'god-mode agent' vulnerability where one compromised LLM owns the entire server.",
  },
  {
    id: "d1-gaming",
    category: "gaming",
    codeId: "D1 & D6. Game & Esports",
    title: "Autonomous Game Stakes & Bankrolls",
    status: "Ecosystem",
    agentRole: "Gaming bot or esports betting agent staking capital in competitive arenas.",
    policySummary: "Strict match buy-in limits, bankroll percentage ceilings, verified match result oracles.",
    allowedExample: "Entering $25 table buy-in within daily 5% bankroll allocation limit.",
    blockedExample: "Reckless bot tries tilting into $1,000 high-stakes lobby after two losses → BLOCKED.",
    investorImpact: "Unlocks trusted autonomous gaming, AI sports simulation, and non-custodial bot staking.",
  },
  {
    id: "a4-privacy",
    category: "enterprise",
    codeId: "A4. Privacy Erasure",
    title: "GDPR & Data Retention Gate",
    status: "Production Schema",
    agentRole: "Data compliance agent fulfilling user 'Right to be Forgotten' requests.",
    policySummary: "Soft-delete only on user metadata; hard-delete strictly prohibited on billing/audit records.",
    allowedExample: "Nullifying user tracking telemetry and marketing cookies on customer request.",
    blockedExample: "Wiping core invoice history or financial ledger tables → BLOCKED as non-allowlisted object.",
    investorImpact: "Guarantees regulatory compliance without risking irreversible loss of financial audit data.",
  },
];

export function UseCasesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Use Cases" },
    { id: "crypto", label: "DeFi & Trading" },
    { id: "enterprise", label: "Enterprise & FinOps" },
    { id: "fleets", label: "Multi-Agent Fleets" },
    { id: "gaming", label: "Gaming & Stakes" },
  ];

  const filtered =
    activeCategory === "all"
      ? USE_CASES
      : USE_CASES.filter((item) => item.category === activeCategory);

  return (
    <section id="use-cases" className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#303030]/15 dark:border-[#303030]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#161616] dark:text-[#ffffff] leading-tight">
            Designed for where <span className="text-[#ff4900]">real value is at stake</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
            From algorithmic trading on decentralized exchanges to enterprise cloud governance and autonomous multi-agent desks, Swaraj enforces mathematical boundaries.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((c) => (
              <TextureButton
                key={c.id}
                variant={activeCategory === c.id ? "brand" : "secondary"}
                size="sm"
                className="w-auto rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5"
                onClick={() => setActiveCategory(c.id)}
              >
                <span>{c.label}</span>
              </TextureButton>
            ))}
          </div>
        </div>

        {/* Use Cases Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[#303030]/15 dark:border-[#303030] bg-[#ffffff] dark:bg-[#1e1e1e] p-5 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#ff4900]/40 hover:shadow-[0_8px_24px_rgba(255,73,0,0.06)] transition-all"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#ff4900]">
                      {item.codeId}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f1f1f1] dark:bg-[#161616] text-[#303030] dark:text-[#f1f1f1]/80 border border-[#303030]/20 dark:border-[#303030]">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#161616] dark:text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#303030]/75 dark:text-[#f1f1f1]/65 mb-4 leading-relaxed">
                    {item.agentRole}
                  </p>

                  {/* Policy Box */}
                  <div className="rounded-xl bg-[#f8f8f8] dark:bg-[#161616] border border-[#303030]/10 dark:border-[#303030] p-3 text-xs mb-4">
                    <span className="font-bold text-[#161616] dark:text-white block mb-1">
                      Enforced Policy:
                    </span>
                    <span className="text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed break-words">
                      {item.policySummary}
                    </span>
                  </div>

                  {/* Allowed / Blocked Examples */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                      <Check size={16} weight="bold" className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-emerald-900 dark:text-emerald-200 leading-relaxed break-words">
                        {item.allowedExample}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                      <X size={16} weight="bold" className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <span className="text-red-900 dark:text-red-200 leading-relaxed break-words">
                        {item.blockedExample}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investor Takeaway */}
                <div className="mt-6 pt-4 border-t border-[#303030]/10 dark:border-[#303030] text-[11px] text-[#303030]/70 dark:text-[#f1f1f1]/60 flex items-center gap-1.5 leading-normal">
                  <ChartLineUp size={16} className="text-[#ff4900] shrink-0" weight="bold" />
                  <span>{item.investorImpact}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
