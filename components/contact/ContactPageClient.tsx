"use client";

import { useState } from "react";
import { CONTACT_HERO, CONTACT_CHANNELS, CONTACT_FAQ } from "@/utils/contact";
import ContactForm from "./ContactForm";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function ContactPageClient() {
  return (
    <div className="font-sans overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative text-center pt-20 pb-14 px-6 max-w-2xl mx-auto overflow-hidden">
        {/* bg glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-80 bg-red-600/8 rounded-full blur-3xl" />
        </div>
        <SplitText
          text={CONTACT_HERO.heading}
          tag="h1"
          className="text-4xl font-extrabold mb-3"
          accentWords={["Us"]}
          stagger={0.05}
          duration={0.65}
          threshold="top 95%"
        />

        <ScrollReveal direction="up" delay={0.2} duration={0.6}>
          <p className="text-white/45 text-base">{CONTACT_HERO.subheading}</p>
        </ScrollReveal>
      </section>

      {/* ── Main grid ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Left — channels */}
        <div className="flex flex-col gap-6">
          <ScrollReveal direction="left" duration={0.65}>
            <div>
              <h2 className="text-xl font-extrabold mb-2">Get in Touch</h2>
              <p className="text-white/45 text-sm leading-relaxed">
                Reach us directly through any of the channels below. We typically
                respond within minutes on WhatsApp.
              </p>
            </div>
          </ScrollReveal>

          <StaggerReveal className="flex flex-col gap-3" stagger={0.1} y={24} duration={0.6}>
            {CONTACT_CHANNELS.map((ch) => (
              <a
                key={ch.title}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all hover:-translate-y-0.5 group ${
                  ch.highlight
                    ? "bg-emerald-600/8 border-emerald-500/30 hover:border-emerald-400/60"
                    : "bg-white/4 border-white/8 hover:border-white/20"
                }`}
              >
                <span className="text-2xl shrink-0">{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white">{ch.title}</p>
                  <p className="text-white/40 text-xs truncate mt-0.5">{ch.desc}</p>
                </div>
                <span className={`text-xs font-bold shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  ch.highlight ? "text-emerald-400" : "text-white/30"
                }`}>
                  →
                </span>
              </a>
            ))}
          </StaggerReveal>
        </div>

        {/* Right — form */}
        <ScrollReveal direction="right" duration={0.7}>
          <ContactForm />
        </ScrollReveal>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 px-6 max-w-4xl mx-auto pb-20">
        <ScrollReveal direction="up" duration={0.6}>
          <h2 className="text-2xl font-extrabold mb-8">Frequently Asked Questions</h2>
        </ScrollReveal>
        <FAQList />
      </section>
    </div>
  );
}

function FAQList() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <StaggerReveal className="flex flex-col gap-3" stagger={0.08} y={20} duration={0.55}>
      {CONTACT_FAQ.map((item, i) => (
        <div key={i} className="border border-white/8 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/4 transition-colors"
          >
            <span className="font-medium text-sm text-white/85">{item.q}</span>
            <span className="text-white/40 text-lg ml-4 shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>
              +
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-sm text-white/55 leading-relaxed border-t border-white/8 pt-4">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </StaggerReveal>
  );
}
