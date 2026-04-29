"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { SITE_CONFIG, NAV_LINKS } from "@/utils/config";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef       = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance
      gsap.from(numRef.current, {
        y: 80, opacity: 0, filter: "blur(20px)",
        duration: 1, ease: "power3.out", delay: 0.1,
      });
      gsap.from(contentRef.current?.children ?? [], {
        y: 40, opacity: 0, filter: "blur(6px)",
        duration: 0.7, ease: "power3.out",
        stagger: 0.1, delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center overflow-hidden px-6"
    >
      {/* ── Background layers ── */}

      {/* Red grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-150 h-150 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      {/* Moving scanline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-scanline absolute left-0 right-0 h-32 bg-linear-to-b from-transparent via-red-500/4 to-transparent" />
      </div>

      {/* CRT flicker overlay */}
      <div className="animate-flicker absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] pointer-events-none" />

      {/* Corner decorations */}
      <span className="absolute top-8 left-8 text-xs font-mono text-red-500/30 tracking-widest select-none">
        ERR_404
      </span>
      <span className="absolute top-8 right-8 text-xs font-mono text-white/15 tracking-widest select-none">
        TEAM FURY
      </span>
      <span className="absolute bottom-8 left-8 text-xs font-mono text-white/10 tracking-widest select-none">
        PAGE_NOT_FOUND
      </span>
      <span className="absolute bottom-8 right-8 text-xs font-mono text-white/10 tracking-widest select-none">
        {new Date().getFullYear()}
      </span>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full gap-8">

        {/* Glitching 404 */}
        <div ref={numRef} className="relative select-none animate-float-404">
          {/* Base number */}
          <h1 className="text-[10rem] md:text-[14rem] font-extrabold leading-none tracking-tighter text-white/5">
            404
          </h1>

          {/* Red glitch layer 1 */}
          <h1
            aria-hidden
            className="animate-glitch-1 absolute inset-0 text-[10rem] md:text-[14rem] font-extrabold leading-none tracking-tighter text-red-500"
          >
            404
          </h1>

          {/* Cyan glitch layer 2 */}
          <h1
            aria-hidden
            className="animate-glitch-2 absolute inset-0 text-[10rem] md:text-[14rem] font-extrabold leading-none tracking-tighter text-cyan-400/70"
          >
            404
          </h1>

          {/* Solid white on top */}
          <h1
            className="absolute inset-0 text-[10rem] md:text-[14rem] font-extrabold leading-none tracking-tighter text-white"
          >
            404
          </h1>
        </div>

        {/* Text content */}
        <div ref={contentRef} className="flex flex-col items-center gap-5">

          {/* Label */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-red-500/50" />
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-red-500">
              Page Not Found
            </span>
            <div className="h-px w-8 bg-red-500/50" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
            You&apos;ve wandered into{" "}
            <span className="text-red-500">uncharted territory</span>
          </h2>

          {/* Sub */}
          <p className="text-white/45 text-sm md:text-base leading-relaxed max-w-md">
            This page doesn&apos;t exist or has been moved. Head back to the
            shop and find your dream Valorant account.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link
              href="/"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3 rounded-full text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 active:scale-95"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/8 text-white/80 hover:text-white font-semibold px-7 py-3 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
            >
              Browse Shop
            </Link>
          </div>

          {/* Quick nav */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
