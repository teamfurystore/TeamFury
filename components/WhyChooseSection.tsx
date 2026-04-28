"use client";

import { WHY_CHOOSE } from "@/utils/config";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function WhyChooseSection() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto text-center">
      <div className="mb-14">
        <SplitText
          text="Why Choose TEAM FURY?"
          tag="h2"
          className="text-3xl md:text-4xl font-extrabold mb-3"
          accentWords={["FURY?"]}
          stagger={0.05}
          duration={0.65}
        />
        <ScrollReveal direction="up" delay={0.2} duration={0.6}>
          <p className="text-white/40 text-sm">Trusted by thousands of Valorant players</p>
        </ScrollReveal>
      </div>

      <StaggerReveal
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
        stagger={0.1}
        y={40}
        duration={0.7}
      >
        {WHY_CHOOSE.map((item) => (
          <div
            key={item.title}
            className="group relative bg-white/4 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-300 cursor-default overflow-hidden"
          >
            {/* top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-500" />
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">
              {item.icon}
            </span>
            <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors duration-300">
              {item.title}
            </h4>
            <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </StaggerReveal>
    </section>
  );
}
