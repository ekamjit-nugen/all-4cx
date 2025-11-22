import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flowJsonData: {
    Chunk_Enrichment: {
      chunkingType: ["Extract affirmative and factual statements"],
      selectedLanguage: { id: 1, value: "Option 2", label: "Option 2" },
      status: false,
    },
    Chunking_Strategy: {
      selectedOptionArray: [
        { category: { id: 0, value: "PDF", label: "PDF" }, chunkingType: "", inputValue: "" },
      ],
      status: false,
    },
    Indexing_Strategy: {
      status: false,
    },
    Select_Data_Source: {
      status: false,
    },
  },
  name: "",
  traversal: {
    Select_Data_Source: false,
    Chunk_Enrichment: false,
  },
  process: 0,
  unSaveChanges: false,
  callHandleSave: false,
  createNew: false,
};

const searchSlice = createSlice({
  name: "Search",
  initialState,
  reducers: {
    updateChunkEnrichment: (state, action) => {
      state.flowJsonData["Chunk_Enrichment"] = action.payload;
    },
    updateChunkStrategy: (state, action) => {
      state.flowJsonData["Chunking_Strategy"] = action.payload;
    },
    updateIndexingStrategy: (state, action) => {
      state.flowJsonData["Indexing_Strategy"] = action.payload;
    },
    updateDataSource: (state, action) => {
      state.flowJsonData["Select_Data_Source"] = action.payload;
    },
    updateDataSourceName: (state, action) => {
      state.name = action.payload;
    },
    updateFlowJsonData: (state, action) => {
      state.flowJsonData = action.payload;
    },
    updateSearchTraversal: (state, action) => {
      state.traversal = action.payload;
    },
    updateSearchProcess: (state, action) => {
      state.process = action.payload;
    },
    updateUnSaveChanges: (state, action) => {
      state.unSaveChanges = action.payload;
    },
    updateCallHandleSave: (state, action) => {
      state.callHandleSave = action.payload;
    },
    updateSearchCreateNew: (state, action) => {
      state.createNew = action.payload;
    },
    resetSearchJson: () => initialState,
  },
});

export const {
  resetSearchJson,
  updateDataSource,
  updateFlowJsonData,
  updateChunkStrategy,
  updateSearchProcess,
  updateUnSaveChanges,
  updateDataSourceName,
  updateCallHandleSave,
  updateSearchCreateNew,
  updateSearchTraversal,
  updateChunkEnrichment,
  updateIndexingStrategy,
} = searchSlice.actions;
export default searchSlice.reducer;
