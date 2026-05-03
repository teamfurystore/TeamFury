import { configureStore } from "@reduxjs/toolkit";
import contactsReducer from "@/features/contacts/contactsSlice";
import reviewsReducer from "@/features/reviews/reviewsSlice";
import adminReviewsReducer from "@/features/admin/adminReviewsSlice";
import adminProductsReducer from "@/features/admin/adminProductsSlice";
import productsReducer from "@/features/products/productsSlice";
import skinsReducer from "@/features/valorant/skinsSlice";

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    reviews: reviewsReducer,
    adminReviews: adminReviewsReducer,
    adminProducts: adminProductsReducer,
    products: productsReducer,
    skins: skinsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
