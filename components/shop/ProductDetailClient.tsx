"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Shield, Zap, CheckCircle, ArrowLeft, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RANK_COLORS } from "@/utils/products";
import { type DbProduct, type DbProductItem } from "@/features/products/productsSlice";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "./ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";

// ── Skin lightbox ─────────────────────────────────────────────────────────────

function SkinLightbox({
  skins,
  startIndex,
  onClose,
}: {
  skins: DbProductItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const skin = skins[idx];
  const prev = () => setIdx((i) => (i - 1 + skins.length) % skins.length);
  const next = () => setIdx((i) => (i + 1) % skins.length);

  // Keyboard nav
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={skin.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="w-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-6"
          >
            {skin.display_icon ? (
              <img
                src={skin.display_icon}
                alt={skin.display_name}
                className="w-full max-h-56 object-contain"
              />
            ) : (
              <span className="text-6xl opacity-20">🔫</span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Name + counter */}
        <div className="text-center">
          <p className="text-white font-semibold text-sm">{skin.display_name}</p>
          <p className="text-white/35 text-xs mt-0.5">{idx + 1} / {skins.length}</p>
        </div>

        {/* Prev / Next */}
        {skins.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {/* Dot indicators (max 10) */}
            <div className="flex gap-1.5">
              {skins.slice(0, 10).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === idx ? "bg-red-500 w-3" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
              {skins.length > 10 && (
                <span className="text-white/25 text-[10px] ml-1">+{skins.length - 10}</span>
              )}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skin grid ─────────────────────────────────────────────────────────────────

function SkinsSection({ skins }: { skins: DbProductItem[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  if (skins.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-10">
      <ScrollReveal direction="up" duration={0.6}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-extrabold">Skins in this Account</h2>
          <span className="text-xs text-white/35 bg-white/6 border border-white/10 px-2.5 py-1 rounded-full">
            {skins.length} skins
          </span>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {skins.map((skin, i) => (
          <button
            key={skin.id}
            type="button"
            onClick={() => setLightboxIdx(i)}
            className="group flex flex-col gap-1.5 p-2.5 bg-white/3 border border-white/8 rounded-xl hover:border-white/20 hover:bg-white/6 transition-all text-left focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <div className="w-full aspect-2/1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
              {skin.display_icon ? (
                <img
                  src={skin.display_icon}
                  alt={skin.display_name}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <span className="text-lg opacity-15">🔫</span>
              )}
            </div>
            <p className="text-[10px] text-white/55 leading-snug line-clamp-2 group-hover:text-white/80 transition-colors">
              {skin.display_name}
            </p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <SkinLightbox
            skins={skins}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  product: DbProduct;
  related: DbProduct[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const discount = product.price > 0
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  const stats = [
    { label: "Current Rank",  value: product.current_rank,  color: RANK_COLORS[product.current_rank] },
    { label: "Peak Rank",     value: product.peak_rank,     color: RANK_COLORS[product.peak_rank] },
    { label: "Account Level", value: `Lv. ${product.level}`, color: "text-white" },
    { label: "Premium Skins", value: `${product.skins} skins`, color: "text-purple-400" },
    { label: "Rare Knives",   value: `${product.knives} knives`, color: "text-red-400" },
    { label: "Battle Passes", value: `${product.battle_passes} passes`, color: "text-blue-400" },
    { label: "Region",        value: product.region, color: "text-cyan-400" },
    {
      label: "Delivery",
      value: product.instant_delivery ? "Instant (< 5 min)" : "Within 24h",
      color: product.instant_delivery ? "text-emerald-400" : "text-yellow-400",
    },
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
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-9xl opacity-8">🎮</span>
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
            {product.instant_delivery && (
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
              {product.profile_url && (
                <Link
                  href={product.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm mb-3 transition-colors"
                >
                  🔗 View Profile Details
                </Link>
              )}
              <p className="text-white/55 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y border-white/8">
              <span className="text-4xl font-extrabold text-white">
                ₹{product.discounted_price.toLocaleString("en-IN")}
              </span>
              <span className="text-lg text-white/30 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <span className="bg-emerald-600/15 text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                  Save ₹{(product.price - product.discounted_price).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {product.verified && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
                  <Shield size={11} /> Verified Account
                </span>
              )}
              {product.instant_delivery && (
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
                      Add to Cart — ₹{product.discounted_price.toLocaleString("en-IN")}
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
              product.battle_passes > 0 ? `${product.battle_passes} Battle Pass(es)` : null,
              "Verified Email Access",
              "Full Account Ownership",
              "Post-Sale Support",
              product.instant_delivery ? "Instant Delivery (< 5 min)" : "Delivery within 24h",
              "Anti-Scam Guarantee",
            ].filter(Boolean).map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/65">
                <span className="text-emerald-400 shrink-0">✓</span> {item}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Skins section — only shown if skins are saved */}
      <SkinsSection skins={product.product_items ?? []} />

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
