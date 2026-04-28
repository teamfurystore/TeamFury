import type { Metadata } from "next";
import ReviewPageClient from "@/components/review/ReviewPageClient";

export const metadata: Metadata = {
  title: "Reviews | TEAM FURY",
  description:
    "See what 1000+ happy buyers say about TEAM FURY — India's most trusted Valorant account marketplace.",
};

export default function ReviewPage() {
  return <ReviewPageClient />;
}
