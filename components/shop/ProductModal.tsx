"use client";

import { useEffect } from "react";
import { X, ShoppingCart, Shield, Zap, CheckCircle } from "lucide-react";
import { Product, RANK_COLORS } from "@/utils/products";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const discount = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={15} />
        </button>

        {/* Hero image area */}
        <div className="relative aspect-video bg-linear-to-br from-red-900/40 to-zinc-900 rounded-t-2xl flex items-center justify-center">
          <span className="text-8xl opacity-20">🎮</span>
          <div className="absolute top-4 left-4 flex gap-2">
            {product.badge && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest">
                {product.badge}
              </span>
            )}
            <span className="bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold leading-snug">
              {product.title}
            </h2>
            <div className="text-right shrink-0">
              <p className="text-2xl font-extrabold text-white">
                ₹{product.discountedPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-white/30 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Current Rank",
                value: product.currentRank,
                color: RANK_COLORS[product.currentRank],
              },
              {
                label: "Peak Rank",
                value: product.peakRank,
                color: RANK_COLORS[product.peakRank],
              },
              { label: "Account Level", value: `Lv. ${product.level}`, color: "text-white" },
              { label: "Premium Skins", value: `${product.skins} skins`, color: "text-purple-400" },
              { label: "Rare Knives", value: `${product.knives} knives`, color: "text-red-400" },
              { label: "Battle Passes", value: `${product.battlePasses} passes`, color: "text-blue-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-3"
              >
                <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                <p className={`font-bold text-sm ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {product.verified && (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full">
                <Shield size={12} /> Verified Account
              </span>
            )}
            {product.instantDelivery && (
              <span className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full">
                <Zap size={12} /> Instant Delivery
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full">
              <CheckCircle size={12} /> {product.region} Region
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-full transition-colors text-sm"
          >
            <ShoppingCart size={16} />
            Add to Cart — ₹{product.discountedPrice.toLocaleString("en-IN")}
          </button>
        </div>
      </div>
    </div>
  );
}
