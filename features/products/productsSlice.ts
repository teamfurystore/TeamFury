import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CURD_FURY_PRODUCT = `${process.env.NEXT_PUBLIC_FURY_API_BASE_URL || ""}/api/products`;

export interface FaqDetail {
  domainName: string;
  subDomainName: string;
}

interface FaqState {
  faqDetailData: null;
  loading: boolean;
  errMessage: string | undefined;
  selectedData?: any;
}

const initialState: FaqState = {
  faqDetailData: null,
  loading: false,
  errMessage: undefined,
  selectedData: null,
};

export const faqDetails = createAsyncThunk<any, FaqDetail>("Faq/faqDetails", async (params: FaqDetail) => {
  const response = await axios.get(`${CURD_FURY_PRODUCT}`, {
    params,
    withCredentials: true,
  });
  return response.data;
});

const productsSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    setSelectedData(state, action) {
      state.selectedData = action.payload;
    },
    clearSelectedData(state) {
    state.selectedData = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(faqDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(faqDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.faqDetailData = action.payload;
      })
      .addCase(faqDetails.rejected, (state, action) => {
        state.loading = false;
        state.errMessage = action.payload instanceof Error ? action.payload.message : String(action.payload);
      });
  },
});

export const { setSelectedData ,clearSelectedData } = productsSlice.actions;
export default productsSlice.reducer;
