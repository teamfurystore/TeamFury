"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useAppSelector } from "@/store/hooks";
import { selectReviewStats } from "@/features/reviews/reviewsSlice";
import { REVIEW_STATS } from "@/utils/reviews";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function ReviewStats() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: false });

  const list    = useAppSelector((s) => s.reviews.list);
  const loading = useAppSelector((s) => s.reviews.listLoading);

  // Always compute from live API data.
  // Fall back to static seed values only when the DB has zero active reviews.
  const live  = selectReviewStats(list);
  const stats = live.total > 0
    ? live
    : {
        total:    REVIEW_STATS.totalReviews,
        average:  REVIEW_STATS.averageRating,
        fivePct:  REVIEW_STATS.fiveStarPercent,
        fourPct:  REVIEW_STATS.fourStarPercent,
        threePct: REVIEW_STATS.threeStarPercent,
        twoPct:   0,
        onePct:   0,
      };

  const bars = [
    { label: "5 stars", pct: stats.fivePct,  color: "bg-yellow-400" },
    { label: "4 stars", pct: stats.fourPct,  color: "bg-yellow-400/70" },
    { label: "3 stars", pct: stats.threePct, color: "bg-yellow-400/40" },
    { label: "2 stars", pct: stats.twoPct,   color: "bg-yellow-400/20" },
    { label: "1 star",  pct: stats.onePct,   color: "bg-yellow-400/10" },
  ];

  // Skeleton while first load
  if (loading && list.length === 0) {
    return (
      <div className="bg-white/4 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-10 items-center animate-pulse">
        <div className="w-28 h-28 rounded-2xl bg-white/8 shrink-0" />
        <div className="flex-1 w-full flex flex-col gap-3">
          {[80, 60, 30, 10, 5].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-white/8" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="bg-white/4 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-10 items-center"
    >
      {/* ── Big score ── */}
      <div className="text-center shrink-0 min-w-30">
        {/* Average number — keyed so AnimatedCounter restarts when value changes */}
        <div className="text-7xl font-extrabold text-white tabular-nums leading-none">
          <AnimatedCounter
            key={`avg-${stats.average}`}
            to={stats.average}
            decimals={1}
            duration={1.6}
          />
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1 my-3">
          {[1, 2, 3, 4, 5].map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -20 }}
              transition={{ duration: 0.35, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Star
                size={18}
                className={
                  s <= Math.round(stats.average)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-white/20"
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Total count */}
        <p className="text-white/40 text-sm tabular-nums">
          <AnimatedCounter
            key={`total-${stats.total}`}
            to={stats.total}
            suffix="+"
            duration={1.8}
          />
          {" "}reviews
        </p>
      </div>

      {/* ── Rating bars ── */}
      <div className="flex-1 w-full flex flex-col gap-3">
        {bars.map((b, idx) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-12 shrink-0">{b.label}</span>
            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${b.color}`}
                initial={{ width: "0%" }}
                animate={inView ? { width: `${b.pct}%` } : { width: "0%" }}
                transition={{ duration: 1.0, delay: 0.35 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <motion.span
              className="text-xs text-white/40 w-8 text-right tabular-nums"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + idx * 0.08 }}
            >
              {b.pct}%
            </motion.span>
          </div>
        ))}
      </div>

      {/* ── Trust badges ── */}
      <StaggerReveal className="flex flex-col gap-3 shrink-0" stagger={0.1} y={12} duration={0.5}>
        {[
          { icon: "✅", label: "Verified Purchases" },
          { icon: "🔒", label: "Anti-Scam Guarantee" },
          { icon: "⚡", label: "Instant Delivery" },
        ].map((t) => (
          <div key={t.label} className="flex items-center gap-2 text-sm text-white/55">
            <span>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}
