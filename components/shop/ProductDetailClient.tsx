"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Shield, Zap, CheckCircle, ArrowLeft, Star } from "lucide-react";
import { Product, RANK_COLORS } from "@/utils/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "./ProductCard";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const discount = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const stats = [
    { label: "Current Rank", value: product.currentRank, color: RANK_COLORS[product.currentRank] },
    { label: "Peak Rank", value: product.peakRank, color: RANK_COLORS[product.peakRank] },
    { label: "Account Level", value: `Lv. ${product.level}`, color: "text-white" },
    { label: "Premium Skins", value: `${product.skins} skins`, color: "text-purple-400" },
    { label: "Rare Knives", value: `${product.knives} knives`, color: "text-red-400" },
    { label: "Battle Passes", value: `${product.battlePasses} passes`, color: "text-blue-400" },
    { label: "Region", value: product.region, color: "text-cyan-400" },
    { label: "Delivery", value: product.instantDelivery ? "Instant (< 5 min)" : "Within 24h", color: product.instantDelivery ? "text-green-400" : "text-yellow-400" },
  ];

  return (
    <div className="font-sans">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>
      </div>

      {/* Main detail */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left — image */}
        <div className="relative aspect-video bg-linear-to-br from-red-900/40 to-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
          <span className="text-9xl opacity-10">🎮</span>
          <div className="absolute top-4 left-4 flex gap-2">
            {product.badge && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest animate-pulse">
                {product.badge}
              </span>
            )}
            <span className="bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          </div>
          {product.instantDelivery && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-green-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <Zap size={12} /> Instant Delivery
            </div>
          )}
        </div>

        {/* Right — info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">TEAM FURY</p>
            <h1 className="text-3xl font-extrabold leading-tight mb-3">{product.title}</h1>
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-white/40 text-xs ml-2">5.0 · Verified Purchase</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 py-4 border-y border-white/10">
            <span className="text-4xl font-extrabold text-white">
              ₹{product.discountedPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-lg text-white/30 line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="bg-green-600/20 text-green-400 text-sm font-bold px-3 py-1 rounded-full border border-green-500/30">
              Save ₹{(product.price - product.discountedPrice).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all text-sm active:scale-95 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-red-600 hover:bg-red-500 text-white"
              }`}
            >
              <ShoppingCart size={16} />
              {added ? "✓ Added to Cart!" : `Add to Cart — ₹${product.discountedPrice.toLocaleString("en-IN")}`}
            </button>
            <a
              href={`https://wa.me/918511037477?text=Hi%20TEAM%20FURY!%20I%20want%20to%20buy%20${encodeURIComponent(product.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-green-500/40 hover:border-green-400 text-green-400 hover:text-green-300 font-bold py-4 rounded-full transition-all text-sm"
            >
              💬 Buy via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-lg font-extrabold mb-4">Account Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors">
              <p className="text-white/40 text-xs mb-1">{s.label}</p>
              <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-lg font-extrabold mb-4">What&apos;s Included</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            `${product.skins} Premium Skins`,
            product.knives > 0 ? `${product.knives} Rare Knife(s)` : null,
            product.battlePasses > 0 ? `${product.battlePasses} Battle Pass(es)` : null,
            "Verified Email Access",
            "Full Account Ownership",
            "Post-Sale Support",
            product.instantDelivery ? "Instant Delivery (< 5 min)" : "Delivery within 24h",
            "Anti-Scam Guarantee",
          ].filter(Boolean).map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-green-400 shrink-0">✓</span> {item}
            </div>
          ))}
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-lg font-extrabold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
