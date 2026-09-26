"use client";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SessionProvider } from "next-auth/react";
import rootReducer from "../reducers";
import { Toaster } from "react-hot-toast";

const store = configureStore({
  reducer: rootReducer,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
        <Toaster />
      </Provider>
    </SessionProvider>
  );
}
