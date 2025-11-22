export const generateChatbotWidgetSnippet = (
  language,
  userId,
  apiKey,
  currentActiveWidgetId,
  flow_id
) => {
  const snippets = {
    react: `import React from "react";
import { ChatbotComponent } from "fourcx-widget/packages/react";

const App = () => {
  const themeConfiguration = theme_configuration_paste_here

  return (
    <ChatbotComponent
      header-title="Fourcx Chatbot"
      theme-configuration={JSON.stringify(themeConfiguration)}
      chat-bubble-color="#222641"
      height="600px"
      width="700px"
      user-id="${userId}"
      api-key="${apiKey}"
      widget-id="${currentActiveWidgetId}"
      flow-id="${flow_id}"
    />
  );
};

export default App;`,
  };

  return snippets[language] || "Language not supported.";
};

export const generateChatThemeConfigSnippet = (themeConfigObject) => {
  const snippet = `const themeConfig = {
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
  }`;

  return snippet;
};
