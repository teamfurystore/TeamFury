"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/utils/config";

export default function HeroHomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setLoaded(true);
    v.addEventListener("canplay", onCanPlay);
    if (v.readyState >= 3) setLoaded(true);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-150 overflow-hidden flex items-center justify-center">

      {/* ── Fallback gradient shown until video loads ── */}
      <div
        className={`absolute inset-0 bg-linear-to-br from-[#1a0000] via-[#0d0d0d] to-[#0a0010] transition-opacity duration-1000 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Animated grid lines for gaming feel while loading */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />
        {/* Pulsing center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      {/* ── Video ── */}
      <video
        ref={videoRef}
        src="/homepageValorant.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${
          loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
      />

      {/* ── Dark vignette ── */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-[#0d0d0d]" />
      {/* Red scanlines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.015)_2px,rgba(255,0,0,0.015)_4px)] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-6">

        <p
          className={`text-red-500 text-xs font-bold tracking-[0.4em] uppercase transition-all duration-700 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          {SITE_CONFIG.tagline}
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          {["Get", "Your", "Dream", "Valorant", "Account"].map((word, i) => (
            <span
              key={word}
              className={`inline-block mr-4 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-sm"
              } ${word === "Dream" || word === "Valorant" ? "text-red-500 animate-glow" : ""}`}
              style={{ transitionDelay: `${400 + i * 120}ms` }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          className={`text-white/60 text-lg max-w-xl transition-all duration-700 delay-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {SITE_CONFIG.description}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {SITE_CONFIG.stats.map((s, idx) => (
            <span
              key={s.label}
              className={`bg-white/10 backdrop-blur border border-white/15 text-white/80 text-sm px-4 py-1.5 rounded-full transition-all duration-500 ${
                loaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              style={{ transitionDelay: `${1100 + idx * 100}ms` }}
            >
              {s.label}
            </span>
          ))}
        </div>

        <div
          className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-1400 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href={SITE_CONFIG.shopUrl}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 active:scale-95"
          >
            Browse All Accounts
          </Link>
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/25 hover:border-white/50 backdrop-blur bg-white/5 text-white/80 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Get Help Choosing
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-1800 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-white/50 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
