"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function StatsBar() {
  const [rating, setRating] = useState<number>(4.9);
  const [accountsAvailable, setAccountsAvailable] = useState<number | null>(null);

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

  return (
    <section className="py-14 px-6 border-y border-white/5 bg-white/2">
      <StaggerReveal
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        stagger={0.13}
        y={30}
        duration={0.65}
      >
        {/* Accounts Sold — static */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
            <AnimatedCounter to={1500} suffix="+" duration={1.8} />
          </span>
          <span className="text-xs text-white/40 uppercase tracking-widest">Accounts Sold</span>
        </div>

        {/* Average Rating — live */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
            <AnimatedCounter
              key={`rating-${rating}`}
              to={rating}
              prefix="⭐ "
              decimals={1}
              duration={1.8}
            />
          </span>
          <span className="text-xs text-white/40 uppercase tracking-widest">Average Rating</span>
        </div>

        {/* Accounts Available — live */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
            {accountsAvailable === null ? (
              <span className="animate-pulse text-white/30">—</span>
            ) : (
              <AnimatedCounter
                key={`available-${accountsAvailable}`}
                to={accountsAvailable}
                duration={1.8}
              />
            )}
          </span>
          <span className="text-xs text-white/40 uppercase tracking-widest">Accounts Available</span>
        </div>

        {/* Avg Delivery — static */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
            <AnimatedCounter to={5} prefix="< " suffix="m" duration={1.8} />
          </span>
          <span className="text-xs text-white/40 uppercase tracking-widest">Avg Delivery</span>
        </div>
      </StaggerReveal>
    </section>
  );
}
