"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { RANK_COLORS } from "@/utils/products";

export default function CartClient() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return "";
    
    let message = "Hi TEAM FURY! I want to purchase the following accounts:\n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   • Rank: ${item.currentRank} (Peak: ${item.peakRank})\n`;
      message += `   • Skins: ${item.skins} | Knives: ${item.knives}\n`;
      message += `   • Price: ₹${item.discountedPrice.toLocaleString("en-IN")} x ${item.quantity}\n`;
      message += `   • Subtotal: ₹${(item.discountedPrice * item.quantity).toLocaleString("en-IN")}\n\n`;
    });
    
    message += `Total: ₹${totalPrice.toLocaleString("en-IN")} (${totalItems} item${totalItems > 1 ? 's' : ''})\n\n`;
    message += "Please confirm availability and send payment details. Thank you!";
    
    return encodeURIComponent(message);
  };

  if (items.length === 0) {
    return (
      <div className="font-sans">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in">
            <ShoppingBag size={80} className="text-white/20 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold mb-4">Your Cart is Empty</h1>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Looks like you haven't added any Valorant accounts to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-full transition-colors"
            >
              <ShoppingBag size={16} />
              Browse Accounts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group mb-6"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Shopping Cart</h1>
            <p className="text-white/50 text-sm mt-1">
              {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-white/40 hover:text-red-400 text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => {
            const itemTotal = item.discountedPrice * item.quantity;
            const discount = Math.round(
              ((item.price - item.discountedPrice) / item.price) * 100
            );

            return (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 hover:border-white/20 transition-colors animate-fade-in"
              >
                {/* Image */}
                <div className="relative w-full sm:w-32 aspect-video bg-linear-to-br from-red-900/30 to-zinc-900 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  <span className="text-3xl opacity-20">🎮</span>
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-bold text-sm hover:text-red-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs mt-1">
                      <span className="text-white/40">Current:</span>
                      <span className={`font-bold ${RANK_COLORS[item.currentRank]}`}>
                        {item.currentRank}
                      </span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/40">Peak:</span>
                      <span className={`font-bold ${RANK_COLORS[item.peakRank]}`}>
                        {item.peakRank}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-white/50 mt-1">
                      <span>🎨 {item.skins} skins</span>
                      {item.knives > 0 && <span>🔪 {item.knives} knives</span>}
                      <span>📦 Lv.{item.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-white">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-white/30">
                        ₹{item.discountedPrice.toLocaleString("en-IN")} each
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 w-8 h-8 rounded-full border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 flex items-center justify-center transition-colors group"
                    >
                      <Trash2 size={12} className="text-white/40 group-hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-extrabold mb-4">Order Summary</h3>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Items ({totalItems})</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Delivery</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-xl text-red-400">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 mb-6">
              {[
                { icon: "⚡", text: "Instant Delivery" },
                { icon: "🔒", text: "100% Secure" },
                { icon: "✅", text: "Verified Accounts" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-xs text-white/50">
                  <span>{badge.icon}</span> {badge.text}
                </div>
              ))}
            </div>

            {/* Checkout */}
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/918511037477?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-full transition-colors text-sm"
              >
                <MessageCircle size={16} />
                Checkout via WhatsApp
              </a>
              <p className="text-xs text-white/40 text-center leading-relaxed">
                You&apos;ll be redirected to WhatsApp with your order details.
                Our team will confirm availability and guide you through payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}