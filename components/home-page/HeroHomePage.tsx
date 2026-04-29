"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SITE_CONFIG } from "@/utils/config";

const ease = [0.16, 1, 0.3, 1] as const;

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

      {/* Fallback bg */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        src="/homepageValorant.mp4"
        autoPlay loop muted playsInline preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ${loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-[#0d0d0d]" />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(220,38,38,0.012)_3px,rgba(220,38,38,0.012)_4px)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-7">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <span className="inline-block text-xs font-bold tracking-[0.4em] uppercase text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-1.5 rounded-full">
            {SITE_CONFIG.tagline}
          </span>
        </motion.div>

        {/* Headline — word by word */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
          {["Get", "Your", "Dream", "Valorant", "Account"].map((word, i) => (
            <motion.span
              key={word}
              className={`inline-block mr-4 ${word === "Dream" || word === "Valorant" ? "text-red-500" : "text-white"}`}
              initial={{ y: 80, opacity: 0, filter: "blur(8px)" }}
              animate={loaded ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.75, delay: 0.35 + i * 0.1, ease }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub */}
        <motion.p
          className="text-white/55 text-lg max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6, ease }}
        >
          {SITE_CONFIG.description}
        </motion.p>

        {/* Stat pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {SITE_CONFIG.stats.map((s, idx) => (
            <motion.span
              key={s.label}
              className="bg-white/8 backdrop-blur border border-white/12 text-white/70 text-sm px-4 py-1.5 rounded-full"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.15 + idx * 0.08, ease }}
            >
              {s.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.35, ease }}
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
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <span className="text-white/25 text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-red-400/60 rounded-full animate-scroll-dot" />
        </div>
      </motion.div>
    </section>
  );
}
