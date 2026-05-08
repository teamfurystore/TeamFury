"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { type DbProduct } from "@/features/products/productsSlice";
import { type VPPackage } from "@/utils/vpStore";

// ── Account cart ──────────────────────────────────────────────────────────────

export interface CartItem extends DbProduct {
  addedAt: string;
}

// ── VP cart ───────────────────────────────────────────────────────────────────

export interface VPCartItem {
  pkg: VPPackage;
  qty: number;
}

// ── Context type ──────────────────────────────────────────────────────────────

interface CartContextType {
  // Account items
  items: CartItem[];
  addToCart: (product: DbProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  totalItems: number;
  totalPrice: number;

  // VP items
  vpItems: VPCartItem[];
  addVPItem: (pkg: VPPackage) => void;
  removeVPItem: (pkgId: string) => void;
  removeAllVPItem: (pkgId: string) => void;
  clearVPCart: () => void;
  getVPQty: (pkgId: string) => number;
  vpTotalItems: number;
  vpTotalPrice: number;
  vpTotalVP: number;

  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [vpItems, setVPItems] = useState<VPCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("teamfury-cart");
      if (saved) setItems(JSON.parse(saved));
      const savedVP = localStorage.getItem("teamfury-vp-cart");
      if (savedVP) setVPItems(JSON.parse(savedVP));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist account cart
  useEffect(() => {
    if (!isLoading) localStorage.setItem("teamfury-cart", JSON.stringify(items));
  }, [items, isLoading]);

  // Persist VP cart
  useEffect(() => {
    if (!isLoading) localStorage.setItem("teamfury-vp-cart", JSON.stringify(vpItems));
  }, [vpItems, isLoading]);

  // ── Account cart actions ──────────────────────────────────────────────────

  const addToCart = (product: DbProduct) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromCart = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.id !== productId));

  const clearCart = () => setItems([]);
  const isInCart = (productId: string) => items.some((i) => i.id === productId);
  const totalItems = items.length;
  const totalPrice = items.reduce((sum, i) => sum + i.discounted_price, 0);

  // ── VP cart actions ───────────────────────────────────────────────────────

  const addVPItem = (pkg: VPPackage) => {
    setVPItems((prev) => {
      const ex = prev.find((c) => c.pkg.id === pkg.id);
      if (ex) return prev.map((c) => c.pkg.id === pkg.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { pkg, qty: 1 }];
    });
  };

  const removeVPItem = (pkgId: string) => {
    setVPItems((prev) => {
      const ex = prev.find((c) => c.pkg.id === pkgId);
      if (!ex) return prev;
      if (ex.qty <= 1) return prev.filter((c) => c.pkg.id !== pkgId);
      return prev.map((c) => c.pkg.id === pkgId ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const removeAllVPItem = (pkgId: string) =>
    setVPItems((prev) => prev.filter((c) => c.pkg.id !== pkgId));

  const clearVPCart = () => setVPItems([]);
  const getVPQty = (pkgId: string) => vpItems.find((c) => c.pkg.id === pkgId)?.qty ?? 0;
  const vpTotalItems = vpItems.reduce((s, i) => s + i.qty, 0);
  const vpTotalPrice = vpItems.reduce((s, i) => s + i.pkg.price * i.qty, 0);
  const vpTotalVP = vpItems.reduce((s, i) => s + i.pkg.vp * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, clearCart, isInCart, totalItems, totalPrice,
      vpItems, addVPItem, removeVPItem, removeAllVPItem, clearVPCart, getVPQty,
      vpTotalItems, vpTotalPrice, vpTotalVP,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
