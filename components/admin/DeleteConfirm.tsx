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

  useEffect(() => {
    cancelRef.current?.focus();
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-xs bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-4">

        {/* Icon + text */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0 text-base">
            🗑️
          </div>
          <div className="pt-0.5">
            <p className="text-sm font-semibold text-white leading-snug">{title}</p>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
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
  );
}
