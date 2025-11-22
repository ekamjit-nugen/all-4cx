import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  retrievalFlowsJson: {
    select_columns: {
      data: null,
      status: false,
    },
    apply_filter: {
      data: null,
      status: false,
    },
    choose_retrieval_strategy: {
      status: false,
    },
  },
  name: "",
  isLoading: true,
  drop_down_value: { id: 0, label: "No Option", value: "No Option" },
  process: 0,
  unSaveChanges: false,
  callHandleSave: false,
  createNew: false,
  indexId: "",
};

const retrievalSlice = createSlice({
  name: "Retrieval",
  initialState,
  reducers: {
    updateRetrievalJson: (state, action) => {
      state.retrievalFlowsJson = action.payload;
    },
    updateSelectColumn: (state, action) => {
      if(!state.retrievalFlowsJson){
        state.retrievalFlowsJson = {}
      }
      state.retrievalFlowsJson.select_columns = action.payload;
    },
    updateApplyFilter: (state, action) => {
      state.retrievalFlowsJson.apply_filter = action.payload;
    },
    updateChooseRetrievalStrategy: (state, action) => {
      state.retrievalFlowsJson.choose_retrieval_strategy = action.payload;
    },
    updateRetrievalFlowName: (state, action) => {
      state.name = action.payload;
    },
    updateRetrievalDropDownValue: (state, action) => {
      state.drop_down_value = action.payload;
    },
    updateRetrievalIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateRetrievalProcess: (state, action) => {
      state.process = action.payload;
    },
    updateRetrievalUnSaveChanges: (state, action) => {
      state.unSaveChanges = action.payload;
    },
    updateRetrievalCallHandleSave: (state, action) => {
      state.callHandleSave = action.payload;
    },
    updateRetrievalCreateNew: (state, action) => {
      state.createNew = action.payload;
    },
    updateRetrievalId: (state, action) => {
      state.indexId = action.payload;
    },
    resetRetrievalJson: () => initialState,
  },
});

export const {
  updateApplyFilter,
  updateSelectColumn,
  resetRetrievalJson,
  updateRetrievalId,
  updateRetrievalJson,
  updateRetrievalProcess,
  updateRetrievalFlowName,
  updateRetrievalIsLoading,
  updateRetrievalCreateNew,
  updateRetrievalUnSaveChanges,
  updateRetrievalDropDownValue,
  updateRetrievalCallHandleSave,
  updateChooseRetrievalStrategy,
} = retrievalSlice.actions;
export default retrievalSlice.reducer;
