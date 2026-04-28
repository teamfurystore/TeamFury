"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  threshold?: string;
}

export default function StaggerReveal({
  children,
  className,
  stagger = 0.12,
  y = 50,
  x = 0,
  scale = 1,
  duration = 0.75,
  delay = 0,
  threshold = "top 85%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y, x, scale, filter: "blur(5px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: threshold,
        toggleActions: "play reverse play reverse",
      },
    });

    tl.to(items, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      duration,
      delay,
      stagger,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === el)
        .forEach((st) => st.kill());
    };
  }, [stagger, y, x, scale, duration, delay, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
