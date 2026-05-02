"use client";

import { useState, useMemo } from "react";
import { Check, Search, X, ChevronDown } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ValorantSkinLevel {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
}

export interface ValorantSkinChroma {
  uuid: string;
  displayName: string;
  fullRender: string | null;
  swatch: string | null;
}

export interface ValorantSkin {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  contentTierUuid: string | null;
  chromas: ValorantSkinChroma[];
  levels: ValorantSkinLevel[];
}

export interface SelectedSkin {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
}

// ── Tier color map (Valorant content tiers) ───────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": "border-yellow-400/60 bg-yellow-400/5",   // Exclusive
  "e046854e-406c-37f4-6607-19a9ba8426fc": "border-purple-400/60 bg-purple-400/5",   // Ultra
  "60bca009-4182-7998-dee7-b8a2558dc369": "border-pink-400/60 bg-pink-400/5",        // Premium
  "12683d76-48d7-84a3-4e09-6985794f0445": "border-blue-400/60 bg-blue-400/5",        // Deluxe
  "411e4a55-4e59-7757-41f0-86a53f101bb5": "border-white/20 bg-white/3",              // Select
};

function tierBorder(uuid: string | null) {
  if (!uuid) return "border-white/10 bg-white/3";
  return TIER_COLORS[uuid] ?? "border-white/10 bg-white/3";
}

// ── Sub-component: single skin card ──────────────────────────────────────────

function SkinCard({
  skin,
  selected,
  onToggle,
}: {
  skin: ValorantSkin;
  selected: boolean;
  onToggle: (skin: ValorantSkin) => void;
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
      className={`relative group flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 text-left w-full
        ${selected
          ? "border-red-500/60 bg-red-500/8 ring-1 ring-red-500/30"
          : `${tierBorder(skin.contentTierUuid)} hover:border-white/25 hover:bg-white/5`
        }`}
    >
      {/* Selected checkmark */}
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center z-10">
          <Check size={11} className="text-white" strokeWidth={3} />
        </span>
      )}

      {/* Skin image */}
      <div className="w-full aspect-2/1 rounded-lg overflow-hidden bg-white/4 flex items-center justify-center">
        {icon ? (
          <img
            src={icon}
            alt={skin.displayName}
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-2xl opacity-20">🔫</span>
        )}
      </div>

      {/* Name */}
      <p className="text-xs font-medium text-white/80 leading-snug line-clamp-2">
        {skin.displayName}
      </p>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface SkinPickerProps {
  /** Full list of skins from the Valorant API */
  skins: ValorantSkin[];
  /** Currently selected skin UUIDs */
  selectedUuids: string[];
  /** Called whenever selection changes */
  onChange: (selected: SelectedSkin[]) => void;
  /** Max number of skins that can be selected (optional) */
  maxSelect?: number;
  /** Label shown above the picker */
  label?: string;
}

export default function SkinPicker({
  skins,
  selectedUuids,
  onChange,
  maxSelect,
  label = "Select Skins",
}: SkinPickerProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(true);

  // Filter by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skins;
    return skins.filter((s) => s.displayName.toLowerCase().includes(q));
  }, [skins, query]);

  function handleToggle(skin: ValorantSkin) {
    const isSelected = selectedUuids.includes(skin.uuid);

    let next: string[];
    if (isSelected) {
      next = selectedUuids.filter((id) => id !== skin.uuid);
    } else {
      if (maxSelect && selectedUuids.length >= maxSelect) return; // cap reached
      next = [...selectedUuids, skin.uuid];
    }

    // Build SelectedSkin objects for the parent
    const selected: SelectedSkin[] = next.map((uuid) => {
      const found = skins.find((s) => s.uuid === uuid)!;
      return {
        uuid: found.uuid,
        displayName: found.displayName,
        displayIcon:
          found.displayIcon ??
          found.levels[0]?.displayIcon ??
          found.chromas[0]?.fullRender ??
          null,
      };
    });

    onChange(selected);
  }

  function clearAll() {
    onChange([]);
  }

  const selectedCount = selectedUuids.length;

  return (
    <div className="flex flex-col gap-3">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-white/60">{label}</label>
          {selectedCount > 0 && (
            <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-medium">
              {selectedCount}{maxSelect ? `/${maxSelect}` : ""} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-white/30 hover:text-white/70 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <ChevronDown
              size={16}
              className="transition-transform duration-200"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </div>

      {/* Selected chips preview (always visible) */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedUuids.map((uuid) => {
            const skin = skins.find((s) => s.uuid === uuid);
            if (!skin) return null;
            return (
              <span
                key={uuid}
                className="flex items-center gap-1.5 text-xs bg-white/6 border border-white/10 text-white/70 px-2.5 py-1 rounded-full"
              >
                {skin.displayName.replace(/^.+? /, "")}
                <button
                  type="button"
                  onClick={() => handleToggle(skin)}
                  className="text-white/30 hover:text-white/80 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Expandable picker */}
      {expanded && (
        <div className="flex flex-col gap-3 bg-white/3 border border-white/8 rounded-2xl p-4">

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skins…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Count */}
          <p className="text-xs text-white/30">
            {filtered.length} skin{filtered.length !== 1 ? "s" : ""}
            {query ? ` matching "${query}"` : ""}
            {maxSelect ? ` · max ${maxSelect}` : ""}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-white/25 text-sm">
              No skins found
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {filtered.map((skin) => (
                <SkinCard
                  key={skin.uuid}
                  skin={skin}
                  selected={selectedUuids.includes(skin.uuid)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
