import { ABOUT_WHY, ABOUT_FOOTER_NOTE } from "@/utils/about";

export default function AboutWhySection() {
  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-10 flex items-center gap-2">
        <span className="text-green-400">✅</span> Why Choose TEAM FURY?
      </h2>
      <div className="flex flex-col gap-8">
        {ABOUT_WHY.map((item) => (
          <div
            key={item.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-colors"
          >
            <h3 className="font-bold text-base mb-2">
              {item.emoji} {item.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-white/50 text-sm leading-relaxed border-t border-white/10 pt-8">
        {ABOUT_FOOTER_NOTE}
      </p>
    </section>
  );
}
