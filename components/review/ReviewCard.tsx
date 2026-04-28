import { Star, BadgeCheck } from "lucide-react";

type Platform = "WhatsApp" | "Discord" | "Instagram" | "Direct";

export interface ReviewCardData {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  rank: string;
  account_bought: string;
  date: string;
  review: string;
  verified: boolean;
  platform: Platform;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  WhatsApp:  "text-green-400 bg-green-400/10 border-green-400/20",
  Discord:   "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  Instagram: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  Direct:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

interface Props {
  review: ReviewCardData;
  style?: React.CSSProperties;
}

export default function ReviewCard({ review, style }: Props) {
  return (
    <div
      style={style}
      className="h-full bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-sm font-bold text-red-400 shrink-0">
            {review.avatar || review.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm">{review.name}</p>
              {review.verified && <BadgeCheck size={14} className="text-blue-400" />}
            </div>
            <p className="text-white/40 text-xs">{review.date}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${PLATFORM_COLORS[review.platform] ?? "text-white/40 bg-white/5 border-white/10"}`}>
          {review.platform}
        </span>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star
            key={s}
            size={13}
            className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{review.review}&rdquo;</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Account Bought</p>
          <p className="text-xs text-white/60 font-medium mt-0.5">{review.account_bought}</p>
        </div>
        {review.rank && (
          <span className="text-xs text-white/40 bg-white/5 px-2.5 py-1 rounded-full shrink-0">
            {review.rank}
          </span>
        )}
      </div>
    </div>
  );
}
