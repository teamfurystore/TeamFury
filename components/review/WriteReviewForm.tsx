"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const ACCOUNTS = [
  "Diamond Smurf — 25 Skins",
  "Platinum Starter — 12 Skins",
  "Immortal Beast — 40 Skins",
  "Gold Grinder — 8 Skins",
  "Ascendant Elite — 30 Skins",
  "Silver Fresh — 5 Skins",
  "Radiant Legend — 55 Skins",
  "Bronze Budget — 3 Skins",
];

export default function WriteReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    account_bought: "",
    rank: "",
    platform: "Direct",
    review: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-green-600/10 border border-green-500/30 rounded-2xl p-10 text-center">
        <span className="text-5xl">🎉</span>
        <h3 className="text-xl font-extrabold">Thank You!</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          Your review has been submitted and will appear after our team approves it.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setError(null);
            setForm({ name: "", account_bought: "", rank: "", platform: "Direct", review: "" });
          }}
          className="text-sm text-red-400 hover:text-red-300 transition-colors mt-1"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
    >
      <h3 className="text-lg font-extrabold">Share Your Experience</h3>

      {/* Star picker */}
      <div>
        <p className="text-xs text-white/40 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={24}
                className={
                  s <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-white/20"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Arjun S."
            className={inp}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">
            Account Bought <span className="text-red-500">*</span>
          </label>
          <select
            name="account_bought"
            required
            value={form.account_bought}
            onChange={handleChange}
            className={sel}
          >
            <option value="" disabled>Select account</option>
            {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Your Rank</label>
          <input
            name="rank"
            value={form.rank}
            onChange={handleChange}
            placeholder="e.g. Diamond"
            className={inp}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Platform</label>
          <select name="platform" value={form.platform} onChange={handleChange} className={sel}>
            {["WhatsApp", "Discord", "Instagram", "Direct"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/40">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          name="review"
          required
          rows={4}
          value={form.review}
          onChange={handleChange}
          placeholder="Tell others about your experience with TEAM FURY..."
          className={`${inp} resize-none`}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-bold py-3 rounded-full transition-all text-sm"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

const inp =
  "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors w-full";
const sel =
  "bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors w-full";
