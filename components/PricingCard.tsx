import { SITE_CONFIG } from "@/utils/config";

interface PricingCardProps {
  emoji: string;
  tier: string;
  subtitle: string;
  price: string;
  features: string[];
  badge: string | null;
  highlight: boolean;
}

export default function PricingCard({
  emoji,
  tier,
  subtitle,
  price,
  features,
  badge,
  highlight,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 border flex flex-col gap-4 transition-transform hover:-translate-y-1 ${
        highlight
          ? "bg-red-600/10 border-red-500 shadow-lg shadow-red-500/20"
          : "bg-white/5 border-white/10"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-widest">
          {badge}
        </span>
      )}
      <div className="text-3xl">{emoji}</div>
      <div>
        <h3 className="text-lg font-bold">{tier}</h3>
        <p className="text-white/40 text-xs tracking-widest uppercase mt-0.5">
          {subtitle}
        </p>
      </div>
      <p className="text-2xl font-extrabold text-red-400">{price}</p>
      <ul className="flex flex-col gap-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/70">
            <span className="text-red-500">✓</span> {f}
          </li>
        ))}
      </ul>
      <a
        href={SITE_CONFIG.shopUrl}
        className={`mt-2 text-center py-2.5 rounded-full font-semibold text-sm transition-colors ${
          highlight
            ? "bg-red-600 hover:bg-red-500 text-white"
            : "border border-white/20 hover:border-white/40 text-white/80 hover:text-white"
        }`}
      >
        View Accounts
      </a>
    </div>
  );
}
