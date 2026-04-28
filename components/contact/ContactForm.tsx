"use client";

import { useState } from "react";
import { CONTACT_FORM_SUBJECTS } from "@/utils/contact";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-green-500/30 bg-green-600/10 p-12 text-center">
        <span className="text-5xl">✅</span>
        <h3 className="text-xl font-extrabold">Message Sent!</h3>
        <p className="text-white/50 text-sm">
          We&apos;ll get back to you shortly. For faster help, ping us on
          WhatsApp.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setError(null);
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
          }}
          className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <h2 className="text-xl font-extrabold mb-1">Send us a Message</h2>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50 font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/60 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Phone + Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50 font-medium">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/60 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50 font-medium">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/60 transition-colors"
          >
            <option value="" disabled>
              Select a subject
            </option>
            {CONTACT_FORM_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50 font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={handleChange}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/60 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors text-sm"
      >
        {loading ? "Sending…" : "Send Message"}
      </button>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-center">
          {error}
        </p>
      )}
    </form>
  );
}
