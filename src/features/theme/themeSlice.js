import { createSlice } from "@reduxjs/toolkit";

import { THEME_STORAGE_KEY } from "../../utils/storage";

const getInitialTheme = () => localStorage.getItem(THEME_STORAGE_KEY) || "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "system" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, state.mode);
    },
    applyTheme(state, action) {
      state.mode = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, state.mode);
    },
  },
});

export const { applyTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
