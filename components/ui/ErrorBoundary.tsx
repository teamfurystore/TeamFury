"use client";

import { Component, ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
  /**
   * Optional custom fallback. Receives the error and a reset function.
   * If omitted the default full-page fallback is shown.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Use "inline" for section-level boundaries (smaller UI) */
  variant?: "page" | "inline";
}

interface State {
  error: Error | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in dev; swap for a real logger (Sentry etc.) in prod
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback, variant = "page" } = this.props;

    if (!error) return children;

    // Custom fallback provided by caller
    if (fallback) return fallback(error, this.reset);

    // Default fallbacks
    return variant === "inline" ? (
      <InlineFallback error={error} reset={this.reset} />
    ) : (
      <PageFallback error={error} reset={this.reset} />
    );
  }
}

// ── Full-page fallback ────────────────────────────────────────────────────────

function PageFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      {/* Red grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md text-center flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl">
          ⚠️
        </div>

        {/* Heading */}
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-red-500 mb-2">
            Something went wrong
          </p>
          <h1 className="text-2xl font-extrabold text-white mb-2">
            Unexpected Error
          </h1>
          <p className="text-white/45 text-sm leading-relaxed">
            An error occurred while rendering this page. Our team has been
            notified. You can try again or go back home.
          </p>
        </div>

        {/* Error message (dev-friendly) */}
        {process.env.NODE_ENV === "development" && (
          <div className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-left">
            <p className="text-xs font-mono text-red-400 wrap-break-word leading-relaxed">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
          <a
            href="/"
            className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Inline / section-level fallback ──────────────────────────────────────────

function InlineFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-8 flex flex-col items-center gap-4 text-center">
      <span className="text-3xl">⚠️</span>
      <div>
        <p className="font-bold text-white text-sm mb-1">Failed to load this section</p>
        <p className="text-white/40 text-xs leading-relaxed">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong. Please try again."}
        </p>
      </div>
      <button
        onClick={reset}
        className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-4 py-1.5 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
