import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutWhySection from "@/components/about/AboutWhySection";

export const metadata: Metadata = {
  title: "About Us — India's Trusted Valorant Marketplace",
  description:
    "Learn about TEAM FURY — India's trusted Valorant account marketplace built by gamers, for gamers. 15,000+ accounts sold, instant delivery, 5-star rated.",
  alternates: {
    canonical: "https://www.teamfury.store/about",
  },
  openGraph: {
    title: "About TEAM FURY — India's Trusted Valorant Marketplace",
    description:
      "India's trusted Valorant account marketplace built by gamers, for gamers. 15,000+ accounts sold, instant delivery, 5-star rated.",
    url: "https://www.teamfury.store/about",
    images: [
      {
        url: "/tf_logo_hd.jpg",
        width: 1200,
        height: 630,
        alt: "TEAM FURY — About Us",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <AboutHero />
      <AboutWhySection />
    </div>
  );
}
