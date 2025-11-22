import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatData: [],
  outputData: [],
  apiLoading:false,
  isLoading: false,
  isEnableChat:false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      state.chatData.push({
        inputs:{
          question:action.payload
        }
      });
    },
    updateAgentData: (state, action) => {
      state.chatData.push({
        outputs:{
          answer:action.payload
        }
      });
    },
    updateChatLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateEnableChat: (state, action) => {
      state.isEnableChat = action.payload;
    },
    updateOutputData: (state, action) => {
      state.outputData = action.payload;
    },
    resetChatData: (state) => {
      state.chatData = [];
    },
    updateApiLoading:(state,action) => {
      state.apiLoading = action.payload;
    }
  },
});

export const {
  resetChatData,
  updateUserData,
  updateAgentData,
  updateOutputData,
  updateApiLoading,
  updateEnableChat,
  updateChatLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
