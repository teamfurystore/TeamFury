"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { SITE_CONFIG } from "@/utils/config";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show button after 2s, auto-show tooltip after 4s once
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 2000);
    const t2 = setTimeout(() => {
      if (!dismissed) setTooltipOpen(true);
    }, 4000);
    const t3 = setTimeout(() => setTooltipOpen(false), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [dismissed]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* Tooltip bubble */}
      {tooltipOpen && (
        <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 max-w-55 shadow-xl animate-scale-in">
          <button
            onClick={() => { setTooltipOpen(false); setDismissed(true); }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={10} />
          </button>
          <p className="text-xs text-white/80 leading-relaxed">
            💬 <span className="font-bold text-white">Need help choosing?</span><br />
            Chat with us on WhatsApp — instant replies!
          </p>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#1a1a1a] border-r border-b border-white/10 rotate-45" />
        </div>
      )}

      {/* Main button */}
      <a
        href={SITE_CONFIG.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setTooltipOpen(false)}
        className="group relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-400/50 transition-all hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="text-white" />
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
      </a>
    </div>
  );
}
