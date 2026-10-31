"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  ShieldCheck,
  CheckCircle,
  ArrowSquareOut,
  Vault,
  Cube,
  GitBranch,
  PlugsConnected,
  Scales,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { TextureButton } from "@/components/ui/texture-button";

interface IntegrationItem {
  id: string;
  name: string;
  category: "agents" | "chains" | "zk" | "formal";
  role: string;
  badge: string;
  description: string;
  highlight: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "base",
    name: "Base & Uniswap",
    category: "chains",
    role: "L2 Execution & Canonical On-Chain Evidence",
    badge: "Live MVP",
    description:
      "Canonical state receipts for automated spot trading. Short-lived capabilities bind execution directly to Base smart contracts.",
    highlight: "Sub-50ms token validation with irreversible L2 settlement.",
  },
  {
    id: "zkverify",
    name: "zkVerify Network",
    category: "zk",
    role: "Public Proof Verification & Aggregation",
    badge: "Integrated",
    description:
      "Aggregates SNARK & STARK proofs off-chain, registering portable verification statements that any smart contract or audit desk can inspect.",
    highlight: "Cuts verification overhead by 90% while preserving zero-knowledge guarantees.",
  },
  {
    id: "sp1",
    name: "Succinct SP1 / Risc0",
    category: "zk",
    role: "Zero-Knowledge Virtual Machine (zkVM)",
    badge: "Active Prover",
    description:
      "Generates deterministic proofs that the Rust evidence verifier program executed truthfully over committed action intents and venue state.",
    highlight: "Private portfolio state remains unexposed to third parties.",
  },
  {
    id: "z3",
    name: "Z3 SMT Solver",
    category: "formal",
    role: "Pre-Execution Mathematical Gatekeeper",
    badge: "Runtime Engine",
    description:
      "Evaluates multi-constraint policies (portfolio caps, slippage boundaries, cooldowns) in integer atomic arithmetic before any transaction fires.",
    highlight: "Deterministic SAT / UNSAT resolution in under 4ms.",
  },
  {
    id: "lean4",
    name: "Lean 4 Theorem Prover",
    category: "formal",
    role: "Framework & Compiler Invariant Proofs",
    badge: "Kernel Verified",
    description:
      "Kernel-checks policy compiler soundness, monotonic restriction theorems, and unbypassable authorization invariants before production release.",
    highlight: "Mathematical proof that restrictive policy rules cannot widen agent power.",
  },
  {
    id: "langchain",
    name: "LangChain & LangGraph",
    category: "agents",
    role: "Agentic Workflow Orchestration",
    badge: "Adapter Ready",
    description:
      "Drop-in policy middleware wrapper for tool-calling agents. Prevents prompt jailbreaks from triggering rogue execution calls.",
    highlight: "Protects high-privilege tool calls with one wrapper function.",
  },
  {
    id: "crewai",
    name: "CrewAI & Multi-Agent Teams",
    category: "agents",
    role: "Role-Based Capability Scoping",
    badge: "Multi-Agent Support",
    description:
      "Enforces dual-control separation of duty: research agents draft intents, only designated execution agents can spend capability tokens.",
    highlight: "Fleet-wide budget sharing with isolated agent mandates.",
  },
  {
    id: "arbitrum",
    name: "Ethereum & Arbitrum",
    category: "chains",
    role: "Cross-Chain Settlement Layer",
    badge: "Roadmap Phase 4",
    description:
      "Standardized intent hashes and evidence roots across EVM networks with venue-specific finality policies and reorg protection.",
    highlight: "Deterministic rollback handling with INVALIDATED receipt state.",
  },
];

export function IntegrationsBlock() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? INTEGRATIONS
      : INTEGRATIONS.filter((item) => item.category === activeCategory);

  const categories = [
    { id: "all", label: "All Integrations" },
    { id: "formal", label: "Formal Methods & SMT" },
    { id: "zk", label: "zkVM & Proof Networks" },
    { id: "chains", label: "Execution Venues & Chains" },
    { id: "agents", label: "Agent Frameworks" },
  ];

  return (
    <section id="integrations" className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#303030]/15 dark:border-[#303030]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#161616] dark:text-[#ffffff] leading-tight">
            Plugs into every stage of the <span className="text-[#ff4900]">agent lifecycle</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
            From cognitive frameworks to formal solvers and zero-knowledge proof networks, Swaraj provides an unbypassable bridge between intent and verified venue reality.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((c) => (
              <TextureButton
                key={c.id}
                variant={activeCategory === c.id ? "primary" : "secondary"}
                size="sm"
                className="w-auto rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5"
                onClick={() => setActiveCategory(c.id)}
              >
                <span>{c.label}</span>
              </TextureButton>
            ))}
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#303030]/15 dark:border-[#303030] bg-[#ffffff] dark:bg-[#1e1e1e] p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(255,73,0,0.08)] hover:border-[#ff4900]/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ff4900]/10 text-[#ff4900] flex items-center justify-center font-bold shrink-0">
                      {item.category === "formal" && <Scales size={20} weight="duotone" />}
                      {item.category === "zk" && <ShieldCheck size={20} weight="duotone" />}
                      {item.category === "chains" && <Cube size={20} weight="duotone" />}
                      {item.category === "agents" && <Cpu size={20} weight="duotone" />}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide px-2 sm:px-2.5 py-0.5 rounded-full bg-[#f1f1f1] dark:bg-[#161616] text-[#303030] dark:text-[#f1f1f1]/80 border border-[#303030]/20 dark:border-[#303030]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#161616] dark:text-[#ffffff] group-hover:text-[#ff4900] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#ff4900] mt-0.5 mb-2 leading-tight">
                    {item.role}
                  </p>
                  <p className="text-xs text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#303030]/10 dark:border-[#303030]/60 flex items-center justify-between text-[11px] font-medium text-[#161616] dark:text-[#f8f8f8]">
                  <span className="text-muted-foreground flex items-center gap-1.5 leading-tight">
                    <CheckCircle size={14} className="text-[#ff4900] shrink-0" weight="fill" />
                    <span className="line-clamp-1">{item.highlight}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
