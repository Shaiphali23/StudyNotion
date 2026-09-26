import { createSlice } from "@reduxjs/toolkit";

function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("token");
    if (!raw) return null;
    // login() stores via JSON.stringify; tolerate plain strings too
    return raw.startsWith('"') ? JSON.parse(raw) : raw;
  } catch {
    return window.localStorage.getItem("token");
  }
}

const initialState = {
  signUpData: null,
  loading: false,
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignUpData(state, action) {
      state.signUpData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setSignUpData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
