"use client";

import { useState } from "react";
import { CONTACT_FAQ } from "@/utils/contact";

export default function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-8">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-3">
        {CONTACT_FAQ.map((item, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-sm text-white/90">{item.q}</span>
              <span className="text-red-400 text-lg ml-4 shrink-0">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/10 pt-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
