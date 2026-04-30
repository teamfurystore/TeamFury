"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, RANK_COLORS } from "@/utils/products";
import { useCart } from "@/contexts/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const [justAdded, setJustAdded] = useState(false);

  const discount = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );

  function handleAdd() {
    if (inCart) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 flex flex-col">

      {/* Image area */}
      <div className="relative aspect-video bg-linear-to-br from-red-900/20 to-zinc-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <span className="text-5xl opacity-15">🎮</span>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
        {product.badge && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest">
            {product.badge}
          </span>
        )}
        
        {product.instantDelivery && (
          <span className="mt-0 bg-emerald-600/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ top: product.badge ? "2.2rem" : "0.75rem" }}>
            ⚡ Instant
          </span>
        )}
        </div>
        <span className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-extrabold px-2 py-1 rounded-full">
          -{discount}%
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <h3 className="font-bold text-sm leading-snug text-white">{product.title}</h3>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-white/40">Rank:</span>
          <span className={`font-bold ${RANK_COLORS[product.currentRank]}`}>{product.currentRank}</span>
          <span className="text-white/20">·</span>
          <span className="text-white/40">Peak:</span>
          <span className={`font-bold ${RANK_COLORS[product.peakRank]}`}>{product.peakRank}</span>
        </div>

        <div className="flex gap-3 text-xs text-white/45">
          <span>🎨 {product.skins} skins</span>
          {product.knives > 0 && <span>🔪 {product.knives} knives</span>}
          <span>Lv.{product.level}</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-xl font-extrabold text-white">
            ₹{product.discountedPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-white/30 line-through">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <Link
            href={`/shop/${product.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-white/15 hover:border-white/35 text-white/60 hover:text-white text-xs font-medium py-2.5 rounded-full transition-all"
          >
            <Eye size={12} /> Details
          </Link>

          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-full transition-all active:scale-95 disabled:cursor-default ${
              inCart
                ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {inCart ? (
                <motion.span
                  key="added"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check size={12} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShoppingCart size={12} /> Add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}
