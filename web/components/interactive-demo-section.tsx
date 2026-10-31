"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  GlobeSimple,
  ShieldCheck,
  Lightning,
  Cube,
  Copy,
  Check,
  Terminal,
  Code,
  ArrowRight,
  ShieldChevron,
} from "@phosphor-icons/react";
import { TextureButton } from "@/components/ui/texture-button";
import { cn } from "@/lib/utils";

export function InteractiveDemoSection() {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"sdk" | "policy">("sdk");

  const sdkCode = `import { SwarajGateway, AgentIntent } from "@swaraj/sdk";

// 1. Initialize Swaraj verifier with owner policy profile
const gateway = new SwarajGateway({
  policyHash: "0x9d4e21a48c6e88a0322198b1b22e11893c834a91",
  verifier: "https://base.verifier.swaraj.network",
});

// 2. Wrap autonomous agent action proposal
const intent: AgentIntent = {
  actionType: "SPOT_TRADE",
  venue: "base.uniswap.v3",
  assetIn: "USDC",
  assetOut: "WETH",
  amountAtomic: 500000000n, // $500 USDC (6 decimals)
  maxSlippageBps: 25,
};

// 3. Mathematical gate: checks Z3 constraints in <4ms
const authorization = await gateway.authorize(intent);

if (authorization.isAllowed()) {
  // Capability token is short-lived, single-use, intent-bound
  const receipt = await executionAdapter.execute(authorization.capabilityToken);
  console.log("PROVED receipt generated:", receipt.proofHash);
} else {
  console.error("Action blocked by policy:", authorization.unsatCore);
}`;

  const policyCode = `// Formal Swaraj Mandate (Base Spot Trading Policy)
policy SpotTradeMandate {
  version: 2,
  venue: "base.uniswap.v3",
  allowed_assets: ["USDC", "WETH", "CBBTC"],
  max_trade_atomic: 1000_000_000,    // Max $1,000 per trade
  max_position_bps: 1500,             // Max 15% of total portfolio
  daily_turnover_cap: 10_000_000_000, // Max $10,000 / 24h
  max_slippage_bps: 50,               // Max 0.5% slippage
  cooldown_seconds: 120,              // 2-minute cooldown between trades
  evidence_requirement: "CANONICAL_CHAIN_STATE",
  finality_rule: "BASE_BATCH_FINALIZED"
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeCodeTab === "sdk" ? sdkCode : policyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#161616] border-t border-[#303030]/15 dark:border-[#303030]">
      <div className="max-w-7xl mx-auto">
        {/* Region: Earth / Global Autonomous Network Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#ff4900]/10 text-[#ff4900] border border-[#ff4900]/25 mb-4">
            <GlobeSimple size={14} weight="bold" />
            <span>Region: Global Execution Net</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#161616] dark:text-[#ffffff] leading-tight">
            The trust fabric for the <span className="text-[#ff4900]">Agentic Economy</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
            When autonomous agents manage billions in economic transactions, code prompts are not enough. Swaraj delivers microsecond authorization and portable cryptographic settlement worldwide.
          </p>
        </div>

        {/* Global Globe Illustration / 3D Wireframe Hemisphere (Inspiration Style) */}
        <div className="relative w-full max-w-4xl mx-auto mb-16 sm:mb-20 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#303030]/20 dark:border-[#303030] bg-linear-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 sm:p-8 lg:p-12 shadow-2xl">
          {/* Subtle Orange Glow Backdrop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff4900]/20 rounded-full blur-3xl pointer-events-none" />

          {/* SVG Globe Hemisphere */}
          <div className="relative flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 800 340"
              className="w-full max-w-2xl text-[#ff4900] h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Globe Longitude / Latitude Rings */}
              <ellipse cx="400" cy="300" rx="360" ry="160" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4" />
              <ellipse cx="400" cy="300" rx="300" ry="120" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
              <ellipse cx="400" cy="300" rx="200" ry="80" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
              <ellipse cx="400" cy="300" rx="100" ry="40" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />

              {/* Meridian lines */}
              <path d="M 40 300 C 40 160, 760 160, 760 300" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
              <path d="M 120 300 C 120 180, 680 180, 680 300" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
              <path d="M 220 300 C 220 210, 580 210, 580 300" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="400" y1="140" x2="400" y2="340" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Glowing Active Nodes */}
              <circle cx="280" cy="220" r="6" fill="#ffffff" filter="drop-shadow(0 0 8px #ff4900)" />
              <circle cx="400" cy="180" r="8" fill="#ff4900" filter="drop-shadow(0 0 12px #ff4900)" />
              <circle cx="520" cy="230" r="6" fill="#ffffff" filter="drop-shadow(0 0 8px #ff4900)" />
              <circle cx="180" cy="260" r="5" fill="#ff4900" />
              <circle cx="620" cy="255" r="5" fill="#ff4900" />
              <circle cx="340" cy="260" r="5" fill="#ffffff" />
              <circle cx="460" cy="250" r="5" fill="#ffffff" />

              {/* Connection Arcs */}
              <path d="M 280 220 Q 340 170 400 180" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 400 180 Q 460 190 520 230" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 180 260 Q 230 230 280 220" stroke="#ff4900" strokeOpacity="0.6" strokeWidth="1.2" />
              <path d="M 520 230 Q 570 235 620 255" stroke="#ff4900" strokeOpacity="0.6" strokeWidth="1.2" />
            </svg>

            {/* Verification Stats Over Globe (Responsive Grid) */}
            <div className="mt-6 w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#303030] text-center text-white">
              <div className="pt-2 sm:pt-0 sm:px-2">
                <span className="block text-2xl sm:text-3xl font-black text-[#ff4900]">
                  330+
                </span>
                <span className="text-[11px] sm:text-xs text-[#f1f1f1]/70 font-medium">
                  Verified L2 Nodes &amp; Gateways
                </span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-2">
                <span className="block text-2xl sm:text-3xl font-black text-white">
                  &lt; 4ms
                </span>
                <span className="text-[11px] sm:text-xs text-[#f1f1f1]/70 font-medium">
                  SMT Authorization Latency
                </span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-2">
                <span className="block text-2xl sm:text-3xl font-black text-[#ff4900]">
                  100%
                </span>
                <span className="text-[11px] sm:text-xs text-[#f1f1f1]/70 font-medium">
                  Deterministic Proof Invariance
                </span>
              </div>
            </div>
          </div>

          {/* 3 Columns Below Globe (Inspiration Page Layout) */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#303030] grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                <GlobeSimple size={18} className="text-[#ff4900]" weight="bold" />
                <span>Execute Everywhere</span>
              </div>
              <p className="text-xs text-[#f1f1f1]/70 leading-relaxed">
                Single-use capability tokens integrate with EVM smart contracts, L2 rollup sequencers, and REST/gRPC API adapters without agent lock-in.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                <Lightning size={18} className="text-[#ff4900]" weight="bold" />
                <span>Authorize Anywhere</span>
              </div>
              <p className="text-xs text-[#f1f1f1]/70 leading-relaxed">
                Lightweight Z3 SMT runtime engine sits directly inside microservices or sidecars, resolving SAT / UNSAT decisions at wire speed.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                <ShieldChevron size={18} className="text-[#ff4900]" weight="bold" />
                <span>Verify at Scale</span>
              </div>
              <p className="text-xs text-[#f1f1f1]/70 leading-relaxed">
                Zero-knowledge proof aggregation via zkVerify condenses thousands of agent executions into tamper-proof on-chain audit roots.
              </p>
            </div>
          </div>
        </div>

        {/* Live Interactive Code & Developer Integration (Inspiration Style) */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#161616] dark:text-white tracking-tight leading-tight">
              Go from <span className="font-mono text-[#ff4900]">prompt hallucination</span> to <span className="font-mono text-[#ff4900]">formal certainty</span>
            </h3>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
              Integrate in minutes. Wrap your AI agent&apos;s tool execution with Swaraj to enforce mathematical boundaries and capture portable receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Terminal Live Demo Simulation (Left) */}
            <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-[#303030]/20 dark:border-[#303030] bg-[#161616] text-[#f1f1f1] p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#303030] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-mono text-[10px] sm:text-[11px] text-[#f1f1f1]/70">
                    swaraj-agent-runtime
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  ONLINE
                </span>
              </div>

              {/* Terminal Logs Flow */}
              <div className="mt-4 font-mono text-[11px] sm:text-xs space-y-2.5 leading-relaxed overflow-x-auto">
                <p className="text-[#888888]">$ swaraj daemon --mode=enforce --venue=base</p>
                <p className="text-emerald-400">✓ Swaraj runtime v0.2 initialized on Base Mainnet</p>
                <p className="text-[#888888]">
                  [10:22:15] Agent #849 proposes Action Intent:
                  <br />
                  <span className="text-white">  → SPOT_TRADE: Swap 500 USDC for WETH</span>
                </p>
                <div className="p-2.5 rounded-lg bg-[#222222] border border-[#303030] text-[10px] sm:text-[11px]">
                  <p className="text-[#ff4900] font-bold">⚡ SMT Evaluation (Z3 Solver):</p>
                  <p className="text-[#f1f1f1]/80">  • venue ∈ allowed_venues: SAT (0.4ms)</p>
                  <p className="text-[#f1f1f1]/80">  • amount_atomic &le; cap: SAT (0.6ms)</p>
                  <p className="text-[#f1f1f1]/80">  • daily_turnover: $500/$10,000 SAT (0.3ms)</p>
                  <p className="text-emerald-400 font-semibold">  → RESULT: ALLOW (Capability minted)</p>
                </div>
                <p className="text-[#888888]">
                  [10:22:16] Execution Adapter dispatched tx:
                  <br />
                  <span className="text-sky-400">  → Base Tx: 0x82b1...9c14 (Mined block 219804)</span>
                </p>
                <div className="p-2.5 rounded-lg bg-[#18231c] border border-emerald-500/30 text-[10px] sm:text-[11px] text-emerald-300">
                  <p className="font-bold">✓ zkVM Verification Receipt (SP1):</p>
                  <p>  Status: PROVED (Deterministic validation)</p>
                  <p>  zkVerify Statement: 0x4f88...a9b2 (Confirmed)</p>
                </div>
              </div>
            </div>

            {/* Developer Code Tabs (Right) */}
            <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-[#303030]/20 dark:border-[#303030] bg-[#1a1a1a] p-4 sm:p-6 shadow-xl text-white">
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#303030]">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TextureButton
                    variant={activeCodeTab === "sdk" ? "brand" : "minimal"}
                    size="sm"
                    className="w-auto text-xs px-2.5 sm:px-3 py-1"
                    onClick={() => setActiveCodeTab("sdk")}
                  >
                    <span>agent-executor.ts</span>
                  </TextureButton>
                  <TextureButton
                    variant={activeCodeTab === "policy" ? "brand" : "minimal"}
                    size="sm"
                    className="w-auto text-xs px-2.5 sm:px-3 py-1"
                    onClick={() => setActiveCodeTab("policy")}
                  >
                    <span>mandate.policy</span>
                  </TextureButton>
                </div>

                {/* Copy Button */}
                <TextureButton
                  variant="secondary"
                  size="sm"
                  className="w-auto text-xs px-2.5 sm:px-3 py-1 ml-auto sm:ml-0"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </TextureButton>
              </div>

              {/* Code Box */}
              <div className="mt-4 overflow-x-auto font-mono text-[11px] sm:text-xs text-[#f1f1f1]/90 leading-relaxed bg-[#111111] p-3 sm:p-4 rounded-xl border border-[#303030]">
                <pre>{activeCodeTab === "sdk" ? sdkCode : policyCode}</pre>
              </div>

              {/* Quick Install Bar */}
              <div className="mt-4 pt-3 border-t border-[#303030] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#888888]">
                <span className="font-mono text-[#ff4900]">npm install @swaraj/sdk</span>
                <span className="text-[11px] sm:text-xs text-[#f1f1f1]/60">Compatible with Next.js, Node.js, Python, Rust</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
