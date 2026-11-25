"use client";

import React, { useState } from "react";
import {
  Stage,
  Window,
  Card,
  Row,
  Badge,
  Avatar,
  Bar,
  Text,
  Connector,
  Count,
  Roll,
  type Rect,
  type Layout,
} from "@/kit";
import { useTheme } from "@/components/theme-provider";
import { ShieldCheck, CheckCircle2, XCircle, Key, FileCheck2, Cpu } from "lucide-react";

export type Scenario = "allowed" | "blocked";

interface SwarajGatewayDemoProps {
  scenario?: Scenario;
  onScenarioChange?: (s: Scenario) => void;
}

export function SwarajGatewayDemo({
  scenario: externalScenario,
  onScenarioChange,
}: SwarajGatewayDemoProps) {
  const { theme } = useTheme();
  const [internalScenario, setInternalScenario] = useState<Scenario>("allowed");

  const scenario = externalScenario ?? internalScenario;
  const setScenario = (s: Scenario) => {
    setInternalScenario(s);
    onScenarioChange?.(s);
  };

  const isAllowed = scenario === "allowed";

  // Story data based on scenario
  const amount = isAllowed ? 450 : 250000;
  const venue = isAllowed ? "Uniswap-V3" : "Unknown-Bridge";
  const agent = "portfolio-bot-7";

  return (
    <div className="w-full relative select-none">
      {/* Scenario Switcher on top of the stage */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
            Swaraj Pre-Execution Check
          </span>
        </div>

        <div className="flex items-center p-0.5 rounded-lg bg-neutral-200/70 dark:bg-neutral-800/80 border border-black/5 dark:border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setScenario("allowed")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              isAllowed
                ? "bg-[#ff4900] text-white shadow-xs font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Within Policy
          </button>
          <button
            type="button"
            onClick={() => setScenario("blocked")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              !isAllowed
                ? "bg-rose-600 text-white shadow-xs font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Over The Line
          </button>
        </div>
      </div>

      {/* Stageshow Stage */}
      <Stage
        width={620}
        height={380}
        compact={{ below: 600, width: 358, height: 490 }}
        theme={theme === "light" ? "light" : "dark"}
        tokens={{
          "--ss-accent": "#ff4900",
          "--ss-radius-md": "8px",
          "--ss-radius-window": "16px",
        }}
        className="swaraj-gateway-stage"
      >
        {(_state, rect, layout: Layout) => {
          const isCompact = layout === "compact";
          const intentRef = rect("intent-target");
          const gateRef = rect("gate-target");

          return (
            <div className="relative w-full h-full p-2">
              {/* Hero Window: The Swaraj Policy Gateway */}
              <Window
                url="gateway.swaraj.network"
                urlShape="pill"
                chrome="native"
                lights="color"
                className="w-full shadow-xl"
                style={{
                  height: isCompact ? "auto" : 320,
                  maxHeight: "100%",
                }}
              >
                <div className={`p-4 flex ${isCompact ? "flex-col gap-3" : "flex-row gap-4"} h-full`}>
                  {/* Left Column: Owner Mandate in force */}
                  <div className={`${isCompact ? "w-full" : "w-[210px]"} shrink-0 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-black/10 dark:border-white/10 pb-3 sm:pb-0 sm:pr-3`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">
                          Owner Mandate
                        </span>
                        <Badge tone="accent" className="text-[9px] px-1.5 py-0.5">
                          v2 · LEAN 4
                        </Badge>
                      </div>

                      <div className="space-y-2 mt-2">
                        <div className="p-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                          <div className="text-[10px] text-neutral-400 font-mono">Rule: Per-Trade Cap</div>
                          <div className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                            &le; $1,000.00
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                          <div className="text-[10px] text-neutral-400 font-mono">Allowed Venues</div>
                          <div className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                            Uniswap-V3, Base
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                        <ShieldCheck size={12} className="text-[#ff4900]" />
                        <span>Fail-Closed Enforced</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Agent Intent Proposal */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">
                          Proposed Action Intent
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Status: <strong className="text-[#ff4900]">UNEXECUTED</strong>
                        </span>
                      </div>

                      {/* Intent Card */}
                      <div
                        data-target="intent-target"
                        className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10"
                      >
                        <Row
                          pad={0}
                          lead={<Avatar name={agent} tone="person" size={24} />}
                          title={
                            <div className="flex items-center gap-2">
                              <Text className="text-xs font-mono font-bold">{agent}</Text>
                              <Badge tone="neutral" className="text-[9px]">
                                AGENT
                              </Badge>
                            </div>
                          }
                          subtitle={
                            <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                              Action: <strong className="text-neutral-800 dark:text-neutral-200">SPOT_TRADE</strong>
                            </div>
                          }
                        />

                        <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-2 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Target Venue</span>
                            <span className={`font-semibold ${isAllowed ? "text-neutral-800 dark:text-neutral-200" : "text-rose-500 dark:text-rose-400"}`}>
                              <Roll>{venue}</Roll>
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Proposed Spend</span>
                            <span className={`font-semibold ${isAllowed ? "text-neutral-800 dark:text-neutral-200" : "text-rose-500 dark:text-rose-400"}`}>
                              $<Count value={amount} format={(n) => n.toLocaleString()} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pre-Execution Verifier Ribbon */}
                    <div className="mt-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                        <Cpu size={13} className="text-[#ff4900]" />
                        <span>Z3 Deterministic Evaluator</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        Lean 4 theorem verified
                      </span>
                    </div>
                  </div>
                </div>
              </Window>

              {/* Satellite Card: The Swaraj Decision & Proof Receipt */}
              <div
                data-target="gate-target"
                className={`absolute z-20 ${
                  isCompact
                    ? "left-4 right-4 bottom-3"
                    : "right-6 bottom-4 w-[310px]"
                }`}
              >
                <Card
                  pad="medium"
                  lift
                  className={`border transition-all duration-300 backdrop-blur-md ${
                    isAllowed
                      ? "bg-white/95 dark:bg-[#1a2e22]/95 border-emerald-500/30 text-neutral-900 dark:text-emerald-100 shadow-2xl"
                      : "bg-white/95 dark:bg-[#2e1a1a]/95 border-rose-500/30 text-neutral-900 dark:text-rose-100 shadow-2xl"
                  }`}
                  style={{
                    boxShadow: "var(--ss-shadow-satellite)",
                  }}
                >
                  {/* Gate Verdict Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
                      {isAllowed ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>3. SWARAJ: ALLOWED</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="text-rose-500" />
                          <span>3. SWARAJ: BLOCKED</span>
                        </>
                      )}
                    </span>
                    <Badge
                      tone={isAllowed ? "success" : "danger"}
                      dot
                      className="text-[9px] uppercase tracking-wide font-bold"
                    >
                      {isAllowed ? "Permit Issued" : "Violates Cap"}
                    </Badge>
                  </div>

                  {/* Verdict Details */}
                  <div className="text-xs leading-relaxed mb-2.5 font-sans">
                    {isAllowed ? (
                      <p className="text-neutral-600 dark:text-neutral-300 text-[11px]">
                        Intent satisfies every rule. Single-use capability token released.
                      </p>
                    ) : (
                      <p className="text-neutral-600 dark:text-neutral-300 text-[11px]">
                        Exceeds $1,000 cap &amp; venue not allowlisted. Zero execution.
                      </p>
                    )}
                  </div>

                  {/* Token & Receipt Metadata */}
                  <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-1.5 text-[10px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                        <Key size={11} className={isAllowed ? "text-[#ff4900]" : "text-neutral-400"} />
                        <span>Capability Token</span>
                      </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {isAllowed ? "tok_9f4e2a (60s TTL)" : "WITHHELD"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                        <FileCheck2 size={11} className="text-emerald-500" />
                        <span>Receipt #rcpt_{isAllowed ? "0847f2" : "block_091"}</span>
                      </span>
                      <span className="text-[#ff4900] font-bold">
                        {isAllowed ? "PROVED (zkVM)" : "LOGGED"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Connector from Intent to Gate Satellite (on wide screens) */}
              {!isCompact && intentRef.width > 0 && gateRef.width > 0 && (
                <Connector
                  show={true}
                  from={{
                    x: intentRef.x + intentRef.width * 0.7,
                    y: intentRef.y + intentRef.height,
                  }}
                  to={{
                    x: gateRef.x + 30,
                    y: gateRef.y,
                  }}
                  route="step"
                  arrow
                  label={isAllowed ? "Z3: ALLOW" : "Z3: DENY"}
                  labelAt={0.4}
                />
              )}
            </div>
          );
        }}
      </Stage>
    </div>
  );
}
