"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SITE_CONFIG, TRUST_BADGES } from "@/utils/config";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: false });

  return (
    <section ref={ref} className="relative py-28 px-6 text-center overflow-hidden">

      {/* Animated bg glow — Motion */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-80 bg-red-600/8 blur-3xl rounded-full mx-auto max-w-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.025)_1px,transparent_1px)] bg-size-[60px_60px]" />
      </motion.div>

      {/* Border frame draws in — Motion */}
      <motion.div
        className="absolute inset-8 rounded-3xl border border-red-500/15 pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-7">

        {/* Headline split text — GSAP */}
        <SplitText
          text="Ready to Own Your Dream Account?"
          tag="h2"
          className="text-4xl md:text-5xl font-extrabold leading-tight"
          accentWords={["Dream", "Account?"]}
          stagger={0.04}
          duration={0.7}
          threshold="top 90%"
        />

        {/* Sub — GSAP scroll */}
        <ScrollReveal direction="up" delay={0.15} duration={0.65}>
          <p className="text-white/50 text-base max-w-xl leading-relaxed">
            Don&apos;t spend months collecting skins. Get your premium Valorant account with exclusive items today.
          </p>
        </ScrollReveal>

        {/* Buttons — GSAP scale */}
        <ScrollReveal direction="scale" delay={0.25} duration={0.65}>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={SITE_CONFIG.shopUrl}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-9 py-3.5 rounded-full transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 active:scale-95"
            >
              Browse All Accounts
            </a>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-9 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Get Help Choosing
            </a>
          </div>
        </ScrollReveal>

        {/* Trust badges */}
        <ScrollReveal direction="up" delay={0.35} duration={0.6}>
          <div className="flex flex-wrap justify-center gap-6 text-white/35 text-xs">
            {TRUST_BADGES.map((b) => (
              <span key={b} className="flex items-center gap-1.5">
                <span className="text-green-400 text-sm">✓</span> {b}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
