"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; max-age=0";
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Nav */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <span className="font-extrabold text-white tracking-tight">TEAM FURY</span>
            <span className="ml-2 text-xs text-indigo-400 font-medium bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-white/40 hover:text-white/80 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
