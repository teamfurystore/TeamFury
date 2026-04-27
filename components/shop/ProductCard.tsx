import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Product, RANK_COLORS } from "@/utils/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-500/10 flex flex-col animate-fade-in">
      {/* Image */}
      <div className="relative aspect-video bg-linear-to-br from-red-900/30 to-zinc-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <span className="text-5xl opacity-20">🎮</span>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.badge && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest">
              {product.badge}
            </span>
          )}
          {product.instantDelivery && (
            <span className="bg-green-600/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
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
        <h3 className="font-bold text-sm leading-snug">{product.title}</h3>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/40">Current:</span>
          <span className={`font-bold ${RANK_COLORS[product.currentRank]}`}>{product.currentRank}</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">Peak:</span>
          <span className={`font-bold ${RANK_COLORS[product.peakRank]}`}>{product.peakRank}</span>
        </div>

        <div className="flex gap-3 text-xs text-white/50">
          <span>🎨 {product.skins} skins</span>
          {product.knives > 0 && <span>🔪 {product.knives} knives</span>}
          <span>📦 Lv.{product.level}</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-extrabold text-white">
            ₹{product.discountedPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-white/30 line-through">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex gap-2 mt-1">
          <Link
            href={`/shop/${product.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-white/15 hover:border-white/40 text-white/70 hover:text-white text-xs font-semibold py-2.5 rounded-full transition-all"
          >
            <Eye size={13} /> Details
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-semibold py-2.5 rounded-full transition-all"
          >
            <ShoppingCart size={13} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
