"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export default function AdminModal({ title, onClose, children, size = "md" }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full ${sizes[size]} bg-[#161616] border border-white/10 rounded-2xl shadow-2xl`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
