"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicReviews } from "@/features/reviews/reviewsSlice";
import ReviewStats from "@/components/review/ReviewStats";
import ReviewCard from "@/components/review/ReviewCard";
import WriteReviewForm from "@/components/review/WriteReviewForm";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";
import GsapMarquee from "@/components/ui/GsapMarquee";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const MARQUEE_ITEMS = [
  "⭐ 4.9 Average Rating",
  "✅ 1000+ Verified Reviews",
  "⚡ Instant Delivery",
  "🛡️ 100% Verified Accounts",
  "🤝 Post-Sale Support",
  "🏆 Trusted by Gamers",
];

export default function ReviewPageClient() {
  const dispatch = useAppDispatch();
  const { list: reviews, listLoading } = useAppSelector((s) => s.reviews);

  useEffect(() => { dispatch(fetchPublicReviews()); }, [dispatch]);

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-red-600/8 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <ScrollReveal direction="up" delay={0} duration={0.6}>
            <p className="text-red-500 text-xs font-bold tracking-[0.4em] uppercase mb-4">
              Trusted by 1000+ Gamers
            </p>
          </ScrollReveal>
          <SplitText
            text="What Our Customers Say"
            tag="h1"
            className="text-4xl md:text-6xl font-extrabold mb-5"
            accentWords={["Customers"]}
            stagger={0.05}
            duration={0.7}
            threshold="top 95%"
          />
          <ScrollReveal direction="up" delay={0.3} duration={0.65}>
            <p className="text-white/45 text-base max-w-xl mx-auto leading-relaxed">
              Real reviews from real buyers. Every review is from a verified purchase.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="py-4 border-y border-red-900/20 bg-red-950/5">
        <GsapMarquee speed={24}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-red-500/40 uppercase tracking-widest shrink-0">
              {item}
            </span>
          ))}
        </GsapMarquee>
      </div>

      {/* ── STATS ── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <ScrollReveal direction="up" duration={0.8}>
          <ErrorBoundary variant="inline">
            <ReviewStats />
          </ErrorBoundary>
        </ScrollReveal>
      </section>

      {/* ── REVIEWS GRID ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <ScrollReveal direction="up" duration={0.6}>
          <div className="mb-10">
            <p className="text-xs text-red-500 font-bold tracking-[0.3em] uppercase mb-1">Reviews</p>
            <h2 className="text-2xl font-extrabold">
              All Reviews{" "}
              {!listLoading && (
                <span className="text-white/30 font-normal text-base">
                  ({reviews.length} shown)
                </span>
              )}
            </h2>
          </div>
        </ScrollReveal>

        {listLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            No reviews yet — be the first!
          </div>
        ) : (
          <StaggerReveal
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            stagger={0.07}
            y={40}
            duration={0.65}
            threshold="top 90%"
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </StaggerReveal>
        )}
      </section>

      {/* ── WRITE REVIEW ── */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <ScrollReveal direction="up" duration={0.7}>
          <div className="text-center mb-8">
            <p className="text-xs text-red-500 font-bold tracking-[0.3em] uppercase mb-2">Share Your Experience</p>
            <h2 className="text-2xl font-extrabold mb-2">Bought From Us?</h2>
            <p className="text-white/40 text-sm">Help other gamers make the right choice.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="scale" delay={0.1} duration={0.7}>
          <WriteReviewForm />
        </ScrollReveal>
      </section>
    </div>
  );
}
