"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const PAGE_TITLES: Record<string, string> = {
  "/":        "TEAM FURY | Premium Valorant Accounts",
  "/shop":    "Shop | TEAM FURY",
  "/cart":    "Cart | TEAM FURY",
  "/review":  "Reviews | TEAM FURY",
  "/about":   "About | TEAM FURY",
  "/contact": "Contact | TEAM FURY",
};

export default function TabTitleManager() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    // Match exact or prefix (e.g. /shop/some-slug → "Shop | TEAM FURY")
    const base =
      PAGE_TITLES[pathname] ??
      PAGE_TITLES[Object.keys(PAGE_TITLES).find((k) => k !== "/" && pathname.startsWith(k)) ?? ""] ??
      "TEAM FURY";

    document.title = totalItems > 0 ? `(${totalItems}) ${base}` : base;
  }, [pathname, totalItems]);

  return null;
}
