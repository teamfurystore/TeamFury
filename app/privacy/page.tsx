import type { Metadata } from "next";
import PrivacyPageClient from "@/components/privacy/PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy | TEAM FURY",
  description:
    "See what 1000+ happy buyers say about TEAM FURY — India's most trusted Valorant account marketplace.",
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
