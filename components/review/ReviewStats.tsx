"use client";

import { Star } from "lucide-react";
import { REVIEW_STATS } from "@/utils/reviews";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

export default function ReviewStats() {
  const { ref, visible } = useScrollReveal(0.2);
  const animatedRating = useCountUp(49, 1400, visible); // 49 → display as "4.9"
  const animatedTotal  = useCountUp(REVIEW_STATS.totalReviews, 1800, visible);

  const bars = [
    { label: "5 stars", pct: REVIEW_STATS.fiveStarPercent,   color: "bg-yellow-400" },
    { label: "4 stars", pct: REVIEW_STATS.fourStarPercent,   color: "bg-yellow-400/70" },
    { label: "3 stars", pct: REVIEW_STATS.threeStarPercent,  color: "bg-yellow-400/40" },
    { label: "2 stars", pct: 0,                              color: "bg-yellow-400/20" },
    { label: "1 star",  pct: 0,                              color: "bg-yellow-400/10" },
  ];

  return (
    <div
      ref={ref}
      className={`bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Big score */}
      <div className="text-center shrink-0">
        <p
          className={`text-7xl font-extrabold text-white transition-all duration-700 delay-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          {(animatedRating / 10).toFixed(1)}
        </p>
        <div className="flex justify-center gap-1 my-2">
          {[1, 2, 3, 4, 5].map((s, i) => (
            <Star
              key={s}
              size={18}
              className={`fill-yellow-400 text-yellow-400 transition-all duration-300 ${
                visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{ transitionDelay: `${300 + i * 60}ms` }}
            />
          ))}
        </div>
        <p className="text-white/40 text-sm">
          {animatedTotal.toLocaleString()}+ reviews
        </p>
      </div>

      {/* Bars — animate width from 0 → real value on reveal */}
      <div className="flex-1 w-full flex flex-col gap-3">
        {bars.map((b, idx) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-12 shrink-0">{b.label}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${b.color} transition-all duration-1000 ease-out`}
                style={{
                  width: visible ? `${b.pct}%` : "0%",
                  transitionDelay: `${400 + idx * 120}ms`,
                }}
              />
            </div>
            <span
              className={`text-xs text-white/40 w-8 text-right transition-all duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${600 + idx * 120}ms` }}
            >
              {b.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="flex flex-col gap-3 shrink-0">
        {[
          { icon: "✅", label: "Verified Purchases" },
          { icon: "🔒", label: "Anti-Scam Guarantee" },
          { icon: "⚡", label: "Instant Delivery" },
        ].map((t, i) => (
          <div
            key={t.label}
            className={`flex items-center gap-2 text-sm text-white/60 transition-all duration-500 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{ transitionDelay: `${500 + i * 100}ms` }}
          >
            <span>{t.icon}</span> {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}
