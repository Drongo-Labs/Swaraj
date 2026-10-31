"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TextureButton } from "@/components/ui/texture-button";
import { House, ArrowLeft, WarningCircle, ShieldSlash } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f8f8] dark:bg-[#161616] text-[#161616] dark:text-[#ffffff] px-4 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff4900]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl w-full text-center flex flex-col items-center">
        {/* Navbar Logo */}
        <div className="mb-8">
          <Image
            src="/swaraj_navbar_logo_dark.png"
            alt="Swaraj Logo"
            width={160}
            height={40}
            className="h-10 w-auto object-contain mx-auto hidden dark:block"
          />
          <Image
            src="/swaraj_navbar_logo_light.png"
            alt="Swaraj Logo"
            width={160}
            height={40}
            className="h-10 w-auto object-contain mx-auto block dark:hidden"
          />
        </div>

        {/* Large 404 Display */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-[#161616] dark:text-white font-mono">
          404
        </h1>

        <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#161616] dark:text-white leading-tight">
          Page Not Found
        </h2>


        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
          <Link href="/" className="w-full sm:w-auto">
            <TextureButton variant="brand" size="lg" className="w-full sm:w-auto rounded-full shadow-lg">
              <House size={18} weight="bold" />
              <span>Return to Swaraj Gateway</span>
            </TextureButton>
          </Link>

          <Link href="/#faq" className="w-full sm:w-auto">
            <TextureButton variant="secondary" size="lg" className="w-full sm:w-auto rounded-full">
              <WarningCircle size={18} weight="bold" />
              <span>View System FAQ</span>
            </TextureButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
