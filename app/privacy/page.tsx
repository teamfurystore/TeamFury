import type { Metadata } from "next";
import PrivacyPageClient from "@/components/privacy/PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read TEAM FURY's Privacy Policy — how we collect, use, and protect your data when you purchase Valorant accounts.",
  alternates: {
    canonical: "https://www.teamfury.store/privacy",
  },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
