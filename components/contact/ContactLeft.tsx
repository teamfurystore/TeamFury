import { CONTACT_CHANNELS } from "@/utils/contact";

export default function ContactLeft() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold mb-2">Get in Touch</h2>
        <p className="text-white/50 text-sm leading-relaxed">
          Reach us directly through any of the channels below. We typically
          respond within minutes on WhatsApp.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {CONTACT_CHANNELS.map((ch) => (
          <a
            key={ch.title}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all hover:-translate-y-0.5 ${
              ch.highlight
                ? "bg-green-600/10 border-green-500/40 hover:border-green-400"
                : "bg-white/5 border-white/10 hover:border-red-500/40"
            }`}
          >
            <span className="text-2xl shrink-0">{ch.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{ch.title}</p>
              <p className="text-white/40 text-xs truncate">{ch.desc}</p>
            </div>
            <span
              className={`text-xs font-bold shrink-0 ${
                ch.highlight ? "text-green-400" : "text-red-400"
              }`}
            >
              →
            </span>
          </a>
        ))}
      </div>

      {/* Response time badge */}
      {/* <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <p className="text-white/60 text-xs">
          Average response time:{" "}
          <span className="text-white font-semibold">under 5 minutes</span>
        </p>
      </div> */}
    </div>
  );
}
