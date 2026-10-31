"use client";

import React from "react";
import { Cta1 } from "@/components/ui/cta-1";
import { ArrowRight } from "lucide-react";

interface CtaProps {
  onContactClick?: () => void;
}

export function CtaBlock({ onContactClick }: CtaProps) {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Cta1
        title="Deploy Autonomous Agents with Mathematical Certainty"
        description="Stop prompt-injection losses before they reach the blockchain or cloud. Integrate Swaraj formal authorization and portable receipts into your agent stack."
        buttonText="Trial Request"
        buttonIcon={<ArrowRight className="h-4 w-4" />}
        onButtonClick={onContactClick}
      />
    </div>
  );
}

export { Cta1 };
