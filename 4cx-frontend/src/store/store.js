import { combineReducers, configureStore } from "@reduxjs/toolkit";
import promptSlice from "./features/promptSlice";
import projectIdSlice from "./features/projectIdSlice";
import reactFlowSlice from "./features/reactFlowSlice";
import chatSlice from "./features/chatSlice";
import retrievalSlice from "./features/retrievalSlice";
import searchSlice from "./features/searchSlice";
import azureMenuSlice from "./features/azureMenuSlice";
import azureChatRoutesSlice from "./features/azureChatRoutesSlice";
import chatInstanceSlice from "./features/azureChatSidebar";
import activeChatThread from "./features/activeAzureChatThreadSlice";
import inputImageReducer from "./features/chatImageInputSlide";
import chatPersonaSlice from "./features/chatPersonaSlice";
import uploadReducer from "./features/fileUploadSlice";
import azurePersonaSlice from "./features/azurePersonaSlice";
import socketSlice from "./features/socketSlice";
import customizationReducer from "../pages/flowies/store/reducers/customizationReducer";
import canvasReducer from "../pages/flowies/store/reducers/canvasReducer";
import notifierReducer from "../pages/flowies/store/reducers/notifierReducer";
import dialogReducer from "../pages/flowies/store/reducers/dialogReducer";
import widgetSettingSlice from "./features/widgetSettingsSlice";
import widgetChatbotSlice from "./features/widgetChatbotSlice";
import dataSourceSlice from "./features/dataSourceSlice";
import aiPromptSlice from "./features/aiPromptSlice";

const reducers = combineReducers({
  chat: chatSlice,
  prompt: promptSlice,
  reactFlow: reactFlowSlice,
  projectIdList: projectIdSlice,
  retrieval: retrievalSlice,
  searchFlow: searchSlice,
  azureMenu: azureMenuSlice,
  azureChatRoutes: azureChatRoutesSlice,
  azurePersona: azurePersonaSlice,
  chatSidebarInstance: chatInstanceSlice,
  activeChatThread: activeChatThread,
  inputImage: inputImageReducer,
  azureChatPersona: chatPersonaSlice,
  fileUpload: uploadReducer,
  socket: socketSlice,
  customization: customizationReducer,
  canvas: canvasReducer,
  notifier: notifierReducer,
  dialog: dialogReducer,
  widgetSetting: widgetSettingSlice,
  widgetChatbotSlice: widgetChatbotSlice,
  dataSource: dataSourceSlice,
  aiPrompt: aiPromptSlice
});

export const ReduxStore = configureStore({
  reducer: reducers,
});
