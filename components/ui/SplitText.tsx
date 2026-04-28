"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  text: string;
  className?: string;
  wordClassName?: string;
  accentWords?: string[];       // words to color red
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function SplitText({
  text,
  className,
  wordClassName = "",
  accentWords = [],
  delay = 0,
  duration = 0.7,
  stagger = 0.06,
  threshold = "top 88%",
  tag: Tag = "h2",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".split-word"));
    gsap.set(spans, { y: "110%", opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: threshold,
        toggleActions: "play reverse play reverse",
      },
    });

    tl.to(spans, {
      y: "0%",
      opacity: 1,
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
  }, [text, delay, duration, stagger, threshold]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.25em] last:mr-0"
        >
          <span
            className={`split-word inline-block ${wordClassName} ${
              accentWords.includes(word) ? "text-red-500" : ""
            }`}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
