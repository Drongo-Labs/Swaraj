"use client";

import React from "react";
import { Stage, Card, Badge, Row, Bar, Text } from "@/kit";
import { useTheme } from "@/components/theme-provider";
import { Receipt, ShieldCheck, CheckCheck, Hash } from "lucide-react";

export function StepExecuteStage() {
  const { theme } = useTheme();

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
        className="step-execute-stage"
      >
        {() => (
          <div className="p-2 w-full h-full flex flex-col justify-end">
            <Card
              pad="medium"
              lift
              className="w-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#1a1a1a]/95 backdrop-blur-sm"
              style={{
                boxShadow: "var(--ss-shadow-satellite)",
              }}
            >
              {/* Receipt Header */}
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 font-bold">
                  <Receipt size={14} className="text-[#ff4900]" />
                  <span>Receipt #rcpt_0847f2</span>
                </div>
                <Badge tone="accent" dot className="text-[9px] font-bold uppercase">
                  PROVED
                </Badge>
              </div>

              {/* Receipt Verification Body */}
              <div className="py-2 space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <Hash size={11} /> Intent Digest
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    0x8a3c...e41b
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Mandate Version</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    mandate_v2
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">zkVM Verifier</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCheck size={12} /> SP1 Verified
                  </span>
                </div>
              </div>

              {/* Cryptographic Seal Footer */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-neutral-400">Attested on Base</span>
                <span className="text-[#ff4900] font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> zkVerify Confirmed
                </span>
              </div>
            </Card>
          </div>
        )}
      </Stage>
    </div>
  );
}
