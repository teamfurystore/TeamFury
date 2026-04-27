"use client";

import { WHY_CHOOSE } from "@/utils/config";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function WhyChooseSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 px-6 max-w-5xl mx-auto text-center">
      <h2
        className={`text-3xl font-extrabold mb-2 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        Why Choose <span className="text-red-500">TEAM FURY?</span>
      </h2>
      <p
        className={`text-white/40 mb-12 text-sm transition-all duration-700 delay-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        Trusted by thousands of Valorant players
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {WHY_CHOOSE.map((item, idx) => (
          <div
            key={item.title}
            className={`bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-red-500/40 transition-all duration-700 hover:scale-105 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: `${300 + idx * 120}ms` }}
          >
            <span
              className={`text-4xl transition-all duration-500 ${
                visible ? 'scale-100 rotate-0' : 'scale-50 rotate-12'
              }`}
              style={{ transitionDelay: `${400 + idx * 120}ms` }}
            >
              {item.icon}
            </span>
            <h4 className="font-bold text-sm">{item.title}</h4>
            <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
