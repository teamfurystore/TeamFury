"use client";

import Link from "next/link";
import { ShoppingCart, Shield, Zap, CheckCircle, ArrowLeft, Star, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, RANK_COLORS } from "@/utils/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "./ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const discount = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );

  const stats = [
    { label: "Current Rank",  value: product.currentRank,  color: RANK_COLORS[product.currentRank] },
    { label: "Peak Rank",     value: product.peakRank,     color: RANK_COLORS[product.peakRank] },
    { label: "Account Level", value: `Lv. ${product.level}`, color: "text-white" },
    { label: "Premium Skins", value: `${product.skins} skins`, color: "text-purple-400" },
    { label: "Rare Knives",   value: `${product.knives} knives`, color: "text-red-400" },
    { label: "Battle Passes", value: `${product.battlePasses} passes`, color: "text-blue-400" },
    { label: "Region",        value: product.region, color: "text-cyan-400" },
    { label: "Delivery",      value: product.instantDelivery ? "Instant (< 5 min)" : "Within 24h",
      color: product.instantDelivery ? "text-emerald-400" : "text-yellow-400" },
  ];

  return (
    <div className="font-sans">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link href="/shop"
          className="inline-flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>
      </div>

      {/* Main */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Image */}
        <ScrollReveal direction="left" duration={0.7}>
          <div className="relative aspect-video bg-linear-to-br from-red-900/30 to-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/8">
            <span className="text-9xl opacity-8">🎮</span>
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
            {product.instantDelivery && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Zap size={11} /> Instant Delivery
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Info */}
        <ScrollReveal direction="right" duration={0.7}>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">TEAM FURY</p>
              <h1 className="text-3xl font-extrabold leading-tight mb-3">{product.title}</h1>
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-white/35 text-xs ml-2">Verified Purchase</span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y border-white/8">
              <span className="text-4xl font-extrabold text-white">
                ₹{product.discountedPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-lg text-white/30 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="bg-emerald-600/15 text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                Save ₹{(product.price - product.discountedPrice).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-2">
              {product.verified && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
                  <Shield size={11} /> Verified Account
                </span>
              )}
              {product.instantDelivery && (
                <span className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full">
                  <Zap size={11} /> Instant Delivery
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full">
                <CheckCircle size={11} /> {product.region} Region
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => !inCart && addToCart(product)}
                disabled={inCart}
                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all text-sm active:scale-95 disabled:cursor-default ${
                  inCart
                    ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {inCart ? (
                    <motion.span key="in" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}>
                      <Check size={16} /> Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="add" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}>
                      <ShoppingCart size={16} />
                      Add to Cart — ₹{product.discountedPrice.toLocaleString("en-IN")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <a
                href={`https://wa.me/918511037477?text=Hi%20TEAM%20FURY!%20I%20want%20to%20buy%20${encodeURIComponent(product.title)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-400 hover:text-emerald-300 font-semibold py-4 rounded-full transition-all text-sm"
              >
                💬 Buy via WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Stats grid */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <ScrollReveal direction="up" duration={0.6}>
          <h2 className="text-lg font-extrabold mb-4">Account Details</h2>
        </ScrollReveal>
        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-4 gap-3" stagger={0.07} y={24} duration={0.55}>
          {stats.map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-colors">
              <p className="text-white/40 text-xs mb-1">{s.label}</p>
              <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </StaggerReveal>
      </section>

      {/* What's included */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <ScrollReveal direction="up" duration={0.6}>
          <h2 className="text-lg font-extrabold mb-4">What&apos;s Included</h2>
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div key={item} className="flex items-center gap-2 text-sm text-white/65">
                <span className="text-emerald-400 shrink-0">✓</span> {item}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <ScrollReveal direction="up" duration={0.6}>
            <h2 className="text-lg font-extrabold mb-6">You May Also Like</h2>
          </ScrollReveal>
          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.1} y={30} duration={0.6}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </StaggerReveal>
        </section>
      )}
    </div>
  );
}
