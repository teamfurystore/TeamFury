import type { Metadata } from "next";
import { REVIEWS } from "@/utils/reviews";
import ReviewStats from "@/components/review/ReviewStats";
import ReviewCard from "@/components/review/ReviewCard";
import WriteReviewForm from "@/components/review/WriteReviewForm";

export const metadata: Metadata = {
  title: "Reviews | TEAM FURY",
  description:
    "See what 1000+ happy buyers say about TEAM FURY — India's most trusted Valorant account marketplace.",
};

export default function ReviewPage() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="text-center py-16 px-6 max-w-3xl mx-auto animate-slide-up">
        <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">
          TRUSTED BY 1000+ GAMERS
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          What Our <span className="text-red-500">Customers</span> Say
        </h1>
        <p className="text-white/50 text-base">
          Real reviews from real buyers. Every review is from a verified purchase.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <ReviewStats />
      </section>

      {/* Reviews grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-extrabold">
            All Reviews
            <span className="ml-2 text-sm font-normal text-white/40">({REVIEWS.length} shown)</span>
          </h2>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {REVIEWS.map((review, i) => (
            <div key={review.id} className="break-inside-avoid">
              <ReviewCard
                review={review}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Write a review */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold mb-2">Bought From Us?</h2>
          <p className="text-white/40 text-sm">Share your experience and help other gamers make the right choice.</p>
        </div>
        <WriteReviewForm />
      </section>
    </div>
  );
}
