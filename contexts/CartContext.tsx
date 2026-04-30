"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/utils/products";

// One account per product — no quantity
export interface CartItem extends Product {
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("teamfury-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) localStorage.setItem("teamfury-cart", JSON.stringify(items));
  }, [items, isLoading]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      // Already in cart — no duplicates
      if (prev.some((i) => i.id === product.id)) return prev;
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromCart = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.id !== productId));

  const clearCart = () => setItems([]);

  const isInCart = (productId: string) => items.some((i) => i.id === productId);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, i) => sum + i.discountedPrice, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, isInCart, totalItems, totalPrice, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
