"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, MessageCircle, AlertTriangle, RefreshCw, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/contexts/CartContext";
import { RANK_COLORS } from "@/utils/products";
import { ROUTE_SHOP_PRODUCTS } from "@/utils/routes";
import { STORE_CONFIG, buildWhatsAppMessage } from "@/utils/vpStore";
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
  const { items, removeFromCart, clearCart, totalPrice, totalItems,
    vpItems, addVPItem, removeVPItem, removeAllVPItem, clearVPCart,
    vpTotalItems, vpTotalPrice, vpTotalVP } = useCart();

  const [validity, setValidity] = useState<ValidityMap>({});
  const [checking, setChecking] = useState(false);
  const [riotId, setRiotId] = useState("");

  // Check availability whenever cart items change
  useEffect(() => {
    if (items.length === 0) { setValidity({}); return; }
    setChecking(true);
    checkAvailability(items.map((i) => i.id)).then((map) => {
      setValidity(map);
      setChecking(false);
    });
  }, [items.length]);

  const unavailableIds = Object.entries(validity)
    .filter(([, ok]) => !ok)
    .map(([id]) => id);

  const hasUnavailable = unavailableIds.length > 0;
  const hasAccounts = items.length > 0;
  const hasVP = vpItems.length > 0;
  const riotIdValid = riotId.trim().includes("#") && riotId.trim().length > 3;

  // Checkout is ready when:
  // - not still checking availability
  // - no unavailable account items
  // - at least one item exists
  // - if VP items present, Riot ID must be filled
  const canCheckout =
    !checking &&
    !hasUnavailable &&
    (hasAccounts || hasVP) &&
    (!hasVP || riotIdValid);

  function removeUnavailable() {
    unavailableIds.forEach((id) => removeFromCart(id));
  }

  function buildCombinedWhatsAppMessage() {
    let msg = "Hi TEAM FURY! I want to place the following order:\n\n";

    if (hasAccounts) {
      msg += "🎮 *Valorant Accounts:*\n";
      items.forEach((item, i) => {
        msg += `${i + 1}. ${item.title}\n`;
        msg += `   • Rank: ${item.current_rank} (Peak: ${item.peak_rank})\n`;
        msg += `   • Skins: ${item.skins} | Knives: ${item.knives}\n`;
        msg += `   • Price: ₹${item.discounted_price.toLocaleString("en-IN")}\n`;
        msg += `   • URL: ${FURY_VALORANT}/shop/${item.slug}\n\n`;
      });
      msg += `Accounts subtotal: ₹${totalPrice.toLocaleString("en-IN")} (${totalItems} account${totalItems > 1 ? "s" : ""})\n\n`;
    }

    if (hasVP) {
      msg += "💎 *Valorant Points:*\n";
      msg += `🎮 Riot ID: ${riotId.trim()}\n`;
      vpItems.forEach((item) => {
        msg += `  • ${item.pkg.vp.toLocaleString()} ${item.pkg.label} × ${item.qty} = ₹${(item.pkg.price * item.qty).toLocaleString("en-IN")}\n`;
      });
      msg += `VP subtotal: ₹${vpTotalPrice.toLocaleString("en-IN")} (${vpTotalVP.toLocaleString()} VP)\n\n`;
    }

    msg += `💰 *Grand Total: ₹${(totalPrice + vpTotalPrice).toLocaleString("en-IN")}*\n\n`;
    msg += "Please confirm availability and send payment details. Thank you!";
    return encodeURIComponent(msg);
  }

  // ── Empty state ─────────────────────────────────────────────────────────────

  if (items.length === 0 && vpItems.length === 0) {
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
              {totalItems > 0 && `${totalItems} account${totalItems > 1 ? "s" : ""}`}
              {totalItems > 0 && vpTotalItems > 0 && " · "}
              {vpTotalItems > 0 && `${vpTotalItems} VP item${vpTotalItems > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => { clearCart(); clearVPCart(); }}
            className="text-xs text-white/30 hover:text-red-400 transition-colors"
          >
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

        {/* ── Account items ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.length > 0 && (
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
              🎮 Valorant Accounts
            </p>
          )}
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
                  className={`relative bg-white/4 border rounded-2xl p-5 flex gap-4 transition-colors ${isUnavailable
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
                  <div className={`relative w-28 aspect-video bg-linear-to-br from-red-900/25 to-zinc-900 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${isUnavailable ? "opacity-40 grayscale" : ""
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

          {/* ── VP items ── */}
          {vpItems.length > 0 && (
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  💎 Valorant Points
                </p>
              </div>

              <AnimatePresence initial={false}>
                {vpItems.map((item) => (
                  <motion.div key={item.pkg.id} layout
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/4 border border-white/8 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0 text-2xl">
                      {item.pkg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white">
                        {item.pkg.vp.toLocaleString()} {item.pkg.label === "Battle Pass" ? "VP (Battle Pass)" : "VP"}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        ₹{item.pkg.price.toLocaleString("en-IN")} × {item.qty} ={" "}
                        <span className="text-white/60 font-medium">₹{(item.pkg.price * item.qty).toLocaleString("en-IN")}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <p className="text-lg font-extrabold text-white">
                        ₹{(item.pkg.price * item.qty).toLocaleString("en-IN")}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => removeVPItem(item.pkg.id)}
                          className="w-7 h-7 rounded-full border border-white/10 hover:border-red-500/30 flex items-center justify-center text-white/35 hover:text-red-400 transition-all">
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-bold text-white w-5 text-center">{item.qty}</span>
                        <button onClick={() => addVPItem(item.pkg)}
                          className="w-7 h-7 rounded-full border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-white/35 hover:text-emerald-400 transition-all">
                          <Plus size={11} />
                        </button>
                        <button onClick={() => removeAllVPItem(item.pkg.id)}
                          className="w-7 h-7 rounded-full border border-white/8 hover:border-red-500/30 flex items-center justify-center text-white/25 hover:text-red-400 transition-all ml-1">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <ScrollReveal direction="right" duration={0.6}>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-5">Order Summary</h3>

              <div className="flex flex-col gap-3 mb-5 text-sm">
                {hasAccounts && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Accounts ({totalItems})</span>
                    <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {hasVP && (
                  <div className="flex justify-between">
                    <span className="text-white/50">VP ({vpTotalVP.toLocaleString()} VP)</span>
                    <span className="text-white">₹{vpTotalPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/50">Delivery</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="border-t border-white/8 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-xl text-white">₹{(totalPrice + vpTotalPrice).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Riot ID — only shown when VP items are in cart */}
              {hasVP && (
                <div className="mb-4 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60">
                    Riot ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={riotId}
                    onChange={(e) => setRiotId(e.target.value)}
                    placeholder="PlayerName#TAG"
                    className="w-full bg-white/5 border border-white/10 focus:border-red-500/50 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono transition-colors"
                  />
                  <p className="text-[11px] text-white/30 leading-relaxed">
                    VP will be added to this Riot account.
                  </p>
                </div>
              )}

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
                {checking ? (
                  <button disabled className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/25 font-bold py-3.5 rounded-full cursor-not-allowed text-sm">
                    <RefreshCw size={14} className="animate-spin" />
                    Checking availability…
                  </button>
                ) : hasUnavailable ? (
                  <div className="flex flex-col gap-2">
                    <button disabled className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/25 font-bold py-3.5 rounded-full cursor-not-allowed text-sm">
                      <AlertTriangle size={14} className="text-amber-400" />
                      Checkout unavailable
                    </button>
                    <p className="text-xs text-amber-400/80 text-center leading-relaxed">
                      Remove unavailable accounts above to continue.
                    </p>
                  </div>
                ) : hasVP && !riotIdValid ? (
                  <button disabled className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/25 font-bold py-3.5 rounded-full cursor-not-allowed text-sm">
                    <MessageCircle size={14} />
                    Enter Riot ID to checkout
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${buildCombinedWhatsAppMessage()}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 text-sm"
                  >
                    <MessageCircle size={15} /> Checkout via WhatsApp
                  </a>
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
