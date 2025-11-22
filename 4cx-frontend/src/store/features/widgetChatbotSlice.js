import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  "header-component": {
    "backgroundColor": "#e3e9f8",
    "textColor": "#1b1818",
    "fontFamily": "Arial",
    "fontSize": "28px"
  },
  "avatar-component": {
    "backgroundColor": "#000000",
    "textColor": "#ffffff"
  },
  "message-container-component": {
    "backgroundColor": "#ffffff",
    "textColor": "#070011",
    "fontFamily": "Arial",
    "fontSize": "18px"
  },
  "bot-message-container": {
    "backgroundColor": "#fefefe",
    "textColor": "#100f0f",
    "fontFamily": "Arial",
    "fontSize": "18px"
  },
  "send-button-component": {
    "backgroundColor": "#f99a8b"
  }
};

const widgetChatbotSlice = createSlice({
  name: "chatbotTheme",
  initialState,
  reducers: {
    updateComponentConfig: (state, action) => {
      const { component, config } = action.payload;
      if (state[component]) {
        state[component] = { ...state[component], ...config };
      }
    },
    resetComponentConfig: (state, action) => {
      const { component } = action.payload;
      if (state[component]) {
        state[component] = initialState[component];
      }
    },
    resetAllConfigs: () => initialState,
  },
});

export const { updateComponentConfig, resetComponentConfig, resetAllConfigs } =
  widgetChatbotSlice.actions;

export default widgetChatbotSlice.reducer;
