"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "scale";

interface Props {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: string; // e.g. "top 85%"
}

const FROM: Record<Direction, gsap.TweenVars> = {
  up:    { y: 60,  opacity: 0, filter: "blur(6px)" },
  down:  { y: -60, opacity: 0, filter: "blur(6px)" },
  left:  { x: -70, opacity: 0, filter: "blur(6px)" },
  right: { x: 70,  opacity: 0, filter: "blur(6px)" },
  scale: { scale: 0.82, opacity: 0, filter: "blur(6px)" },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className,
  threshold = "top 88%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, FROM[direction]);

    const to: gsap.TweenVars = {
      y: 0, x: 0, scale: 1, opacity: 1, filter: "blur(0px)",
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: threshold,
        toggleActions: "play reverse play reverse",
      },
    };

    const tween = gsap.to(el, to);

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === el)
        .forEach((st) => st.kill());
    };
  }, [direction, delay, duration, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
