"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, MessageCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/contexts/CartContext";
import { RANK_COLORS } from "@/utils/products";
import { ROUTE_SHOP_PRODUCTS } from "@/utils/routes";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { FURY_VALORANT } from "@/utils/config";

// ── Availability check ────────────────────────────────────────────────────────

type ValidityMap = Record<string, boolean>; // productId → still active

async function checkAvailability(ids: string[]): Promise<ValidityMap> {
  try {
    const res = await fetch(ROUTE_SHOP_PRODUCTS, { cache: "no-store" });
    const json = await res.json();
    const activeIds = new Set<string>(
      (json.data ?? []).map((p: { id: string }) => p.id)
    );
    return Object.fromEntries(ids.map((id) => [id, activeIds.has(id)]));
  } catch {
    // Network error — assume all valid so we don't block checkout on a fluke
    return Object.fromEntries(ids.map((id) => [id, true]));
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CartClient() {
  const { items, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const [validity, setValidity] = useState<ValidityMap>({});
  const [checking, setChecking] = useState(false);

  // Check availability whenever cart items change
  useEffect(() => {
    if (items.length === 0) { setValidity({}); return; }
    setChecking(true);
    checkAvailability(items.map((i) => i.id)).then((map) => {
      setValidity(map);
      setChecking(false);
    });
  }, [items.length]); // re-run when count changes (add / remove)

  const unavailableIds = Object.entries(validity)
    .filter(([, ok]) => !ok)
    .map(([id]) => id);

  const hasUnavailable = unavailableIds.length > 0;
  const canCheckout = !checking && !hasUnavailable && items.length > 0;

  function removeUnavailable() {
    unavailableIds.forEach((id) => removeFromCart(id));
  }
  console.log("items",items)
  function generateWhatsAppMessage() {
    if (!items.length) return "";
    
    let msg = "Hi TEAM FURY! I want to purchase the following accounts:\n\n";
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.title}\n`;
      msg += `   • Rank: ${item.current_rank} (Peak: ${item.peak_rank})\n`;
      msg += `   • Skins: ${item.skins} | Knives: ${item.knives}\n`;
      msg += `   • Price: ₹${item.discounted_price.toLocaleString("en-IN")}\n\n`;
      msg += `   • Account URL: ${FURY_VALORANT}/shop/${item.slug}\n\n`;
    });
    msg += `Total: ₹${totalPrice.toLocaleString("en-IN")} (${totalItems} account${totalItems > 1 ? "s" : ""})\n\n`;
    msg += "Please confirm availability and send payment details. Thank you!";
    return encodeURIComponent(msg);
  }

  // ── Empty state ─────────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <ScrollReveal direction="scale" duration={0.6}>
          <ShoppingBag size={64} className="text-white/15 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold mb-3">Your cart is empty</h1>
          <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
            You haven&apos;t added any accounts yet. Browse the shop to find your perfect match.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3 rounded-full transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <ShoppingBag size={15} /> Browse Accounts
          </Link>
        </ScrollReveal>
      </div>
    );
  }

  // ── Cart ────────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        <Link href="/shop"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group mb-6">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Cart</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {totalItems} account{totalItems > 1 ? "s" : ""} selected
            </p>
          </div>
          <button onClick={clearCart} className="text-xs text-white/30 hover:text-red-400 transition-colors">
            Clear all
          </button>
        </div>
      </div>

      {/* Unavailable banner */}
      <AnimatePresence>
        {hasUnavailable && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="max-w-6xl mx-auto px-6 mb-2"
          >
            <div className="flex items-center justify-between gap-4 bg-amber-500/8 border border-amber-500/25 rounded-2xl px-5 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                <p className="text-sm text-amber-300 leading-snug">
                  <span className="font-semibold">
                    {unavailableIds.length} account{unavailableIds.length > 1 ? "s are" : " is"} no longer available.
                  </span>{" "}
                  Remove {unavailableIds.length > 1 ? "them" : "it"} to proceed to checkout.
                </p>
              </div>
              <button
                onClick={removeUnavailable}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400/50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
              >
                Remove {unavailableIds.length > 1 ? "all" : "it"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const isUnavailable = validity[item.id] === false;
              const discount = item.price > 0
                ? Math.round(((item.price - item.discounted_price) / item.price) * 100)
                : 0;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative bg-white/4 border rounded-2xl p-5 flex gap-4 transition-colors ${
                    isUnavailable
                      ? "border-amber-500/30 bg-amber-500/4"
                      : "border-white/8 hover:border-white/15"
                  }`}
                >
                  {/* Unavailable overlay tag */}
                  {isUnavailable && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <AlertTriangle size={9} />
                      No longer available
                    </div>
                  )}

                  {/* Thumbnail */}
                  <div className={`relative w-28 aspect-video bg-linear-to-br from-red-900/25 to-zinc-900 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${
                    isUnavailable ? "opacity-40 grayscale" : ""
                  }`}>
                    {item.image ? (
                      <img src={item.image} alt={item.title}
                        className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-3xl opacity-15">🎮</span>
                    )}
                    {item.badge && (
                      <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-yellow-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className={`flex-1 flex flex-col gap-2 min-w-0 ${isUnavailable ? "opacity-50" : ""}`}>
                    <Link href={`/shop/${item.slug}`}
                      className="font-semibold text-sm hover:text-red-400 transition-colors truncate pr-28">
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className={`font-bold ${RANK_COLORS[item.current_rank]}`}>{item.current_rank}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-white/40">Peak:</span>
                      <span className={`font-bold ${RANK_COLORS[item.peak_rank]}`}>{item.peak_rank}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-white/40">
                      <span>🎨 {item.skins} skins</span>
                      {item.knives > 0 && <span>🔪 {item.knives} knives</span>}
                      <span>Lv.{item.level}</span>
                    </div>
                  </div>

                  {/* Price + remove */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <p className={`text-lg font-extrabold ${isUnavailable ? "text-white/30 line-through" : "text-white"}`}>
                      ₹{item.discounted_price.toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full border border-white/8 hover:border-red-500/40 hover:bg-red-500/8 flex items-center justify-center transition-colors group"
                      aria-label="Remove"
                    >
                      <Trash2 size={12} className="text-white/30 group-hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <ScrollReveal direction="right" duration={0.6}>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-5">Order Summary</h3>

              <div className="flex flex-col gap-3 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Accounts ({totalItems})</span>
                  <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Delivery</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="border-t border-white/8 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-xl text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {[
                  { icon: "⚡", text: "Instant Delivery" },
                  { icon: "🔒", text: "100% Secure" },
                  { icon: "✅", text: "Verified Accounts" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-white/40">
                    <span>{b.icon}</span> {b.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {/* Checkout button — disabled when checking or unavailable items exist */}
                {canCheckout ? (
                  <a
                    href={`https://wa.me/918511037477?text=${generateWhatsAppMessage()}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 text-sm"
                  >
                    <MessageCircle size={15} /> Checkout via WhatsApp
                  </a>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/25 font-bold py-3.5 rounded-full cursor-not-allowed text-sm"
                    >
                      {checking ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Checking availability…
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={14} className="text-amber-400" />
                          Checkout unavailable
                        </>
                      )}
                    </button>
                    {!checking && hasUnavailable && (
                      <p className="text-xs text-amber-400/80 text-center leading-relaxed">
                        Remove unavailable accounts above to continue.
                      </p>
                    )}
                  </div>
                )}

                <p className="text-xs text-white/30 text-center leading-relaxed">
                  You&apos;ll be redirected to WhatsApp with your order details.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
