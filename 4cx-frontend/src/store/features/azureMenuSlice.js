import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMenuOpen: true,
};

const azureMenuSlice = createSlice({
  name: "azureMenu",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { toggleMenu } = azureMenuSlice.actions;
export default azureMenuSlice.reducer;
