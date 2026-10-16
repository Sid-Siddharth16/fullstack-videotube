import { configureStore } from "@reduxjs/toolkit";
import { bindAuthListeners } from "./auth.listeners";
import authReducer from "./slices/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

bindAuthListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
