"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export function ContactSection() {
  /* Form state preserved for when form is uncommented
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage("Please write your message.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    setErrorMessage("");
  };
  */

  return (
    <section
      id="contact"
      className="relative w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] text-white border-t border-neutral-900 overflow-hidden selection:bg-[#ff4900]/30"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.12]">
          Let&apos;s work together
        </h2>

        {/* Subtitle / Description */}
        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl mx-auto">
          Autonomy is the point of an agent. Swaraj is what makes it safe to grant. Wherever your agents act with real stakes, put Swaraj between them and the action.
        </p>

        {/* Direct Contact - E-mail Card */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <a
            href="mailto:drongolabs.tech@gmail.com"
            className="flex items-center gap-4 sm:gap-5 px-6 py-4 rounded-2xl bg-[#101114] border border-white/10 hover:border-[#ff4900]/60 transition-all duration-200 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,73,0,0.25)]"
          >
            <div className="w-12 h-12 rounded-full bg-[#16171b] border border-white/10 flex items-center justify-center shrink-0 text-neutral-300 group-hover:text-[#ff4900] group-hover:border-[#ff4900]/40 transition-all duration-200">
              <Mail className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-neutral-400 font-normal mb-0.5 tracking-wide">
                E-mail
              </span>
              <span className="text-base sm:text-lg font-semibold text-white tracking-wide group-hover:text-[#ff4900] transition-colors">
                drongolabs.tech@gmail.com
              </span>
            </div>
          </a>
        </div>

        {/* ================= CONTACT FORM (COMMENTED OUT) ================= */}
        {/*
        <div className="mt-12 w-full max-w-xl mx-auto text-left">
          {isSubmitted ? (
            <div className="bg-[#101114] border border-white/10 rounded-2xl p-8 sm:p-10 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-[#ff4900]/15 text-[#ff4900] flex items-center justify-center mx-auto mb-4 border border-[#ff4900]/30 shadow-[0_0_20px_rgba(255,73,0,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Message Sent Successfully!
              </h4>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-6 leading-relaxed">
                Thank you, <span className="text-white font-medium">{formData.name}</span>! Your submission has been received and our team will get in touch at <span className="text-white font-medium">{formData.email}</span>.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-sm font-medium transition-all duration-200 cursor-pointer hover:border-white/20 active:scale-[0.98]"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl animate-in fade-in duration-200">
                  {errorMessage}
                </div>
              )}

              <div>
                <label
                  htmlFor="full-name"
                  className="block text-xs sm:text-[13px] font-medium tracking-wide text-neutral-300 mb-2"
                >
                  Full name
                </label>
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-[#101114] hover:bg-[#131418] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder:text-neutral-500 text-sm sm:text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#ff4900] focus:ring-4 focus:ring-[#ff4900]/15 focus:bg-[#121317] focus:shadow-[0_0_20px_rgba(255,73,0,0.12)] transition-all duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="email-address"
                  className="block text-xs sm:text-[13px] font-medium tracking-wide text-neutral-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  className="w-full bg-[#101114] hover:bg-[#131418] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder:text-neutral-500 text-sm sm:text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#ff4900] focus:ring-4 focus:ring-[#ff4900]/15 focus:bg-[#121317] focus:shadow-[0_0_20px_rgba(255,73,0,0.12)] transition-all duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-[13px] font-medium tracking-wide text-neutral-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full bg-[#101114] hover:bg-[#131418] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder:text-neutral-500 text-sm sm:text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#ff4900] focus:ring-4 focus:ring-[#ff4900]/15 focus:bg-[#121317] focus:shadow-[0_0_20px_rgba(255,73,0,0.12)] transition-all duration-200 resize-none min-h-[130px]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-linear-to-b from-[#ff5714] to-[#ff4900] hover:from-[#ff4900] hover:to-[#e04100] text-white font-semibold text-base sm:text-lg tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(255,73,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_25px_rgba(255,73,0,0.5)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Message</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        */}
      </div>
    </section>
  );
}
