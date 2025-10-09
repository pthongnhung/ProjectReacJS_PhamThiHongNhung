import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import categories from "./slices/categorySlice";
import vocabs from "./slices/vocabSlice";
export const store = configureStore({
  reducer: {
    auth,
    categories,
    vocabs,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
