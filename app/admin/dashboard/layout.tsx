"use client";

import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; max-age=0";
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            fontSize: "13px",
            borderRadius: "12px",
          },
        }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

          <div className="flex items-center gap-2.5">
            <span className="text-base">🛡️</span>
            <span className="font-semibold text-white text-sm">TEAM FURY</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-xs text-white/40">Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Page */}
      <div className="max-w-7xl mx-auto px-5 py-7">
        {children}
      </div>
    </div>
  );
}
