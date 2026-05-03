import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ROUTE_SHOP_PRODUCTS } from "@/utils/routes";
import { type Rank } from "@/utils/products";

// ── DB product shape (snake_case, matches Supabase) ───────────────────────────

export interface DbProductItem {
  id: string;
  skin_id: string;
  display_name: string;
  display_icon: string | null;
}

export interface DbProduct {
  id: string;
  slug: string;
  title: string;
  image: string;
  profile_url: string;
  price: number;
  discounted_price: number;
  badge: string | null;
  current_rank: Rank;
  peak_rank: Rank;
  skins: number;
  knives: number;
  battle_passes: number;
  region: string;
  level: number;
  verified: boolean;
  instant_delivery: boolean;
  description: string;
  created_at: string;
  /** Skins saved in product_items — embedded by the API */
  product_items: DbProductItem[];
}

// ── State ─────────────────────────────────────────────────────────────────────

interface ProductsState {
  list: DbProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  list: [],
  loading: false,
  error: null,
};

// ── Thunk ─────────────────────────────────────────────────────────────────────

export const fetchShopProducts = createAsyncThunk<
  DbProduct[],
  void,
  { rejectValue: string }
>("products/fetchShop", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ success: boolean; data: DbProduct[] }>(
      ROUTE_SHOP_PRODUCTS
    );
    return data.data;
  } catch (err: unknown) {
    const msg = axios.isAxiosError(err)
      ? err.response?.data?.error ?? err.message
      : "Failed to load products";
    return rejectWithValue(msg);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default productsSlice.reducer;
