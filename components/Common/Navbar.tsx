"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/utils/config";
import { useCart } from "@/contexts/CartContext";
import { useTransition } from "@/contexts/TransitionContext";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { navigate, isTransitioning } = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);

  function go(href: string) {
    if (pathname === href) return;
    setMenuOpen(false);
    navigate(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => go("/")}
          className="text-red-500 font-extrabold text-xl tracking-widest uppercase hover:text-red-400 transition-colors"
        >
          {SITE_CONFIG.name}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                disabled={isTransitioning}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:pointer-events-none ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => go("/cart")}
            disabled={isTransitioning}
            aria-label="Cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-red-500/50 hover:bg-white/5 transition-colors disabled:pointer-events-none"
          >
            <ShoppingCart size={18} className="text-white/70" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center animate-scale-in">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} className="text-white/70" /> : <Menu size={18} className="text-white/70" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0d0d] px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                disabled={isTransitioning}
                className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors disabled:pointer-events-none ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
