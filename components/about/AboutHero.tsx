"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ABOUT_HERO, ABOUT_STATS } from "@/utils/about";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";
import SplitText from "@/components/ui/SplitText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const ease = [0.16, 1, 0.3, 1] as const;

// Parse stat value to number for AnimatedCounter
function parseStatValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

export default function AboutHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setLoaded(true);
    v.addEventListener("canplay", onReady);
    if (v.readyState >= 3) setLoaded(true);
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  return (
    <>
      {/* ── CINEMATIC HERO ── */}
      <section className="relative w-full h-screen min-h-150 overflow-hidden flex items-center justify-center">

        {/* Fallback */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-size-[60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-150 h-150 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Chunked video */}
        <video
          ref={videoRef}
          src="/ValoClip.mp4"
          autoPlay loop muted playsInline preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/35 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(220,38,38,0.012)_3px,rgba(220,38,38,0.012)_4px)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* Content — Motion entrance */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-7">
          {/* Word-by-word headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight">
            {["TEAM", "FURY"].map((word, i) => (
              <motion.span
                key={word}
                className={`inline-block mr-5 ${i === 1 ? "text-red-500" : "text-white"}`}
                initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
                animate={loaded ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15, ease }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-white/50 text-lg max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.4, ease }}
          >
            India&apos;s most trusted Valorant account marketplace — built by gamers, for gamers.
          </motion.p>

          <motion.div
            className="w-24 h-px bg-linear-to-r from-transparent via-red-500 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={loaded ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 1, ease }}
          />
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <span className="text-white/25 text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-red-400/60 rounded-full animate-scroll-dot" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 px-6 border-y border-red-900/20 bg-red-950/5">
        <StaggerReveal
          className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          stagger={0.13}
          y={30}
          duration={0.65}
        >
          {ABOUT_STATS.map((s) => {
            const { num, suffix } = parseStatValue(s.value);
            return (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-4xl md:text-5xl font-extrabold text-red-500 tabular-nums">
                  <AnimatedCounter to={num} suffix={suffix} duration={1.6} />
                </span>
                <span className="text-xs text-white/40 uppercase tracking-widest font-medium">{s.label}</span>
              </div>
            );
          })}
        </StaggerReveal>
      </section>

      {/* ── STORY ── */}
      <StorySection />
    </>
  );
}

function StorySection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div className="flex flex-col gap-6">
          <ScrollReveal direction="left" delay={0} duration={0.6}>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500">Our Story</span>
            <div className="mt-2 h-px w-12 bg-red-500" />
          </ScrollReveal>

          <SplitText
            text="We didn't just build a store. We fixed a broken market."
            tag="h2"
            className="text-3xl md:text-4xl font-extrabold leading-tight"
            accentWords={["fixed", "broken", "market."]}
            stagger={0.04}
            duration={0.65}
          />

          {ABOUT_HERO.description.slice(0, 2).map((para, i) => (
            <ScrollReveal key={i} direction="left" delay={0.1 + i * 0.1} duration={0.65}>
              <p className="text-white/55 text-sm leading-relaxed">{para}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* Right: glowing card */}
        <ScrollReveal direction="right" delay={0.05} duration={0.8}>
          <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-linear-to-br from-red-950/30 to-[#0a0a0a] p-8">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-900/20 rounded-full blur-2xl pointer-events-none" />
            <StaggerReveal className="relative flex flex-col gap-5" stagger={0.1} y={20} duration={0.55}>
              {[
                { icon: "🛡️", text: "Every account manually verified before listing" },
                { icon: "⚡", text: "Delivery within 5 minutes of payment" },
                { icon: "🤝", text: "Post-sale support — we don't ghost you" },
                { icon: "🚫", text: "Zero tolerance for stolen or hacked accounts" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl w-10 shrink-0">{item.icon}</span>
                  <span className="text-white/70 text-sm leading-snug">{item.text}</span>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
