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
