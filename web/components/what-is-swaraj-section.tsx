"use client";

import React from "react";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  GitBranch,
} from "lucide-react";
import { SwarajGatewayDemo } from "@/components/stageshow/swaraj-gateway-demo";

interface WhatIsSwarajSectionProps {
  onContactClick?: () => void;
}

export function WhatIsSwarajSection({ onContactClick }: WhatIsSwarajSectionProps) {
  return (
    <section
      id="what-swaraj-is"
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-white dark:bg-[#161616] text-[#161616] dark:text-[#f8f8f8] border-t border-black/10 dark:border-[#303030] transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Core Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-[#161616] dark:text-white">
              What is Swaraj?
            </h2>

            {/* Body */}
            <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              The owner writes a mandate. The agent proposes what it wants to do. Swaraj allows or blocks that action <strong className="font-semibold text-[#161616] dark:text-white">before it executes</strong>, then records the decision with a proof-carrying receipt.
            </p>

            {/* Soft limits become real enforcement banner */}
            <div className="mt-8 p-5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#ff4900] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#161616] dark:text-white tracking-tight">
                    Soft limits become real enforcement.
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    <em>&ldquo;Please don&apos;t spend more than $1,000&rdquo;</em> is a suggestion in a prompt, vulnerable to jailbreaks, drift, and hallucination. Swaraj turns it into a rigid pre-execution gate. And the gate isn&apos;t just tested — its core properties are <strong className="font-semibold text-[#161616] dark:text-white">proven</strong>, machine-checked in Lean 4.
                  </p>
                </div>
              </div>
            </div>

            {/* Three pillars */}
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                <GitBranch size={16} className="text-[#ff4900] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#161616] dark:text-white">Owner-authored mandate</strong>
                  <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">—</span>
                  <span className="text-neutral-600 dark:text-neutral-300">versioned, revisable by the owner, untouchable by the agent.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                <Lock size={16} className="text-[#ff4900] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#161616] dark:text-white">Pre-execution gate</strong>
                  <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">—</span>
                  <span className="text-neutral-600 dark:text-neutral-300">Z3 decision engine over Lean-proven core; default-deny, fail-closed.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                <FileCheck2 size={16} className="text-[#ff4900] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#161616] dark:text-white">Proof-carrying receipts</strong>
                  <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">—</span>
                  <span className="text-neutral-600 dark:text-neutral-300">a signed record promoted from PENDING to PROVED with zkVM verification.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stageshow Faux Product UI Stage */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <SwarajGatewayDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
