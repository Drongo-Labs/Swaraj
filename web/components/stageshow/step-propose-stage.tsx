"use client";

import React from "react";
import { Stage, Card, Row, Avatar, Badge, Bar, Text } from "@/kit";
import { useTheme } from "@/components/theme-provider";
import { FileJson, CheckCircle2 } from "lucide-react";

export function StepProposeStage() {
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
        className="step-propose-stage"
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
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-300 font-bold">
                  <FileJson size={14} className="text-[#ff4900]" />
                  <span>ActionIntent.json</span>
                </div>
                <Badge tone="success" dot className="text-[9px]">
                  Schema Valid
                </Badge>
              </div>

              {/* Agent Details Row */}
              <div className="pt-2">
                <Row
                  pad={0}
                  lead={<Avatar name="portfolio-bot-7" tone="person" size={20} />}
                  title={
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        portfolio-bot-7
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        id: 0x9f4a...
                      </span>
                    </div>
                  }
                  subtitle={
                    <span className="font-mono text-[10px] text-neutral-500">
                      action: <strong className="text-[#ff4900]">SPOT_TRADE</strong>
                    </span>
                  }
                />
              </div>

              {/* Typed Parameters Table */}
              <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-1.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04]">
                  <span className="text-[9px] text-neutral-400 block uppercase font-sans">Venue</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px]">
                    Uniswap-V3
                  </span>
                </div>
                <div className="p-1.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04]">
                  <span className="text-[9px] text-neutral-400 block uppercase font-sans">Amount</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px]">
                    $450.00
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Stage>
    </div>
  );
}
