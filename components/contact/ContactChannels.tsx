import { CONTACT_CHANNELS } from "@/utils/contact";

export default function ContactChannels() {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CONTACT_CHANNELS.map((ch) => (
          <a
            key={ch.title}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col gap-3 rounded-2xl p-6 border transition-all hover:-translate-y-1 ${
              ch.highlight
                ? "bg-green-600/10 border-green-500/50 hover:border-green-400"
                : "bg-white/5 border-white/10 hover:border-red-500/40"
            }`}
          >
            <span className="text-3xl">{ch.emoji}</span>
            <div>
              <h3 className="font-bold text-base">{ch.title}</h3>
              <p className="text-white/50 text-sm mt-1">{ch.desc}</p>
            </div>
            <span
              className={`mt-auto text-sm font-semibold ${
                ch.highlight ? "text-green-400" : "text-red-400"
              }`}
            >
              {ch.label} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
