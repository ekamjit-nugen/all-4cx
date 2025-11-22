import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeColor: "#033dfc",
  fontFamily: "Arial",
  fontSize: 14,
  variant: null,
};

const widgetSettingSlice = createSlice({
  name: "widgetSettings",
  initialState,
  reducers: {
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    resetSettings: () => initialState, // Reset to initial state
  },
});

export const { setThemeColor, setFontFamily, setFontSize, setVariant, resetSettings } =
  widgetSettingSlice.actions;

export default widgetSettingSlice.reducer;
