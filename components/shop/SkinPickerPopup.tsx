"use client";

import { useEffect, useState, useMemo } from "react";
import { X, Search, Check, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchValorantSkins,
  saveSelection,
  selectWeaponNames,
  selectSavedSkins,
  type SelectedSkin,
  type ValorantSkin,
} from "@/features/valorant/skinsSlice";

// ── Tier border colours ───────────────────────────────────────────────────────
const TIER: Record<string, string> = {
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": "border-yellow-400/50",  // Exclusive
  "e046854e-406c-37f4-6607-19a9ba8426fc": "border-purple-400/50",  // Ultra
  "60bca009-4182-7998-dee7-b8a2558dc369": "border-pink-400/50",    // Premium
  "12683d76-48d7-84a3-4e09-6985794f0445": "border-blue-400/50",    // Deluxe
  "411e4a55-4e59-7757-41f0-86a53f101bb5": "border-white/15",       // Select
};
const tierBorder = (uuid: string | null) =>
  uuid ? (TIER[uuid] ?? "border-white/10") : "border-white/10";

// ── Single skin card ──────────────────────────────────────────────────────────
function SkinCard({
  skin,
  selected,
  onToggle,
}: {
  skin: ValorantSkin;
  selected: boolean;
  onToggle: (s: ValorantSkin) => void;
}) {
  const icon =
    skin.displayIcon ??
    skin.levels[0]?.displayIcon ??
    skin.chromas[0]?.fullRender ??
    null;

  return (
    <button
      type="button"
      onClick={() => onToggle(skin)}
      className={`relative group flex flex-col gap-2 p-2.5 rounded-xl border transition-all duration-150 text-left w-full focus:outline-none ${
        selected
          ? "border-red-500/60 bg-red-500/8 ring-1 ring-red-500/25"
          : `${tierBorder(skin.contentTierUuid)} bg-white/3 hover:bg-white/6 hover:border-white/25`
      }`}
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center z-10">
          <Check size={9} className="text-white" strokeWidth={3} />
        </span>
      )}

      <div className="w-full aspect-2/1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
        {icon ? (
          <img
            src={icon}
            alt={skin.displayName}
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-xl opacity-15">🔫</span>
        )}
      </div>

      <p className="text-[11px] font-medium text-white/75 leading-snug line-clamp-2">
        {skin.displayName}
      </p>
    </button>
  );
}

// ── Main popup ────────────────────────────────────────────────────────────────

interface Props {
  /** Unique ID for this product — used to key saved selections in Redux */
  productId: string;
  /** Display name shown in the popup header */
  productName?: string;
  /** Called when the popup should close */
  onClose: () => void;
}

export default function SkinPickerPopup({ productId, productName, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { skins, loading, error } = useAppSelector((s) => s.skins);
  const savedSelections = useAppSelector((s) => s.skins.savedSelections);

  // Local draft — only committed to Redux on "Save"
  const [draft, setDraft] = useState<SelectedSkin[]>(
    () => selectSavedSkins(savedSelections, productId)
  );

  const [query, setQuery]           = useState("");
  const [weaponFilter, setWeaponFilter] = useState("All");

  // Fetch skins once (cached in Redux after first load)
  useEffect(() => {
    if (skins.length === 0 && !loading) {
      dispatch(fetchValorantSkins());
    }
  }, [dispatch, skins.length, loading]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const weaponNames = useMemo(() => selectWeaponNames(skins), [skins]);

  const filtered = useMemo(() => {
    let list = skins;
    if (weaponFilter !== "All") {
      list = list.filter((s) => s.weaponName === weaponFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((s) => s.displayName.toLowerCase().includes(q));
    return list;
  }, [skins, weaponFilter, query]);

  const selectedUuids = draft.map((s) => s.uuid);

  function handleToggle(skin: ValorantSkin) {
    const isSelected = selectedUuids.includes(skin.uuid);
    if (isSelected) {
      setDraft((prev) => prev.filter((s) => s.uuid !== skin.uuid));
    } else {
      setDraft((prev) => [
        ...prev,
        {
          uuid: skin.uuid,
          displayName: skin.displayName,
          displayIcon:
            skin.displayIcon ??
            skin.levels[0]?.displayIcon ??
            skin.chromas[0]?.fullRender ??
            null,
        },
      ]);
    }
  }

  function handleSave() {
    dispatch(saveSelection({ productId, skins: draft }));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-4xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-white">Select Skins</h2>
            {productName && (
              <p className="text-xs text-white/40 mt-0.5">{productName}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {draft.length > 0 && (
              <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full font-medium">
                {draft.length} selected
              </span>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="px-5 py-3 border-b border-white/8 flex flex-col sm:flex-row gap-3 shrink-0">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skins…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-9 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Gun type filter */}
          <select
            value={weaponFilter}
            onChange={(e) => setWeaponFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white/75 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all min-w-36"
          >
            {weaponNames.map((name) => (
              <option key={name} value={name} className="bg-[#1a1a1a]">
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/30">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Loading skins…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
              <p className="text-sm text-red-400">Failed to load skins</p>
              <p className="text-xs text-white/30">{error}</p>
              <button
                onClick={() => dispatch(fetchValorantSkins())}
                className="mt-2 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-white/25">
              <span className="text-3xl">🔍</span>
              <p className="text-sm">No skins found</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-white/30 mb-3">
                {filtered.length} skin{filtered.length !== 1 ? "s" : ""}
                {weaponFilter !== "All" ? ` · ${weaponFilter}` : ""}
                {query ? ` · "${query}"` : ""}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {filtered.map((skin) => (
                  <SkinCard
                    key={skin.uuid}
                    skin={skin}
                    selected={selectedUuids.includes(skin.uuid)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 border-t border-white/8 flex items-center justify-between gap-3 shrink-0">
          {/* Selected preview chips */}
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 max-h-14 overflow-y-auto">
            {draft.length === 0 ? (
              <p className="text-xs text-white/25">No skins selected</p>
            ) : (
              draft.map((s) => (
                <span
                  key={s.uuid}
                  className="flex items-center gap-1 text-[11px] bg-white/6 border border-white/10 text-white/65 px-2 py-0.5 rounded-full shrink-0"
                >
                  {/* Strip weapon prefix for brevity */}
                  {s.displayName.split(" ").slice(1).join(" ") || s.displayName}
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => prev.filter((x) => x.uuid !== s.uuid))}
                    className="text-white/30 hover:text-white/70 ml-0.5"
                  >
                    <X size={9} />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            {draft.length > 0 && (
              <button
                onClick={() => setDraft([])}
                className="text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 px-3 py-2 rounded-xl transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleSave}
              className="text-sm font-semibold text-white bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl transition-colors active:scale-95"
            >
              Save{draft.length > 0 ? ` (${draft.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
