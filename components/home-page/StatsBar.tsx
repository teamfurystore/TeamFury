"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import StaggerReveal from "@/components/ui/StaggerReveal";

interface Stat {
  to: number;
  suffix: string;
  label: string;
  prefix: string;
  decimals?: number;
}

const STATIC_STATS: Stat[] = [
  { to: 1500, suffix: "+", label: "Accounts Sold", prefix: "" },
  { to: 5, suffix: "m", label: "Avg Delivery", prefix: "< " },
];

export default function StatsBar() {
  const [rating, setRating] = useState<number>(4.9);
  const [accountsAvailable, setAccountsAvailable] = useState<number>(0);

  useEffect(() => {
    // Fetch live active product count
    fetch("/api/shop/products")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setAccountsAvailable(json.data.length);
        }
      })
      .catch(() => { });

    // Fetch live reviews and compute average rating
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json) && json.length > 0) {
          const avg =
            json.reduce((sum: number, r: { rating: number }) => sum + Number(r.rating), 0) /
            json.length;
          setRating(Math.round(avg * 10) / 10);
        }
      })
      .catch(() => { });
  }, []);

  const stats: Stat[] = [
    STATIC_STATS[0],
    { to: rating, suffix: "", label: "Average Rating", prefix: "⭐ ", decimals: 1 },
    { to: accountsAvailable, suffix: "", label: "Accounts Available", prefix: "" },
    STATIC_STATS[1],
  ];

  return (
    <section className="py-14 px-6 border-y border-white/5 bg-white/2">
      <StaggerReveal
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        stagger={0.13}
        y={30}
        duration={0.65}
      >
        {stats.map((s) => (
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
