"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { motion, useInView } from "motion/react";
import { REVIEW_STATS } from "@/utils/reviews";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function ReviewStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: false });

  const bars = [
    { label: "5 stars", pct: REVIEW_STATS.fiveStarPercent,  color: "bg-yellow-400" },
    { label: "4 stars", pct: REVIEW_STATS.fourStarPercent,  color: "bg-yellow-400/70" },
    { label: "3 stars", pct: REVIEW_STATS.threeStarPercent, color: "bg-yellow-400/40" },
    { label: "2 stars", pct: 0,                             color: "bg-yellow-400/20" },
    { label: "1 star",  pct: 0,                             color: "bg-yellow-400/10" },
  ];

  return (
    <div
      ref={ref}
      className="bg-white/4 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-10 items-center"
    >
      {/* Big score */}
      <div className="text-center shrink-0">
        <div className="text-7xl font-extrabold text-white tabular-nums">
          <AnimatedCounter to={4.9} decimals={1} duration={1.6} />
        </div>
        <div className="flex justify-center gap-1 my-2">
          {[1,2,3,4,5].map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -30 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Star size={20} className="fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}
        </div>
        <p className="text-white/40 text-sm">
          <AnimatedCounter to={REVIEW_STATS.totalReviews} suffix="+" duration={1.8} />
          {" "}reviews
        </p>
      </div>

      {/* Rating bars */}
      <div className="flex-1 w-full flex flex-col gap-3">
        {bars.map((b, idx) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-12 shrink-0">{b.label}</span>
            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${b.color}`}
                initial={{ width: "0%" }}
                animate={inView ? { width: `${b.pct}%` } : { width: "0%" }}
                transition={{ duration: 1.1, delay: 0.4 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <motion.span
              className="text-xs text-white/40 w-8 text-right"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
            >
              {b.pct}%
            </motion.span>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <StaggerReveal className="flex flex-col gap-3 shrink-0" stagger={0.1} y={15} duration={0.5}>
        {[
          { icon: "✅", label: "Verified Purchases" },
          { icon: "🔒", label: "Anti-Scam Guarantee" },
          { icon: "⚡", label: "Instant Delivery" },
        ].map((t) => (
          <div key={t.label} className="flex items-center gap-2 text-sm text-white/55">
            <span>{t.icon}</span> {t.label}
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}
