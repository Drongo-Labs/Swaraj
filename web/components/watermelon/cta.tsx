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
        title="Deploy autonomous agents with mathematical certainty."
        description="Rules enforced before execution. A gate whose properties are proven, not promised. Receipts that prove themselves. Integrate Swaraj's formal authorization layer into your agent stack."
        buttonText="Let's work together"
        buttonIcon={<ArrowRight className="h-4 w-4" />}
        onButtonClick={onContactClick}
      />
    </div>
  );
}

export { Cta1 };
