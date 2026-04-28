import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutWhySection from "@/components/about/AboutWhySection";

export const metadata: Metadata = {
  title: "About Us | TEAM FURY",
  description:
    "Learn about TEAM FURY — India's trusted Valorant account marketplace built by gamers, for gamers.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <AboutHero />
      <AboutWhySection />
    </div>
  );
}
