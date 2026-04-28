"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  speed?: number; // seconds for one full loop
  className?: string;
}

export default function GsapMarquee({ children, speed = 20, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duplicate children are already in DOM via doubled array
    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    // Speed up on scroll
    const st = ScrollTrigger.create({
      trigger: track.parentElement,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        tween.timeScale(1 + Math.abs(self.getVelocity()) / 2000);
        gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: "auto" });
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, [speed]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex gap-10 whitespace-nowrap w-max will-change-transform">
        {children}
      </div>
    </div>
  );
}
