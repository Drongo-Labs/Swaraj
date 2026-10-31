"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { WhatIsSwarajSection } from "@/components/what-is-swaraj-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { WhoItsForSection } from "@/components/who-its-for-section";
import { FaqBlock } from "@/components/watermelon/faq";
import { ContactSection } from "@/components/contact-section";
import { CtaBlock } from "@/components/watermelon/cta";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const scrollToContact = () => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactEl.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#f8f8f8] dark:bg-[#161616] text-[#161616] dark:text-[#f8f8f8] transition-colors duration-300">
      {/* Fixed Sticky Navbar across the entire website */}
      <Navbar onContactClick={scrollToContact} />

      {/* 1. Header & Hero Section with DotGrid (#ff4900) */}
      <div id="overview" className="w-full">
        <HeroSection
          onContactClick={scrollToContact}
          onHowItWorksClick={scrollToHowItWorks}
        />
      </div>

      {/* 2. What Swaraj is */}
      <WhatIsSwarajSection onContactClick={scrollToContact} />

      {/* 3. How it works */}
      <HowItWorksSection onContactClick={scrollToContact} />

      {/* 4. Who it's for */}
      <WhoItsForSection onContactClick={scrollToContact} />

      {/* 5. Frequently Asked Questions */}
      <FaqBlock />

      {/* 3. Contact Us */}
      <ContactSection />

      {/* 4. Conversion CTA Banner with Marquee */}
      <CtaBlock onContactClick={scrollToContact} />

      {/* 5. Minimalist Editorial Footer inspired by Equals with Swaraj brand & massive wordmark */}
      <Footer onContactClick={scrollToContact} />
    </main>
  );
}
