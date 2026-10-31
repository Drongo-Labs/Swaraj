import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  date?: string;
}

export interface Faq1Props {
  id?: string;
  badge?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  faqs: FaqItem[];
  defaultValue?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  className?: string;
}

export function Faq1({
  id = "faq",
  badge,
  title,
  description,
  faqs,
  defaultValue,
  footerText,
  footerLinkText,
  footerLinkHref,
  className,
}: Faq1Props) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24",
        className
      )}
    >
      <div className="mb-10 sm:mb-16 flex flex-col items-center text-center">
        {badge && (
          <span className="bg-[#ff4900]/10 text-[#ff4900] border border-[#ff4900]/20 mb-4 inline-flex items-center rounded-full px-3.5 py-1 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            {badge}
          </span>
        )}
        <h2 className="text-foreground max-w-2xl text-3xl sm:text-4xl lg:text-5xl leading-tight font-extrabold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl">
            {description}
          </p>
        )}
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={defaultValue ?? faqs[0]?.id}
        className="w-full flex flex-col gap-3 sm:gap-4"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#303030]/15 dark:border-[#303030] px-5 sm:px-6 transition-all duration-200 overflow-hidden data-[state=open]:border-[#ff4900]/40 data-[state=open]:bg-[#f8f8f8] dark:data-[state=open]:bg-[#1e1e1e] data-[state=open]:shadow-sm hover:border-[#ff4900]/30"
          >
            <AccordionTrigger className="group flex items-center py-5 sm:py-6 hover:no-underline cursor-pointer select-none [&_[data-slot=accordion-trigger-icon]]:!hidden">
              <span className="text-foreground pr-3 sm:pr-4 text-left text-sm sm:text-base md:text-lg font-bold leading-snug">
                {faq.question}
              </span>
              <div className="text-muted-foreground ml-auto flex shrink-0 items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 dark:border-white/10 group-data-[state=open]:bg-[#ff4900] group-data-[state=open]:text-white group-data-[state=open]:border-[#ff4900] bg-[#f1f1f1] dark:bg-[#252525] text-[#303030] dark:text-[#f1f1f1] transition-colors">
                <FaPlus className="block h-3.5 w-3.5 group-data-[state=open]:hidden" />
                <FaMinus className="hidden h-3.5 w-3.5 group-data-[state=open]:block" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5 sm:pb-6">
              <div className="text-xs sm:text-sm md:text-base text-[#303030]/85 dark:text-[#f1f1f1]/75 leading-relaxed border-t border-[#303030]/10 dark:border-[#303030]/50 pt-3 sm:pt-4">
                <p>{faq.answer}</p>
                {faq.date && (
                  <div className="text-muted-foreground/70 mt-3 text-xs sm:text-sm font-medium">
                    {faq.date}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {(footerText || footerLinkText) && (
        <div className="mt-10 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
          {footerText}{" "}
          {footerLinkText && (
            <a
              href={footerLinkHref || "#contact"}
              className="font-semibold text-[#ff4900] hover:underline underline-offset-4 transition-colors"
            >
              {footerLinkText}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
