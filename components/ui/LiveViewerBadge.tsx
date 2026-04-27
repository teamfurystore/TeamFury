"use client";

import { useEffect, useState } from "react";

interface Props {
  /** base count to fluctuate around */
  base?: number;
}

export default function LiveViewerBadge({ base = 14 }: Props) {
  const [count, setCount] = useState(base);
  const [visible, setVisible] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    // Show after short delay
    const show = setTimeout(() => setVisible(true), 1200);

    // Fluctuate every 4–8s
    const tick = () => {
      const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setCount((c) => Math.max(8, Math.min(base + 10, c + delta)));
      setBump(true);
      setTimeout(() => setBump(false), 400);
    };

    const interval = setInterval(tick, 4000 + Math.random() * 4000);
    return () => { clearTimeout(show); clearInterval(interval); };
  }, [base]);

  return (
    <div
      className={`fixed top-20 right-4 z-40 transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      }`}
    >
      <div className="flex items-center gap-2 bg-[#1a1a1a]/90 backdrop-blur border border-white/10 rounded-full px-3 py-1.5 shadow-lg">
        {/* Pulsing red dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span
          className={`text-xs font-bold text-white transition-all duration-300 ${
            bump ? "scale-125 text-red-400" : "scale-100"
          }`}
        >
          {count}
        </span>
        <span className="text-xs text-white/50">viewing now</span>
      </div>
    </div>
  );
}
