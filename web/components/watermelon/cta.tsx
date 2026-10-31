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
        title="Give the agent the keys. Keep the rules."
        description="Autonomy is the point of an agent. Swaraj is what makes it safe to grant. Rules enforced before execution. A gate whose properties are proven, not promised. Receipts that prove themselves. Wherever your agents act with real stakes, put Swaraj between them and the action."
        buttonText="Let's work together"
        buttonIcon={<ArrowRight className="h-4 w-4" />}
        onButtonClick={onContactClick}
      />
    </div>
  );
}

export { Cta1 };
