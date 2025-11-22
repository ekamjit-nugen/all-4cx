import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const activeChatThreadSlice = createSlice({
  name: "chatThreadInstance",
  initialState,
  reducers: {
    setActiveChatThread: (state, action) => {
      state.activeChatThread = action.payload;
    },
  },
});

export const { setActiveChatThread } = activeChatThreadSlice.actions;
export default activeChatThreadSlice.reducer;
