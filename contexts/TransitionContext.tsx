"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE CONFIG
// Add/remove routes to enable the gaming transition for them.
// Exact match OR prefix (e.g. "/shop" covers "/shop/slug-name").
// ─────────────────────────────────────────────────────────────────────────────
export const TRANSITION_ROUTES: string[] = [
  "/",
  "/shop",
  "/about",
  "/review",
  "/contact",
  "/cart",
  // "/admin",  ← uncomment to enable on admin routes
];

export function shouldTransition(from: string, to: string): boolean {
  if (from === to) return false;
  return TRANSITION_ROUTES.some(
    (r) => to === r || (r !== "/" && to.startsWith(r + "/"))
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE LABELS
// ─────────────────────────────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  "/":        "HOME BASE",
  "/shop":    "ARMORY",
  "/about":   "INTEL",
  "/review":  "DEBRIEF",
  "/contact": "COMMS",
  "/cart":    "LOADOUT",
  "/admin":   "COMMAND",
};

export function getRouteLabel(path: string): string {
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  if (path.startsWith("/shop/"))  return "ACCOUNT DETAIL";
  if (path.startsWith("/admin/")) return "COMMAND CENTER";
  return "NAVIGATING";
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMINGS (ms)
// ─────────────────────────────────────────────────────────────────────────────
const T_PANELS_IN  = 420;   // panels fully closed, show HUD
const T_NAVIGATE   = 500;   // fire router.push while panels are closed
const T_HOLD       = 900;   // start opening panels
const T_PANELS_OUT = 1300;  // panels fully open → idle

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type Phase = "idle" | "enter" | "hold" | "exit";

interface TransitionContextValue {
  phase: Phase;
  label: string;
  barKey: number;
  isTransitioning: boolean;
  isReady: boolean;
  navigate: (href: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const TransitionContext = createContext<TransitionContextValue>({
  phase: "idle",
  label: "",
  barKey: 0,
  isTransitioning: false,
  isReady: true,
  navigate: () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [phase, setPhase]   = useState<Phase>("idle");
  const [label, setLabel]   = useState("");
  const [barKey, setBarKey] = useState(0);

  // Keep a ref to the latest pathname so navigate() can read it synchronously
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  const navigate = useCallback(
    (href: string) => {
      const from = pathnameRef.current;

      if (!shouldTransition(from, href)) {
        router.push(href);
        return;
      }

      clearTimers();
      setLabel(getRouteLabel(href));
      setBarKey((k) => k + 1);
      setPhase("enter");

      // Lock scroll
      document.body.style.overflow = "hidden";

      timers.current.push(
        // Panels closed → show HUD
        setTimeout(() => setPhase("hold"), T_PANELS_IN),

        // Navigate while panels are covering the screen
        setTimeout(() => router.push(href), T_NAVIGATE),

        // Start opening panels
        setTimeout(() => setPhase("exit"), T_HOLD),

        // Fully open → idle, unlock scroll
        setTimeout(() => {
          setPhase("idle");
          document.body.style.overflow = "";
        }, T_PANELS_OUT),
      );
    },
    [router],
  );

  return (
    <TransitionContext.Provider
      value={{
        phase,
        label,
        barKey,
        isTransitioning: phase !== "idle",
        isReady: phase === "idle",
        navigate,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export function useTransition() {
  return useContext(TransitionContext);
}

/**
 * Returns `true` once the overlay is fully gone.
 * Gate your GSAP / Motion page animations on this value.
 *
 * ```tsx
 * const ready = useTransitionReady();
 * ```
 */
export function useTransitionReady(): boolean {
  return useContext(TransitionContext).isReady;
}
