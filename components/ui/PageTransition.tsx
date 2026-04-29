"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTransition, type Phase } from "@/contexts/TransitionContext";

// ── Helpers ───────────────────────────────────────────────────────────────────

function panelStyle(phase: Phase, dir: "top" | "bottom"): React.CSSProperties {
  const inAnim  = dir === "top" ? "slide-in-top"    : "slide-in-bottom";
  const outAnim = dir === "top" ? "slide-out-top"   : "slide-out-bottom";
  return {
    animation:
      phase === "enter" || phase === "hold"
        ? `${inAnim} 0.42s cubic-bezier(0.16,1,0.3,1) forwards`
        : `${outAnim} 0.38s cubic-bezier(0.7,0,0.84,0) forwards`,
  };
}

// ── Corner SVG bracket ────────────────────────────────────────────────────────
function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  return (
    <svg
      width="28" height="28" viewBox="0 0 28 28" fill="none"
      className="absolute"
      style={{
        top:    pos.startsWith("t") ? 14 : undefined,
        bottom: pos.startsWith("b") ? 14 : undefined,
        left:   pos.endsWith("l")   ? 14 : undefined,
        right:  pos.endsWith("r")   ? 14 : undefined,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <path
        d="M2 26 L2 2 L26 2"
        stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="60" strokeDashoffset="60"
        className="animate-corner-draw"
      />
    </svg>
  );
}

// ── Main overlay ──────────────────────────────────────────────────────────────
export default function PageTransition() {
  const { phase, label, barKey } = useTransition();

  if (phase === "idle") return null;

  const showHUD = phase === "hold" || phase === "exit";

  return (
    // pointer-events: all — blocks all interaction while overlay is active
    <div className="fixed inset-0 z-9999 overflow-hidden" style={{ pointerEvents: "all" }}>

      {/* ── Top panel ── */}
      <div
        className="absolute left-0 right-0 top-0 h-1/2 bg-[#0a0a0a]"
        style={panelStyle(phase, "top")}
      >
        <div className="absolute bottom-0 left-0 right-0 h-px bg-red-500/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* ── Bottom panel ── */}
      <div
        className="absolute left-0 right-0 bottom-0 h-1/2 bg-[#0a0a0a]"
        style={panelStyle(phase, "bottom")}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-red-500/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* ── Center HUD — fades IN on hold, fades OUT on exit ── */}
      <AnimatePresence>
        {showHUD && (
          <motion.div
            key="hud"
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1,    filter: "blur(0px)" }}
            exit={{    opacity: 0, scale: 0.88,  filter: "blur(8px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Reticle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />

              {/* Ping ring */}
              <div className="absolute w-16 h-16 rounded-full border border-red-500/30 animate-reticle-ping" />
              {/* Spin ring */}
              <div className="absolute w-14 h-14 rounded-full border border-dashed border-red-500/50 animate-reticle-spin" />
              {/* Inner ring */}
              <div className="absolute w-8 h-8 rounded-full border-2 border-red-500/80" />
              {/* Center dot */}
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60" />
              {/* Crosshairs */}
              <div className="absolute w-px h-5 bg-red-500/60 top-1" />
              <div className="absolute w-px h-5 bg-red-500/60 bottom-1" />
              <div className="absolute h-px w-5 bg-red-500/60 left-1" />
              <div className="absolute h-px w-5 bg-red-500/60 right-1" />
            </div>

            {/* Label block — staggered children */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -8 }}
              transition={{ duration: 0.28, delay: 0.06, ease: "easeOut" }}
            >
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-red-500/60">
                TEAM FURY
              </p>
              <p className="text-lg font-extrabold tracking-[0.3em] uppercase text-white animate-text-flicker">
                {label}
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-px bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <div
                key={barKey}
                className="h-full bg-linear-to-r from-red-600 to-red-400 rounded-full animate-bar-fill"
              />
            </motion.div>

            {/* Status */}
            <motion.p
              className="text-[9px] font-mono text-white/20 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              NAVIGATING · SECURE CONNECTION
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
