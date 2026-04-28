"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import StaggerReveal from "@/components/ui/StaggerReveal";

const STATS = [
  { to: 1000, suffix: "+", label: "Accounts Sold",   prefix: "" },
  { to: 4.9,  suffix: "",  label: "Average Rating",  prefix: "⭐ ", decimals: 1 },
  { to: 500,  suffix: "+", label: "Happy Customers", prefix: "" },
  { to: 5,    suffix: "m", label: "Avg Delivery",    prefix: "< " },
];

export default function StatsBar() {
  return (
    <section className="py-14 px-6 border-y border-white/5 bg-white/2">
      <StaggerReveal
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        stagger={0.13}
        y={30}
        duration={0.65}
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5">
            <span className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
              <AnimatedCounter
                to={s.to}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
                duration={1.8}
              />
            </span>
            <span className="text-xs text-white/40 uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </StaggerReveal>
    </section>
  );
}
