"use client";

import { useEffect, useRef } from "react";

interface Props {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirm({
  title = "Delete this item?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel by default (safer UX)
  useEffect(() => {
    cancelRef.current?.focus();
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Red top accent */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="px-6 py-6 flex flex-col gap-4">
          {/* Icon + text */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-lg">
              🗑️
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{title}</h3>
              <p className="text-white/45 text-xs mt-1 leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={loading}
              className="flex-1 text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 py-2 rounded-xl transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 py-2 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
