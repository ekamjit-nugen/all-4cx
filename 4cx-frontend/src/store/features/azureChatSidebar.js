// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [], // Array of chat instances
};

const chatInstanceSlice = createSlice({
  name: "chatInstance",
  initialState,
  reducers: {
    // Add a new chat to the chat array
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    // Update an existing chat by its id
    updateChat: (state, action) => {
      const { id, updatedChat } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === id);
      if (chatIndex >= 0) {
        state.chats[chatIndex] = updatedChat;
      }
    },
    // Remove a chat by its id
    removeChat: (state, action) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },
    // Set the entire chat array (useful for initializing from an API or localStorage)
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    resetChats: (state) => {
      state.chats = [];
    },
  },
});

// Export actions for dispatching
export const { addChat, updateChat, removeChat, setChats, resetChats } = chatInstanceSlice.actions;

// Export the reducer to be used in the store
export default chatInstanceSlice.reducer;
