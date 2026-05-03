import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import {
  ROUTE_VALORANT_SKINS,
  ROUTE_VALORANT_WEAPONS,
  ROUTE_ADMIN_PRODUCT_SKINS,
} from "@/utils/routes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SkinLevel {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
}

export interface SkinChroma {
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
  themeUuid: string | null;
  chromas: SkinChroma[];
  levels: SkinLevel[];
  /** Derived from the weapon that owns this skin — populated after fetch */
  weaponName?: string;
}

export interface ValorantWeapon {
  uuid: string;
  displayName: string;
  category: string;
}

export interface SelectedSkin {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
}

interface SkinsState {
  skins: ValorantSkin[];
  weapons: ValorantWeapon[];
  loading: boolean;
  error: string | null;
  /** Per-product saved selections: productId → SelectedSkin[] */
  savedSelections: Record<string, SelectedSkin[]>;
  /** Product id currently being saved to DB */
  savingProductId: string | null;
  saveError: string | null;
}

const initialState: SkinsState = {
  skins: [],
  weapons: [],
  loading: false,
  error: null,
  savedSelections: {},
  savingProductId: null,
  saveError: null,
};

// ── Thunks ────────────────────────────────────────────────────────────────────

/**
 * Fetches all weapon skins AND the weapons list in parallel.
 * Attaches weaponName to each skin so the popup can filter by gun type.
 */
export const fetchValorantSkins = createAsyncThunk<
  { skins: ValorantSkin[]; weapons: ValorantWeapon[] },
  void,
  { rejectValue: string }
>("skins/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [skinsRes, weaponsRes] = await Promise.all([
      axios.get<{ data: ValorantSkin[] }>(ROUTE_VALORANT_SKINS),
      axios.get<{
        data: Array<{
          uuid: string;
          displayName: string;
          category: string;
          skins: Array<{ uuid: string }>;
        }>;
      }>(ROUTE_VALORANT_WEAPONS),
    ]);

    const weapons: ValorantWeapon[] = weaponsRes.data.data.map((w) => ({
      uuid: w.uuid,
      displayName: w.displayName,
      category: w.category,
    }));

    const skinToWeapon: Record<string, string> = {};
    weaponsRes.data.data.forEach((weapon) => {
      weapon.skins.forEach((s) => {
        skinToWeapon[s.uuid] = weapon.displayName;
      });
    });

    const skins: ValorantSkin[] = skinsRes.data.data.map((skin) => ({
      ...skin,
      weaponName: skinToWeapon[skin.uuid] ?? "Unknown",
    }));

    return { skins, weapons };
  } catch (err: unknown) {
    const msg = axios.isAxiosError(err)
      ? err.response?.data?.message ?? err.message
      : "Failed to fetch skins";
    return rejectWithValue(msg);
  }
});

// ── Thunk: persist skin selection to the DB ───────────────────────────────────

export interface ProductSkinsPayload {
  /** The product UUID — maps to parent_product_id in the DB */
  parent_id: string;
  skins: Array<{
    uuid: string;
    display_name: string;
    display_icon: string | null;
  }>;
}

/**
 * Saves the selected skins for a product to the database.
 * Calls PUT /api/products/skins which atomically replaces all skins
 * for the product (delete existing + insert new) in a single request.
 */
export const saveProductSkins = createAsyncThunk<
  ProductSkinsPayload,
  ProductSkinsPayload
>("skins/saveProductSkins", async (payload, { rejectWithValue }) => {
  try {
    await axiosInstance.put(ROUTE_ADMIN_PRODUCT_SKINS, {
      parent_product_id: payload.parent_id,
      items: payload.skins.map((s) => ({
        skin_id: s.uuid,
        display_name: s.display_name,
        display_icon: s.display_icon,
      })),
    });
    return payload;
  } catch (err: unknown) {
    const msg = axios.isAxiosError(err)
      ? err.response?.data?.error ?? err.message
      : "Failed to save skins";
    return rejectWithValue(msg);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const skinsSlice = createSlice({
  name: "skins",
  initialState,
  reducers: {
    /**
     * Save the selected skins for a specific product in local Redux state.
     * payload: { productId: string; skins: SelectedSkin[] }
     */
    saveSelection(
      state,
      action: { payload: { productId: string; skins: SelectedSkin[] } }
    ) {
      state.savedSelections[action.payload.productId] = action.payload.skins;
    },

    /** Clear the selection for a specific product */
    clearSelection(state, action: { payload: string }) {
      delete state.savedSelections[action.payload];
    },

    /**
     * Seed savedSelections from DB data (called after loading products).
     * payload: Record<productId, SelectedSkin[]>
     */
    seedSelections(
      state,
      action: { payload: Record<string, SelectedSkin[]> }
    ) {
      // Merge — don't overwrite entries that were already modified locally
      Object.entries(action.payload).forEach(([id, skins]) => {
        if (!state.savedSelections[id]) {
          state.savedSelections[id] = skins;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchValorantSkins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchValorantSkins.fulfilled, (state, action) => {
        state.loading = false;
        state.skins = action.payload.skins;
        state.weapons = action.payload.weapons;
      })
      .addCase(fetchValorantSkins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });

    builder
      .addCase(saveProductSkins.pending, (state, action) => {
        state.savingProductId = action.meta.arg.parent_id;
        state.saveError = null;
      })
      .addCase(saveProductSkins.fulfilled, (state, action) => {
        state.savingProductId = null;
        // Mirror the saved skins into local Redux state
        state.savedSelections[action.payload.parent_id] = action.payload.skins.map(
          (s) => ({
            uuid: s.uuid,
            displayName: s.display_name,
            displayIcon: s.display_icon,
          })
        );
      })
      .addCase(saveProductSkins.rejected, (state, action) => {
        state.savingProductId = null;
        state.saveError = action.payload as string;
      });
  },
});

export const { saveSelection, clearSelection, seedSelections } = skinsSlice.actions;
export default skinsSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Unique weapon names sorted alphabetically — used for the gun-type filter */
export function selectWeaponNames(skins: ValorantSkin[]): string[] {
  const names = new Set(skins.map((s) => s.weaponName ?? "Unknown"));
  return ["All", ...Array.from(names).filter((n) => n !== "Unknown").sort()];
}

/** Get saved selection for a product, defaulting to [] */
export function selectSavedSkins(
  savedSelections: Record<string, SelectedSkin[]>,
  productId: string
): SelectedSkin[] {
  return savedSelections[productId] ?? [];
}
