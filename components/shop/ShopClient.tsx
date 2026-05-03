"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShopProducts, type DbProduct } from "@/features/products/productsSlice";
import { type Rank, RANK_COLORS } from "@/utils/products";
import ProductCard from "./ProductCard";
import StaggerReveal from "@/components/ui/StaggerReveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Loader2 } from "lucide-react";

const RANK_OPTIONS: Rank[] = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum",
  "Diamond", "Ascendant", "Immortal", "Radiant",
];

const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Skins",         value: "skins"      },
  { label: "Highest Rank",       value: "rank"       },
];

export default function ShopClient() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.products);

  const [filterRank, setFilterRank] = useState<Rank | "All">("All");
  const [sort, setSort] = useState("price-asc");

  // Fetch once on mount
  useEffect(() => {
    if (list.length === 0) dispatch(fetchShopProducts());
  }, [dispatch, list.length]);

  const filtered = useMemo(() => {
    let items = [...list];
    if (filterRank !== "All")
      items = items.filter((p) => p.current_rank === filterRank);
    if (sort === "price-asc")  items.sort((a, b) => a.discounted_price - b.discounted_price);
    if (sort === "price-desc") items.sort((a, b) => b.discounted_price - a.discounted_price);
    if (sort === "skins")      items.sort((a, b) => b.skins - a.skins);
    if (sort === "rank")
      items.sort((a, b) => RANK_OPTIONS.indexOf(b.current_rank) - RANK_OPTIONS.indexOf(a.current_rank));
    return items;
  }, [list, filterRank, sort]);

  return (
    <div className="font-sans">

      {/* Hero */}
      <section className="text-center py-16 px-6 max-w-3xl mx-auto">
        <ScrollReveal direction="up" duration={0.6}>
          <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">TEAM FURY</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Premium <span className="text-red-500">Valorant</span> Accounts
          </h1>
          <p className="text-white/45 text-base">
            Verified accounts · Instant delivery · Best prices in India
          </p>
        </ScrollReveal>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRank("All")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filterRank === "All"
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-white/12 text-white/45 hover:text-white hover:border-white/25"
              }`}
            >
              All Ranks
            </button>
            {RANK_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setFilterRank(r)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  filterRank === r
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-white/12 text-white/45 hover:text-white hover:border-white/25"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white/65 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-white/25"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/30">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm">Loading accounts…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-4xl">⚠️</p>
            <p className="text-white/60 text-sm">{error}</p>
            <button
              onClick={() => dispatch(fetchShopProducts())}
              className="text-xs text-red-400 border border-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">😔</p>
            <p>{list.length === 0 ? "No accounts available right now." : "No accounts found for this rank."}</p>
          </div>
        ) : (
          <StaggerReveal
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            stagger={0.08}
            y={30}
            duration={0.6}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerReveal>
        )}
      </section>
    </div>
  );
}
