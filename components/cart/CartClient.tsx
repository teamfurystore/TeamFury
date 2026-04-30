"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/contexts/CartContext";
import { RANK_COLORS } from "@/utils/products";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerReveal from "@/components/ui/StaggerReveal";

export default function CartClient() {
  const { items, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  function generateWhatsAppMessage() {
    if (!items.length) return "";
    let msg = "Hi TEAM FURY! I want to purchase the following accounts:\n\n";
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.title}\n`;
      msg += `   • Rank: ${item.currentRank} (Peak: ${item.peakRank})\n`;
      msg += `   • Skins: ${item.skins} | Knives: ${item.knives}\n`;
      msg += `   • Price: ₹${item.discountedPrice.toLocaleString("en-IN")}\n\n`;
    });
    msg += `Total: ₹${totalPrice.toLocaleString("en-IN")} (${totalItems} account${totalItems > 1 ? "s" : ""})\n\n`;
    msg += "Please confirm availability and send payment details. Thank you!";
    return encodeURIComponent(msg);
  }

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
          <button onClick={clearCart}
            className="text-xs text-white/30 hover:text-red-400 transition-colors">
            Clear all
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const discount = Math.round(((item.price - item.discountedPrice) / item.price) * 100);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/4 border border-white/8 rounded-2xl p-5 flex gap-4 hover:border-white/15 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-28 aspect-video bg-linear-to-br from-red-900/25 to-zinc-900 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    <span className="text-3xl opacity-15">🎮</span>
                    {item.badge && (
                      <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute top-1.5 right-1.5 bg-yellow-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <Link href={`/shop/${item.slug}`}
                      className="font-semibold text-sm hover:text-red-400 transition-colors truncate">
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className={`font-bold ${RANK_COLORS[item.currentRank]}`}>{item.currentRank}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-white/40">Peak:</span>
                      <span className={`font-bold ${RANK_COLORS[item.peakRank]}`}>{item.peakRank}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-white/40">
                      <span>🎨 {item.skins} skins</span>
                      {item.knives > 0 && <span>🔪 {item.knives} knives</span>}
                      <span>Lv.{item.level}</span>
                    </div>
                  </div>

                  {/* Price + remove */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <p className="text-lg font-extrabold text-white">
                      ₹{item.discountedPrice.toLocaleString("en-IN")}
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
                <a
                  href={`https://wa.me/918511037477?text=${generateWhatsAppMessage()}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  <MessageCircle size={15} /> Checkout via WhatsApp
                </a>
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
