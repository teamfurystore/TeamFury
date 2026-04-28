"use client";

import { ABOUT_WHY, ABOUT_FOOTER_NOTE } from "@/utils/about";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function WhyCard({ item, index }: { item: typeof ABOUT_WHY[0]; index: number }) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-sm"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="group relative rounded-2xl border border-white/8 bg-white/3 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-500 p-6 overflow-hidden cursor-default h-full">
        {/* Hover glow */}
        <div className="absolute inset-0 bg-linear-to-br from-red-600/0 to-red-900/0 group-hover:from-red-600/8 group-hover:to-red-900/5 transition-all duration-500 pointer-events-none rounded-2xl" />
        {/* Top edge accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/60 transition-all duration-500" />

        {/* Number watermark */}
        <span className="absolute top-4 right-5 text-6xl font-extrabold text-white/4 select-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative flex flex-col gap-3">
          <span className="text-3xl">{item.emoji}</span>
          <h3 className="font-bold text-white text-base group-hover:text-red-400 transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

function ManifestoSection() {
  const { ref, visible } = useScrollReveal(0.15);

  const lines = [
    { text: "Built by", accent: false },
    { text: "GAMERS,", accent: true },
    { text: "for", accent: false },
    { text: "GAMERS.", accent: true },
  ];

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Red grid bg */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-950/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-size-[80px_80px] pointer-events-none" />
      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-red-600/8 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto text-center relative">
        <div className="overflow-hidden mb-4">
          <p className={`text-xs font-bold tracking-[0.4em] uppercase text-red-500 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}>
            Our Manifesto
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span
                className={`block text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                } ${line.accent ? "text-red-500 animate-glow" : "text-white"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <p className={`text-white/40 text-base max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {ABOUT_FOOTER_NOTE}
        </p>
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const items = [
    "⚡ Instant Delivery",
    "🛡️ 100% Verified",
    "🤝 Post-Sale Support",
    "🚫 Anti-Scam",
    "🎮 1000+ Accounts",
    "⭐ 4.9 Rating",
    "💬 24/7 Support",
    "🏆 Trusted by Gamers",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="py-4 border-y border-red-900/20 bg-red-950/5 overflow-hidden">
      <div
        className="flex gap-10 whitespace-nowrap w-max"
        style={{ animation: "marquee 22s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-semibold text-red-500/40 uppercase tracking-widest shrink-0">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function AboutWhySection() {
  const { ref: headRef, visible: headVisible } = useScrollReveal(0.2);

  return (
    <>
      <MarqueeStrip />

      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div ref={headRef} className="mb-14 flex flex-col gap-3">
          <div className={`transition-all duration-700 ${headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500">Why Us</span>
            <div className={`mt-2 h-px w-12 bg-red-500 origin-left transition-all duration-700 delay-200 ${headVisible ? "scale-x-100" : "scale-x-0"}`} />
          </div>
          <h2 className={`text-3xl md:text-4xl font-extrabold transition-all duration-700 delay-100 ${headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Why 1000+ gamers<br />
            <span className="text-red-500">choose TEAM FURY</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ABOUT_WHY.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      <ManifestoSection />
    </>
  );
}
