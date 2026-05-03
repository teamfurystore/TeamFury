import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import {
  ROUTE_ADMIN_REVIEWS,
  ROUTE_ADMIN_REVIEW,
} from "@/utils/routes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  rank: string;
  account_bought: string;
  date: string;
  review: string;
  verified: boolean;
  active: boolean;
  platform: string;
  created_at: string;
}

export type ReviewFormPayload = Omit<AdminReview, "id" | "created_at">;

interface AdminReviewsState {
  list: AdminReview[];
  loading: boolean;
  error: string | null;
  savingId: string | null;   // "new" when adding, id when editing
  deletingId: string | null;
  togglingId: string | null;
}

const initialState: AdminReviewsState = {
  list: [],
  loading: false,
  error: null,
  savingId: null,
  deletingId: null,
  togglingId: null,
};

// ── Helper — extract error message from axios error ───────────────────────────
function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response;
    return res?.data?.error ?? fallback;
  }
  return fallback;
}

// ── Thunks ────────────────────────────────────────────────────────────────────

/** Fetch ALL reviews (active + pending) */
export const fetchAdminReviews = createAsyncThunk<AdminReview[]>(
  "adminReviews/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<AdminReview[]>(ROUTE_ADMIN_REVIEWS);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to load reviews"));
    }
  }
);

/** Add a new review via the admin POST endpoint (respects active flag) */
export const addAdminReview = createAsyncThunk<AdminReview, ReviewFormPayload>(
  "adminReviews/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<{ success: boolean; data: AdminReview }>(
        ROUTE_ADMIN_REVIEWS,
        payload
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to add review"));
    }
  }
);

/** Update any fields on a review — used for toggle active AND full edits */
export const updateAdminReview = createAsyncThunk<
  AdminReview,
  { id: string; payload: Partial<ReviewFormPayload> }
>(
  "adminReviews/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch<{ success: boolean; data: AdminReview }>(
        ROUTE_ADMIN_REVIEW(id),
        payload
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update review"));
    }
  }
);

/** Hard delete a review */
export const deleteAdminReview = createAsyncThunk<string, string>(
  "adminReviews/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ROUTE_ADMIN_REVIEW(id));
      return id;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to delete review"));
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const adminReviewsSlice = createSlice({
  name: "adminReviews",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    /** Flip active immediately in UI — revert if the PATCH fails */
    optimisticToggle(state, action: { payload: string }) {
      const r = state.list.find((r) => r.id === action.payload);
      if (r) r.active = !r.active;
    },
    revertToggle(state, action: { payload: { id: string; original: boolean } }) {
      const r = state.list.find((r) => r.id === action.payload.id);
      if (r) r.active = action.payload.original;
    },
  },
  extraReducers: (builder) => {

    // ── fetchAdminReviews ────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── addAdminReview ───────────────────────────────────────────────────────
    builder
      .addCase(addAdminReview.pending, (state) => {
        state.savingId = "new";
        state.error = null;
      })
      .addCase(addAdminReview.fulfilled, (state, action) => {
        state.savingId = null;
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(addAdminReview.rejected, (state, action) => {
        state.savingId = null;
        state.error = action.payload as string;
      });

    // ── updateAdminReview ────────────────────────────────────────────────────
    builder
      .addCase(updateAdminReview.pending, (state, action) => {
        state.savingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(updateAdminReview.fulfilled, (state, action) => {
        state.savingId = null;
        state.togglingId = null;
        const idx = state.list.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateAdminReview.rejected, (state, action) => {
        state.savingId = null;
        state.togglingId = null;
        state.error = action.payload as string;
      });

    // ── deleteAdminReview ────────────────────────────────────────────────────
    builder
      .addCase(deleteAdminReview.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        // Optimistic remove
        state.list = state.list.filter((r) => r.id !== action.meta.arg);
      })
      .addCase(deleteAdminReview.fulfilled, (state) => {
        state.deletingId = null;
      })
      .addCase(deleteAdminReview.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload as string;
        // Note: on delete failure, re-fetch to restore the removed item
      });
  },
});

export const { clearError, optimisticToggle, revertToggle } = adminReviewsSlice.actions;
export default adminReviewsSlice.reducer;
