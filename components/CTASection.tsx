"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SITE_CONFIG, TRUST_BADGES } from "@/utils/config";

export default function CTASection() {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <section ref={ref} className="relative py-20 px-6 text-center max-w-3xl mx-auto overflow-hidden">
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-red-600/5 rounded-3xl blur-3xl pointer-events-none transition-all duration-1000 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      />

      <h2
        className={`text-4xl font-extrabold mb-4 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        Ready to Own Your{" "}
        <span className="text-red-500 animate-glow">Dream Account?</span>
      </h2>

      <p
        className={`text-white/50 mb-10 text-base transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        Don&apos;t spend months collecting skins. Get your premium Valorant account with exclusive items today.
      </p>

      <div
        className={`flex flex-wrap justify-center gap-4 mb-10 transition-all duration-700 delay-400 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <a
          href={SITE_CONFIG.shopUrl}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
        >
          Browse All Accounts
        </a>
        <a
          href={SITE_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
        >
          Get Help Choosing
        </a>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-white/40 text-xs">
        {TRUST_BADGES.map((b, idx) => (
          <span
            key={b}
            className={`flex items-center gap-1 transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${600 + idx * 100}ms` }}
          >
            <span className="text-green-400">✓</span> {b}
          </span>
        ))}
      </div>
    </section>
  );
}
