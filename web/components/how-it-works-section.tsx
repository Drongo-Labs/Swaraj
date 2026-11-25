"use client";

import React from "react";
import {
  FileCode2,
  ShieldCheck,
  Receipt,
  Sparkles,
} from "lucide-react";
import { StepProposeStage } from "@/components/stageshow/step-propose-stage";
import { StepAuthorizeStage } from "@/components/stageshow/step-authorize-stage";
import { StepExecuteStage } from "@/components/stageshow/step-execute-stage";

interface HowItWorksSectionProps {
  onContactClick?: () => void;
}

export function HowItWorksSection({ onContactClick }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#f8f8f8] dark:bg-[#121212] text-[#161616] dark:text-[#f8f8f8] border-t border-black/10 dark:border-[#303030] transition-colors duration-300 overflow-hidden"
    >
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#161616] dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Three deterministic beats between agent reasoning and execution. Soft suggestions become hard mathematical guarantees.
          </p>
        </div>

        {/* The Three Beats Grid: Bento composition adhering to Stageshow rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* BEAT 1: Propose */}
          <div className="flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#181818] border border-black/10 dark:border-neutral-800 hover:border-[#ff4900]/40 transition-all duration-300 shadow-sm group">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5">
                  Step 01
                </span>
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-black/5 dark:border-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:text-[#ff4900] transition-colors">
                  <FileCode2 size={16} />
                </div>
              </div>

              {/* Title & Copy */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161616] dark:text-white mb-2">
                Propose
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The agent submits a strictly-typed structured intent. No natural language or free text reaches the gate.
              </p>
            </div>

            {/* Stageshow Miniature Component Stage */}
            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <StepProposeStage />
            </div>
          </div>

          {/* BEAT 2: Authorize (Hero Card) */}
          <div className="flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#181818] border-2 border-[#ff4900]/60 hover:border-[#ff4900] transition-all duration-300 shadow-lg shadow-[#ff4900]/5 relative group">
            {/* Hero Pill Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#ff4900] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
              Core Proof Gate
            </div>

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff4900] text-white shadow-xs">
                  Step 02
                </span>
                <div className="w-8 h-8 rounded-full bg-[#ff4900]/15 border border-[#ff4900]/30 flex items-center justify-center text-[#ff4900]">
                  <ShieldCheck size={18} />
                </div>
              </div>

              {/* Title & Copy */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161616] dark:text-white mb-2">
                Authorize
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Z3 evaluates the intent against the owner&apos;s mandate. Machine-checked Lean 4 theorem: <em>no execution occurs without an explicit permit</em>.
              </p>
            </div>

            {/* Stageshow Miniature Component Stage */}
            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <StepAuthorizeStage />
            </div>
          </div>

          {/* BEAT 3: Execute & Prove */}
          <div className="flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#181818] border border-black/10 dark:border-neutral-800 hover:border-[#ff4900]/40 transition-all duration-300 shadow-sm group">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5">
                  Step 03
                </span>
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-black/5 dark:border-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:text-[#ff4900] transition-colors">
                  <Receipt size={16} />
                </div>
              </div>

              {/* Title & Copy */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161616] dark:text-white mb-2">
                Execute &amp; Prove
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Only permitted actions release a one-shot capability token. Every decision is sealed into a signed receipt, promoted to PROVED via zkVM.
              </p>
            </div>

            {/* Stageshow Miniature Component Stage */}
            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <StepExecuteStage />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
