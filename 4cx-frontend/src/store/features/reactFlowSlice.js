import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
  isUpdate: false,
  isVersion: false,
  reactFlowData: [],
  selectedPrompt: [],
  selectedPromptVersion: [],
  selectedPromptDescription: "",
  showOutputData: [],
  loading: false,
  version: 1,
  flowListData: [],
};

const reactFlowSlice = createSlice({
  name: "React Flow",
  initialState,
  reducers: {
    updateNodes: (state, action) => {
      state.nodes = action.payload;
    },
    updateEdges: (state, action) => {
      state.edges = action.payload;
    },
    updateVersionChanged: (state, action) => {
      state.isVersion = action.payload;
    },
    updateReactFlowData: (state, action) => {
      state.reactFlowData = action.payload;
    },
    updateSelectedPrompt: (state, action) => {
      state.selectedPrompt = action.payload;
    },
    updateSelectedPromptVersion: (state, action) => {
      state.selectedPromptVersion = action.payload;
    },
    updateSelectedPromptDescription: (state, action) => {
      state.selectedPromptDescription = action.payload;
    },
    updateFlowStatus: (state, action) => {
      state.isUpdate = action.payload;
    },
    updateShowOutputData: (state, action) => {
      state.showOutputData = action.payload;
    },
    resetReactFlowData: (state) => {
      state.selectedPrompt = [];
      state.selectedPromptVersion = [];
      state.selectedPromptDescription = [];
    },
    setReactFlowLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateReactFlowVersion: (state, action) => {
      state.version = action.payload;
    },
    setFlowListData: (state, action) => {
      state.flowListData = action.payload;
    },
    updateFlowListData: (state, action) => {
      const updatedData = action.payload;
      const index = state.flowListData.findIndex(
        (index) => index.prompt_id === updatedData.prompt_id
      );
      state.flowListData[index] = updatedData;
    },
  },
});

export const {
  updateEdges,
  updateNodes,
  setFlowListData,
  updateFlowStatus,
  resetReactFlowData,
  updateFlowListData,
  updateReactFlowData,
  updateSelectedPrompt,
  updateVersionChanged,
  updateShowOutputData,
  setReactFlowLoading,
  updateReactFlowVersion,
  updateSelectedPromptVersion,
  updateSelectedPromptDescription,
} = reactFlowSlice.actions;
export default reactFlowSlice.reducer;
