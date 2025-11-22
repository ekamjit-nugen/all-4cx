import { createSlice } from "@reduxjs/toolkit";
import { initialPromptProjectDataAi } from "pages/prompts/prompt-flow/const";

const initialState = {
  data: initialPromptProjectDataAi,
  flowData: [],
  version: 1,
  promptId: "",
  isEdit: false,
  loading: false,
  flowName:"",
  flowVersion:1,
  flowiseId:"",
  flowisePage:0
};

const aiPromptSlice = createSlice({
  name: "aiPrompt",
  initialState,
  reducers: {
    updateAiPromptId: (state, action) => {
      state.promptId = action.payload;
    },
    updateEditAiPromptData: (state, action) => {
      state.data = action.payload;
    },
    updateEditAiPromptStatus: (state, action) => {
      state.isEdit = action.payload;
    },
    updateVersionAiPrompt: (state, action) => {
      state.version = action.payload;
    },
    updateFlowVersionAiPrompt: (state,action)=>{
      state.flowVersion = action.payload;
    },
    updateFlowNameAiPrompt: (state, action) => {
      state.flowName = action.payload;
    },
    setPromptLoadingAiPrompt: (state, action) => {
      state.loading = action.payload;
    },
    updateAiPromptData: (state, action) => {
      const updatedData = action.payload;
      const index = state.data.findIndex((index) => index._id === updatedData._id);
      state.data[index] = updatedData;
    },
    updateFlowiseId:(state, action)=>{
      state.flowiseId = action.payload
    },
    updateFlowisePage:(state,action)=>{
      state.flowisePage = action.payload
    },

    updateAiPromptFlowData: (state, action) => {
      return {
        ...state,
        flowData: {
          edges: action.payload.edges || state.flowData.edges || [],
          nodes: action.payload.nodes || state.flowData.nodes || [],
          prompt_id: action.payload.prompt_id || state?.flowData?.prompt_id,
          version: action.payload.version || state?.flowData?.version,
        },
      };
    },
  },
});

export const {
  updateVersionAiPrompt,
  updateAiPromptFlowData,
  updateAiPromptId,
  updateAiPromptData,
  setPromptLoadingAiPrompt,
  updateEditAiPromptData,
  updateEditAiPromptStatus,
  updateFlowNameAiPrompt,
  updateFlowVersionAiPrompt,
  updateFlowiseId
} = aiPromptSlice.actions;

export default aiPromptSlice.reducer;
