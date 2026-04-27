"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  // Use refs for position to avoid re-renders on every mouse move
  const pos = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth lerp loop — runs at 60fps, zero state updates
    const loop = () => {
      const dx = pos.current.x - current.current.x;
      const dy = pos.current.y - current.current.y;
      current.current.x += dx * 0.12;
      current.current.y += dy * 0.12;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    // pointer-events-none so it never blocks clicks
    <div className="fixed inset-0 z-9999 pointer-events-none overflow-hidden hidden md:block">
      <div
        ref={glowRef}
        // -translate by half size to center on cursor
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0.06) 50%, transparent 70%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
