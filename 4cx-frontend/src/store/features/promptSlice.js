import { createSlice } from "@reduxjs/toolkit";
import { initialPromptProjectData } from "pages/prompts/prompt-flow/const";

const initialState = {
  data: initialPromptProjectData,
  flowData: [],
  version: 1,
  promptId: "",
  isEdit: false,
  loading: false,
  flowName:"",
  flowVersion:1
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    updatePromptId: (state, action) => {
      state.promptId = action.payload;
    },
    updateEditPromptData: (state, action) => {
      state.data = action.payload;
    },
    updateEditPromptStatus: (state, action) => {
      state.isEdit = action.payload;
    },
    updateVersion: (state, action) => {
      state.version = action.payload;
    },
    updateFlowVersion: (state,action)=>{
      state.flowVersion = action.payload;
    },
    updateFlowName: (state, action) => {
      state.flowName = action.payload;
    },
    setPromptLoading: (state, action) => {
      state.loading = action.payload;
    },
    updatePromptData: (state, action) => {
      const updatedData = action.payload;
      const index = state.data.findIndex((index) => index.prompt_id === updatedData.prompt_id);
      state.data[index] = updatedData;
    },

    updateFlowData: (state, action) => {
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
  updateVersion,
  updateFlowData,
  updatePromptId,
  updatePromptData,
  setPromptLoading,
  updateEditPromptData,
  updateEditPromptStatus,
  updateFlowName,
  updateFlowVersion
} = promptSlice.actions;

export default promptSlice.reducer;
