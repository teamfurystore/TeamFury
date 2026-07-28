import type { Metadata } from "next";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import CTASection from "@/components/CTASection";
import HeroHomePage from "@/components/home-page/HeroHomePage";
import StatsBar from "@/components/home-page/StatsBar";

export const metadata: Metadata = {
  title: "TEAM FURY | Premium Valorant Accounts",
  description:
    "Buy premium Valorant accounts with exclusive skins, rare knives, and top-ranked profiles. Instant delivery, verified accounts, best prices — trusted by 15,000+ buyers in India.",
  alternates: {
    canonical: "https://www.teamfury.store",
  },
  openGraph: {
    title: "TEAM FURY | Premium Valorant Accounts",
    description:
      "Buy premium Valorant accounts with exclusive skins, rare knives, and top-ranked profiles. Instant delivery, trusted by 15,000+ buyers.",
    url: "https://www.teamfury.store/",
    images: [
      {
        url: "/tf_logo_hd.jpg",
        width: 1200,
        height: 630,
        alt: "TEAM FURY — Premium Valorant Accounts",
      },
    ],
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TEAM FURY",
  url: "https://www.teamfury.store",
  logo: "https://www.teamfury.store/TeamFuryLogo.png",
  description:
    "India's most trusted Valorant account marketplace. Premium accounts with exclusive skins, rare knives, and instant delivery.",
  sameAs: [
    "http://instagram.com/teamfury.store",
    "http://discord.com/invite/Bbsd68NmqT",
    "http://chat.whatsapp.com/H7LvFLMR88IAs2T1Quy6wZ",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TEAM FURY",
  url: "https://www.teamfury.store",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.teamfury.store/shop?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className="font-sans">
        <HeroHomePage />
        <StatsBar />
        <PricingSection />
        <WhyChooseSection />
        <CTASection />
      </div>
    </>
  );
}
