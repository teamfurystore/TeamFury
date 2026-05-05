import type { Metadata } from "next";
import TermsPageClient from "@/components/terms/TermsPageClient";

export const metadata: Metadata = {
  title: "Terms of Service | TEAM FURY",
  description:
    "Read the Terms of Service and policies for TeamFury Store — India's trusted Valorant account marketplace.",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
