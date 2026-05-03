"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShopProducts } from "@/features/products/productsSlice";
import { type Rank } from "@/utils/products";
import ProductCard from "./ProductCard";
import StaggerReveal from "@/components/ui/StaggerReveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Loader2, Search, X } from "lucide-react";

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

  const [query, setQuery] = useState("");
  const [filterRank, setFilterRank] = useState<Rank | "All">("All");
  const [sort, setSort] = useState("price-asc");

  useEffect(() => {
    if (list.length === 0) dispatch(fetchShopProducts());
  }, [dispatch, list.length]);

  const filtered = useMemo(() => {
    let items = [...list];

    // Text search — matches title, rank, or any skin name
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter((p) => {
        if (p.title.toLowerCase().includes(q)) return true;
        if (p.current_rank.toLowerCase().includes(q)) return true;
        if (p.peak_rank.toLowerCase().includes(q)) return true;
        if (p.product_items?.some((s) => s.display_name.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    // Rank pill filter
    if (filterRank !== "All")
      items = items.filter((p) => p.current_rank === filterRank);

    // Sort
    if (sort === "price-asc")  items.sort((a, b) => a.discounted_price - b.discounted_price);
    if (sort === "price-desc") items.sort((a, b) => b.discounted_price - a.discounted_price);
    if (sort === "skins")      items.sort((a, b) => b.skins - a.skins);
    if (sort === "rank")
      items.sort((a, b) => RANK_OPTIONS.indexOf(b.current_rank) - RANK_OPTIONS.indexOf(a.current_rank));

    return items;
  }, [list, query, filterRank, sort]);

  const hasFilters = query !== "" || filterRank !== "All";

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

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-3">

          {/* Search + sort row */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, rank, or skin name…"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white/5 border border-white/10 text-white/65 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-white/25 ml-auto"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>
              ))}
            </select>
          </div>

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
            <p className="text-4xl mb-3">🔍</p>
            <p className="mb-3">
              {list.length === 0
                ? "No accounts available right now."
                : `No accounts match "${query || filterRank}".`}
            </p>
            {hasFilters && (
              <button
                onClick={() => { setQuery(""); setFilterRank("All"); }}
                className="text-xs text-red-400 border border-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-xl transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Result count */}
            {hasFilters && (
              <p className="text-xs text-white/30 mb-5">
                {filtered.length} account{filtered.length !== 1 ? "s" : ""} found
              </p>
            )}
            <StaggerReveal
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              stagger={0.06}
              y={24}
              duration={0.5}
            >
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggerReveal>
          </>
        )}
      </section>
    </div>
  );
}
