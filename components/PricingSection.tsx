"use client";

import { PRICING_TIERS } from "@/utils/config";
import PricingCard from "./PricingCard";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function PricingSection() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <ScrollReveal direction="up" delay={0} duration={0.6}>
          <p className="text-red-500 text-xs font-bold tracking-[0.4em] uppercase mb-3">Pricing</p>
        </ScrollReveal>
        <SplitText
          text="Choose Your Collection"
          tag="h2"
          className="text-3xl md:text-4xl font-extrabold"
          accentWords={["Collection"]}
          stagger={0.05}
          duration={0.65}
        />
      </div>

      <StaggerReveal
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        stagger={0.15}
        y={60}
        duration={0.8}
      >
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.tier} {...tier} />
        ))}
      </StaggerReveal>
    </section>
  );
}
