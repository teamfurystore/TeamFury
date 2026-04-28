import { configureStore } from "@reduxjs/toolkit";
import contactsReducer from "@/features/contacts/contactsSlice";
import reviewsReducer from "@/features/reviews/reviewsSlice";
import adminReviewsReducer from "@/features/admin/adminReviewsSlice";
import productsReducer from "@/features/products/productsSlice";

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    reviews: reviewsReducer,
    adminReviews: adminReviewsReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
