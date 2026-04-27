"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ScrollImageSequenceProps {
  /** Array of image src paths e.g. ["/frames/mouse-001.jpg", ...] */
  frames: string[];
  /** Height of the sticky scroll zone in vh units, default 300 */
  scrollHeightVh?: number;
  /** Alt text for the image */
  alt?: string;
  /** Optional heading shown beside the image */
  heading?: string;
  /** Optional subtext shown beside the image */
  subtext?: string;
}

export default function ScrollImageSequence({
  frames,
  scrollHeightVh = 300,
  alt = "Product",
  heading,
  subtext,
}: ScrollImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!frames.length) return;

    function onScroll() {
      const el = containerRef.current;
      if (!el) return;

      const { top, height } = el.getBoundingClientRect();
      // progress 0 → 1 as the section scrolls through viewport
      const scrollable = height - window.innerHeight;
      const progress = Math.min(Math.max(-top / scrollable, 0), 1);
      const index = Math.min(
        Math.floor(progress * frames.length),
        frames.length - 1
      );
      setFrameIndex(index);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, [frames]);

  if (!frames.length) return null;

  return (
    <div
      ref={containerRef}
      style={{ height: `${scrollHeightVh}vh` }}
      className="relative w-full"
    >
      {/* Sticky viewport-height panel */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
        {/* Image */}
        <div className="relative w-full max-w-2xl aspect-square">
          <Image
            src={frames[frameIndex]}
            alt={`${alt} — frame ${frameIndex + 1}`}
            fill
            className="object-contain select-none"
            priority={frameIndex === 0}
            draggable={false}
          />
        </div>

        {/* Optional overlay text */}
        {(heading || subtext) && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center px-6 pointer-events-none">
            {heading && (
              <p className="text-white font-extrabold text-2xl md:text-3xl tracking-wide">
                {heading}
              </p>
            )}
            {subtext && (
              <p className="text-white/50 text-sm mt-2">{subtext}</p>
            )}
          </div>
        )}

        {/* Progress dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {frames.map((_, i) => (
            <span
              key={i}
              className={`block w-1 h-1 rounded-full transition-all duration-150 ${
                i === frameIndex ? "bg-white scale-150" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
