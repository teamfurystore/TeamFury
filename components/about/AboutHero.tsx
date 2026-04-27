import { ABOUT_HERO, ABOUT_STATS } from "@/utils/about";

export default function AboutHero() {
  return (
    <section className="text-center py-20 px-6 max-w-3xl mx-auto">
      <div className="text-6xl mb-4">{ABOUT_HERO.emoji}</div>
      <p className="text-red-500 font-extrabold text-xl tracking-widest uppercase mb-2">
        {ABOUT_HERO.name}
      </p>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10">
        {ABOUT_HERO.heading}
      </h1>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {ABOUT_STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 flex flex-col items-center gap-1"
          >
            <span className="text-2xl font-extrabold text-red-400">
              {s.value}
            </span>
            <span className="text-white/50 text-xs">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5 text-white/70 text-base leading-relaxed text-left">
        {ABOUT_HERO.description.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  );
}
