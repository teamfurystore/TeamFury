"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ABOUT_WHY, ABOUT_FOOTER_NOTE } from "@/utils/about";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";
import SplitText from "@/components/ui/SplitText";
import GsapMarquee from "@/components/ui/GsapMarquee";

function WhyCard({ item, index }: { item: typeof ABOUT_WHY[0]; index: number }) {
  return (
    <div className="group relative rounded-2xl border border-white/8 bg-white/3 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-400 p-6 overflow-hidden cursor-default h-full">
      {/* Top edge accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/60 transition-all duration-500" />
      {/* Hover glow */}
      <div className="absolute inset-0 bg-linear-to-br from-red-600/0 to-red-900/0 group-hover:from-red-600/8 group-hover:to-red-900/5 transition-all duration-500 pointer-events-none rounded-2xl" />
      <div className="relative flex flex-col gap-3">
        <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">{item.emoji}</span>
        <h3 className="font-bold text-white text-base group-hover:text-red-400 transition-colors duration-300">{item.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15, once: false });

  const lines = [
    { text: "Built by", accent: false },
    { text: "GAMERS,", accent: true },
    { text: "for", accent: false },
    { text: "GAMERS.", accent: true },
  ];

  return (
    <section ref={ref} className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-950/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-size-[80px_80px] pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-red-600/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Label */}
        <div className="overflow-hidden mb-4">
          <motion.p
            className="text-xs font-bold tracking-[0.4em] uppercase text-red-500"
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Manifesto
          </motion.p>
        </div>

        {/* Big words */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className={`block text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight ${
                  line.accent ? "text-red-500 animate-glow" : "text-white"
                }`}
                initial={{ y: "110%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {line.text}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.p
          className="text-white/40 text-base max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {ABOUT_FOOTER_NOTE}
        </motion.p>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  "⚡ Instant Delivery", "🛡️ 100% Verified", "🤝 Post-Sale Support",
  "🚫 Anti-Scam", "🎮 1000+ Accounts", "⭐ 4.9 Rating",
  "💬 24/7 Support", "🏆 Trusted by Gamers",
];

export default function AboutWhySection() {
  return (
    <>
      {/* GSAP marquee — speeds up on scroll */}
      <div className="py-4 border-y border-red-900/20 bg-red-950/5">
        <GsapMarquee speed={22}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-red-500/40 uppercase tracking-widest shrink-0">
              {item}
            </span>
          ))}
        </GsapMarquee>
      </div>

      {/* Why section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="mb-14">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500">Why Us</span>
          <div className="mt-2 h-px w-12 bg-red-500" />
          <SplitText
            text="Why 1000+ gamers choose TEAM FURY"
            tag="h2"
            className="mt-3 text-3xl md:text-4xl font-extrabold"
            accentWords={["FURY"]}
            stagger={0.04}
            duration={0.65}
          />
        </ScrollReveal>

        <StaggerReveal
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          stagger={0.1}
          y={40}
          duration={0.65}
        >
          {ABOUT_WHY.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </StaggerReveal>
      </section>

      <ManifestoSection />
    </>
  );
}
