"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const STATS = [
  { value: 1000, suffix: "+", label: "Accounts Sold",    prefix: "" },
  { value: 4.9,  suffix: "",  label: "Average Rating",   prefix: "⭐ ", decimals: 1 },
  { value: 500,  suffix: "+", label: "Happy Customers",  prefix: "" },
  { value: 5,    suffix: "m", label: "Avg Delivery",     prefix: "< " },
];

function CountStat({
  value,
  suffix,
  label,
  prefix,
  decimals = 0,
  active,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  prefix: string;
  decimals?: number;
  active: boolean;
  delay: number;
}) {
  // For decimals, multiply target so useCountUp works with integers
  const intTarget = decimals > 0 ? Math.round(value * 10) : value;
  const raw = useCountUp(intTarget, 1800, active);
  const display = decimals > 0 ? (raw / 10).toFixed(1) : raw.toLocaleString();

  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
        {prefix}{display}{suffix}
      </span>
      <span className="text-xs text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <section
      ref={ref}
      className={`py-12 px-6 border-y border-white/5 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <CountStat
            key={s.label}
            {...s}
            active={visible}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  );
}
