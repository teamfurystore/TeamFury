"use client";

import { useEffect } from "react";
import { X, ShoppingCart, Shield, Zap, CheckCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RANK_COLORS } from "@/utils/products";
import { type DbProduct } from "@/features/products/productsSlice";
import { useCart } from "@/contexts/CartContext";

interface Props {
  product: DbProduct;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const discount = product.price > 0
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleAdd() {
    if (inCart) return;
    addToCart(product);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition-colors"
        >
          <X size={14} />
        </button>

        {/* Hero */}
        <div className="relative aspect-video bg-linear-to-br from-red-900/30 to-zinc-900 rounded-t-2xl overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl opacity-10">🎮</span>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.badge && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold leading-snug">{product.title}</h2>
            <div className="text-right shrink-0">
              <p className="text-2xl font-extrabold text-white">
                ₹{product.discounted_price.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-white/30 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <p className="text-white/55 text-sm leading-relaxed">{product.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Current Rank",  value: product.current_rank,  color: RANK_COLORS[product.current_rank] },
              { label: "Peak Rank",     value: product.peak_rank,     color: RANK_COLORS[product.peak_rank] },
              { label: "Level",         value: `Lv. ${product.level}`, color: "text-white" },
              { label: "Skins",         value: `${product.skins}`,    color: "text-purple-400" },
              { label: "Knives",        value: `${product.knives}`,   color: "text-red-400" },
              { label: "Battle Passes", value: `${product.battle_passes}`, color: "text-blue-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3">
                <p className="text-white/40 text-xs mb-1">{s.label}</p>
                <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {product.verified && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
                <Shield size={11} /> Verified
              </span>
            )}
            {product.instant_delivery && (
              <span className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full">
                <Zap size={11} /> Instant Delivery
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full">
              <CheckCircle size={11} /> {product.region}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-full transition-all text-sm active:scale-95 disabled:cursor-default ${
              inCart
                ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {inCart ? (
                <motion.span key="in" className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}>
                  <Check size={15} /> Added to Cart
                </motion.span>
              ) : (
                <motion.span key="add" className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}>
                  <ShoppingCart size={15} />
                  Add to Cart — ₹{product.discounted_price.toLocaleString("en-IN")}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
