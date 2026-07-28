import type { Metadata } from "next";
import ReviewPageClient from "@/components/review/ReviewPageClient";

export const metadata: Metadata = {
  title: "Reviews — What Our Buyers Say",
  description:
    "See what 15,000+ happy buyers say about TEAM FURY — India's most trusted Valorant account marketplace. Verified reviews, 5-star rated service.",
  alternates: {
    canonical: "https://www.teamfury.store/review",
  },
  openGraph: {
    title: "15,000+ Reviews | TEAM FURY",
    description:
      "See what 15,000+ happy buyers say about TEAM FURY — India's most trusted Valorant account marketplace.",
    url: "https://www.teamfury.store/review",
    images: [
      {
        url: "/tf_logo_hd.jpg",
        width: 1200,
        height: 630,
        alt: "TEAM FURY Customer Reviews",
      },
    ],
  },
};

export default function ReviewPage() {
  return <ReviewPageClient />;
}
