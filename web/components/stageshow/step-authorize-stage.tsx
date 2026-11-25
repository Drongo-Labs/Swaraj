"use client";

import React, { useState, useEffect } from "react";
import { Stage, Card, Badge, Count, Meter } from "@/kit";
import { useTheme } from "@/components/theme-provider";
import { ShieldCheck, CheckCircle2, Key, Cpu } from "lucide-react";

export function StepAuthorizeStage() {
  const { theme } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(58);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s <= 10 ? 60 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[220px] relative flex items-center justify-center overflow-hidden">
      <Stage
        width={340}
        height={210}
        compact={{ below: 360, width: 300, height: 210 }}
        theme={theme === "light" ? "light" : "dark"}
        tokens={{
          "--ss-accent": "#ff4900",
          "--ss-radius-md": "8px",
        }}
        className="step-authorize-stage"
      >
        {() => (
          <div className="p-2 w-full h-full flex flex-col justify-end">
            <Card
              pad="medium"
              lift
              className="w-full border border-[#ff4900]/30 bg-white/95 dark:bg-[#1a1e1a]/95 backdrop-blur-sm"
              style={{
                boxShadow: "0 0 0 1px rgba(255, 73, 0, 0.2), var(--ss-shadow-satellite)",
              }}
            >
              {/* Z3 Decision Engine Header */}
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 font-bold">
                  <Cpu size={14} className="text-[#ff4900]" />
                  <span>Z3 Policy Evaluator</span>
                </div>
                <Badge tone="success" dot className="text-[9px] uppercase font-bold">
                  ALLOW Issued
                </Badge>
              </div>

              {/* Theorem checks */}
              <div className="py-2 space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Rule 1: Cap &le; $1,000</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} /> PASS
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Rule 2: Allowed Venue</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} /> PASS
                  </span>
                </div>
              </div>

              {/* Single-use Capability Token Minted */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <div className="p-2 rounded-lg bg-[#ff4900]/10 border border-[#ff4900]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-900 dark:text-white">
                    <Key size={13} className="text-[#ff4900]" />
                    <span className="font-bold text-[11px]">tok_0x9f4e2a</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#ff4900]">
                    <Count value={secondsLeft} format={(n) => `${n}s`} />
                    <span className="text-neutral-400 font-normal">TTL</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Stage>
    </div>
  );
}
