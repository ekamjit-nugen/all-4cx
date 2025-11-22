import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRoute: 0,
  currentChatRoute: 0,
  flowiseId:""
};

const azureRoutesSlice = createSlice({
  name: "azureRoutes",
  initialState,
  reducers: {
    setRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    setChatRoute: (state, action) => {
      state.currentChatRoute = action.payload;
    },
    setFlowiseId: (state, action) => {
      state.flowiseId = action.payload;
    },
  },
});

export const { setRoute, setChatRoute, setFlowiseId } = azureRoutesSlice.actions;
export default azureRoutesSlice.reducer;
