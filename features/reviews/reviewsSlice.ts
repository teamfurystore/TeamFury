import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { ROUTE_REVIEWS_PUBLIC, ROUTE_REVIEW_SUBMIT } from "@/utils/routes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PublicReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  rank: string;
  account_bought: string;
  date: string;
  review: string;
  verified: boolean;
  platform: "WhatsApp" | "Discord" | "Instagram" | "Direct";
}

export interface ReviewSubmitPayload {
  name: string;
  rating: number;
  rank: string;
  account_bought: string;
  review: string;
  platform: string;
}

interface ReviewsState {
  list: PublicReview[];
  listLoading: boolean;
  listError: string | null;
  submitLoading: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

const initialState: ReviewsState = {
  list: [],
  listLoading: false,
  listError: null,
  submitLoading: false,
  submitError: null,
  submitSuccess: false,
};

// ── Thunks ────────────────────────────────────────────────────────────────────

/** Public — fetch only active=true reviews */
export const fetchPublicReviews = createAsyncThunk<PublicReview[]>(
  "reviews/fetchPublic",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<PublicReview[]>(ROUTE_REVIEWS_PUBLIC);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? "Failed to load reviews");
    }
  }
);

/** Public — submit a new review (lands as pending) */
export const submitReview = createAsyncThunk<void, ReviewSubmitPayload>(
  "reviews/submit",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post(ROUTE_REVIEW_SUBMIT, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? "Submission failed");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    resetSubmit(state) {
      state.submitSuccess = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPublicReviews
    builder
      .addCase(fetchPublicReviews.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchPublicReviews.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchPublicReviews.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    // submitReview
    builder
      .addCase(submitReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.submitLoading = false;
        state.submitSuccess = true;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload as string;
      });
  },
});

export const { resetSubmit } = reviewsSlice.actions;
export default reviewsSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────

export interface ComputedReviewStats {
  total: number;
  average: number;
  fivePct: number;
  fourPct: number;
  threePct: number;
  twoPct: number;
  onePct: number;
}

export function selectReviewStats(list: PublicReview[]): ComputedReviewStats {
  const total = list.length;
  if (total === 0) {
    return { total: 0, average: 0, fivePct: 0, fourPct: 0, threePct: 0, twoPct: 0, onePct: 0 };
  }

  // Coerce rating to number — Supabase REST can return numeric fields as strings
  const ratings = list.map((r) => Number(r.rating));

  const sum     = ratings.reduce((acc, r) => acc + r, 0);
  const average = Math.round((sum / total) * 10) / 10; // e.g. 2.5, 4.9

  const count = (star: number) => ratings.filter((r) => r === star).length;
  const pct   = (star: number) => Math.round((count(star) / total) * 100);

  return {
    total,
    average,
    fivePct:  pct(5),
    fourPct:  pct(4),
    threePct: pct(3),
    twoPct:   pct(2),
    onePct:   pct(1),
  };
}
