"use client";

import { useEffect, useRef, useState } from "react";
import { ABOUT_HERO, ABOUT_STATS } from "@/utils/about";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function StatCounter({ value, label }: { value: string; label: string }) {
  const { ref, visible } = useScrollReveal(0.3);
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-1 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <span className={`text-4xl md:text-5xl font-extrabold text-red-500 tabular-nums ${visible ? "animate-glow" : ""}`}>
        {value}
      </span>
      <span className="text-xs text-white/40 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function AboutHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const words = ABOUT_HERO.heading.replace("About Us – ", "").split(" ");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // canplay fires as soon as the browser has enough data to start
    const onReady = () => setLoaded(true);
    v.addEventListener("canplay", onReady);
    if (v.readyState >= 3) setLoaded(true);
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full h-screen min-h-150 overflow-hidden flex items-center justify-center">

        {/* Static fallback — visible instantly, fades out when video ready */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          {/* Red grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-size-[60px_60px]" />
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-150 h-150 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Chunked video — browser streams 1MB at a time via Range requests */}
        <video
          ref={videoRef}
          src="/api/video/ValoClip.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${
            loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/35 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/60" />
        {/* Red scanlines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(239,68,68,0.015)_2px,rgba(239,68,68,0.015)_4px)] pointer-events-none" />
        {/* Bottom red glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-red-950/20 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-6">

          {/* Badge */}
          <div className={`transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-1.5 rounded-full">
              {ABOUT_HERO.name}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight">
            {words.map((word, i) => (
              <span
                key={i}
                className={`inline-block mr-4 transition-all duration-700 ${
                  loaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-sm"
                } ${i === 1 ? "text-red-500 animate-glow" : "text-white"}`}
                style={{ transitionDelay: `${300 + i * 130}ms` }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p className={`text-white/50 text-lg max-w-xl leading-relaxed transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            India&apos;s most trusted Valorant account marketplace — built by gamers, for gamers.
          </p>

          {/* Red divider line */}
          <div className={`w-24 h-px bg-linear-to-r from-transparent via-red-500 to-transparent transition-all duration-1000 delay-900 origin-center ${loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />
        </div>

        {/* Scroll cue */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-1200 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <span className="text-white/25 text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-red-400/60 rounded-full animate-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 px-6 border-y border-red-900/20 bg-red-950/5">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {ABOUT_STATS.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      <StorySection />
    </>
  );
}

function StorySection() {
  const { ref, visible } = useScrollReveal(0.1);
  const { ref: ref2, visible: visible2 } = useScrollReveal(0.1);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div ref={ref} className="flex flex-col gap-6">
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500">Our Story</span>
            <div className={`mt-2 h-px w-12 bg-red-500 origin-left transition-all duration-700 delay-200 ${visible ? "scale-x-100" : "scale-x-0"}`} />
          </div>
          <h2 className={`text-3xl md:text-4xl font-extrabold leading-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            We didn&apos;t just build a store.<br />
            <span className="text-red-500">We fixed a broken market.</span>
          </h2>
          {ABOUT_HERO.description.slice(0, 2).map((para, i) => (
            <p
              key={i}
              className={`text-white/55 text-sm leading-relaxed transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Right: glowing card */}
        <div ref={ref2} className={`transition-all duration-700 delay-200 ${visible2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
          <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-linear-to-br from-red-950/30 to-[#0a0a0a] p-8">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-900/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col gap-5">
              {[
                { icon: "🛡️", text: "Every account manually verified before listing" },
                { icon: "⚡", text: "Delivery within 5 minutes of payment" },
                { icon: "🤝", text: "Post-sale support — we don't ghost you" },
                { icon: "🚫", text: "Zero tolerance for stolen or hacked accounts" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 transition-all duration-500 ${visible2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <span className="text-2xl w-10 shrink-0">{item.icon}</span>
                  <span className="text-white/70 text-sm leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
