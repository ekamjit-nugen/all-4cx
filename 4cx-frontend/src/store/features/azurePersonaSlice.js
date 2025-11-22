import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const azurePersonaSlice = createSlice({
  name: "azurePersona",
  initialState,
  reducers: {
    updateAzurePersona: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { updateAzurePersona } = azurePersonaSlice.actions;
export default azurePersonaSlice.reducer;
