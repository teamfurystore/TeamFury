"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, Rank } from "@/utils/products";
import { useCart } from "@/contexts/CartContext";
import ShopGrid from "./ShopGrid";

const RANK_OPTIONS: Rank[] = [
  "Iron","Bronze","Silver","Gold","Platinum",
  "Diamond","Ascendant","Immortal","Radiant",
];

const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Skins",         value: "skins"      },
  { label: "Highest Rank",       value: "rank"       },
];

const RELATED_IDS = ["p3", "p1", "p5", "p7"];

export default function ShopClient() {
  const { addToCart } = useCart();
  const [filterRank, setFilterRank] = useState<Rank | "All">("All");
  const [sort, setSort] = useState("price-asc");

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (filterRank !== "All") list = list.filter((p) => p.currentRank === filterRank);
    if (sort === "price-asc")  list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sort === "price-desc") list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    if (sort === "skins")      list.sort((a, b) => b.skins - a.skins);
    if (sort === "rank")       list.sort((a, b) => RANK_OPTIONS.indexOf(b.currentRank) - RANK_OPTIONS.indexOf(a.currentRank));
    return list;
  }, [filterRank, sort]);

  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="text-center py-16 px-6 max-w-3xl mx-auto">
        <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">TEAM FURY</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Premium <span className="text-red-500">Valorant</span> Accounts
        </h1>
        <p className="text-white/50 text-base">Verified accounts · Instant delivery · Best prices in India</p>
      </section>

      {/* Filters bar */}
      <div className="sticky top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRank("All")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filterRank === "All" ? "bg-red-600 border-red-600 text-white" : "border-white/15 text-white/50 hover:text-white hover:border-white/30"}`}
            >
              All Ranks
            </button>
            {RANK_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setFilterRank(r)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filterRank === r ? "bg-red-600 border-red-600 text-white" : "border-white/15 text-white/50 hover:text-white hover:border-white/30"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white/70 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500/50"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">😔</p>
            <p>No accounts found for this rank. Try a different filter.</p>
          </div>
        ) : (
          <ShopGrid productIds={filtered.map((p) => p.id)} onAddToCart={addToCart} />
        )}
      </section>

      {/* You May Also Like */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-extrabold mb-6">You May Also Like</h2>
        <ShopGrid productIds={RELATED_IDS} onAddToCart={addToCart} />
      </section>
    </div>
  );
}
