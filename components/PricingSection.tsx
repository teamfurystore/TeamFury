"use client";

import { PRICING_TIERS } from "@/utils/config";
import PricingCard from "./PricingCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function PricingSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 px-6 max-w-6xl mx-auto">
      {/* Section heading */}
      <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">PRICING</p>
        <h2 className="text-3xl font-extrabold">Choose Your <span className="text-red-500">Collection</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_TIERS.map((tier, idx) => (
          <div
            key={tier.tier}
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            style={{ transitionDelay: `${200 + idx * 150}ms` }}
          >
            <PricingCard {...tier} />
          </div>
        ))}
      </div>
    </section>
  );
}
