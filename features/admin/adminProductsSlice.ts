import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { ROUTE_ADMIN_PRODUCT_TOGGLE } from "@/utils/routes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  slug: string;
  title: string;
  image: string;
  profile_url: string;
  price: number;
  discounted_price: number;
  badge: string | null;
  current_rank: string;
  peak_rank: string;
  skins: number;
  knives: number;
  battle_passes: number;
  region: string;
  level: number;
  verified: boolean;
  instant_delivery: boolean;
  active: boolean;
  description: string;
  created_at: string;
}

interface AdminProductsState {
  togglingId: string | null;
  toggleError: string | null;
}

const initialState: AdminProductsState = {
  togglingId: null,
  toggleError: null,
};

// ── Helper ────────────────────────────────────────────────────────────────────
function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response;
    return res?.data?.error ?? fallback;
  }
  return fallback;
}

// ── Thunks ────────────────────────────────────────────────────────────────────

/**
 * Toggle the active (is_active) flag on a product.
 * Sends { id, is_active: currentValue } — the API flips it server-side.
 * Returns the product id so the caller can do an optimistic update.
 */
export const toggleProductActive = createAsyncThunk<
  string,                              // fulfilled: returns the product id
  { id: string; currentActive: boolean } // arg
>(
  "adminProducts/toggleActive",
  async ({ id, currentActive }, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(
        ROUTE_ADMIN_PRODUCT_TOGGLE,
        { id, is_active: currentActive },
        { headers: { "Content-Type": "application/json" } }
      );
      return id;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to toggle product"));
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    clearToggleError(state) {
      state.toggleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleProductActive.pending, (state, action) => {
        state.togglingId = action.meta.arg.id;
        state.toggleError = null;
      })
      .addCase(toggleProductActive.fulfilled, (state) => {
        state.togglingId = null;
      })
      .addCase(toggleProductActive.rejected, (state, action) => {
        state.togglingId = null;
        state.toggleError = action.payload as string;
      });
  },
});

export const { clearToggleError } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;
