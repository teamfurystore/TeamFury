import type { Metadata } from "next";
import TermsPageClient from "@/components/terms/TermsPageClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read TEAM FURY's Terms of Service — the rules and conditions for buying Valorant accounts on our platform.",
  alternates: {
    canonical: "https://www.teamfury.store/terms",
  },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
