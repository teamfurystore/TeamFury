"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SITE_CONFIG } from "@/utils/config";

export default function Hero() {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <section
      ref={ref}
      className="relative text-center py-24 px-6 max-w-4xl mx-auto overflow-hidden"
    >
      {/* Ambient glows — animate on reveal */}
      <div
        className={`absolute -top-10 -left-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      />
      <div
        className={`absolute -bottom-10 -right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 delay-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      />

      {/* Tagline */}
      <p
        className={`text-red-500 text-xs font-bold tracking-[0.35em] uppercase mb-3 transition-all duration-600 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        {SITE_CONFIG.tagline}
      </p>

      {/* H1 — word-by-word stagger */}
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
        {[
          { word: "Get",      accent: false },
          { word: "Your",     accent: false },
          { word: "Dream",    accent: true  },
          { word: "Valorant", accent: true  },
          { word: "Account",  accent: false },
        ].map(({ word, accent }, i) => (
          <span
            key={word}
            className={`inline-block mr-3 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-sm"
            } ${accent ? "text-red-500 animate-glow" : ""}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {word}
          </span>
        ))}
      </h1>

      {/* Description */}
      <p
        className={`text-white/60 text-lg max-w-xl mx-auto mb-10 transition-all duration-700 delay-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {SITE_CONFIG.description}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {SITE_CONFIG.stats.map((s, idx) => (
          <span
            key={s.label}
            className={`bg-white/5 border border-white/10 text-white/70 text-sm px-4 py-1.5 rounded-full transition-all duration-500 ${
              visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
            }`}
            style={{ transitionDelay: `${600 + idx * 100}ms` }}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div
        className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-[900ms] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
    </section>
  );
}
