import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  extractFile: [],
  extractStatus: false,
  extractPrompt: [],
  notificationStatus:false,
  indexStatus : 'notStarted',
  processingDataSources : [],
  indexDataSources : []

};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setExtractFile: (state, action) => {
      state.extractFile.push(action.payload);
    },
    deleteExtractFile: (state, action) => {
      state.extractFile = action.payload;
    },
    setExtractStatus: (state, action) => {
      state.extractStatus = action.payload;
    },
    setExtractPrompt: (state, action) => {
      const data=action?.payload?.map((value)=>{
        const { service, title, status, createdAt } = value;
        return { service, title, status, createdAt }
      })
      

      // const existingIndex = state.extractPrompt.findIndex((data) => data.title === title);

      // if (existingIndex !== -1) {
      //   state.extractPrompt[existingIndex] = { service, title, status, createdAt };
      // } else {
        state.extractPrompt=data;
      // }
    },
    clearExtractReduxData: (state) => {
      state.extractPrompt = [];
    },
    setNotificationStatus:(state,action)=>{
      state.notificationStatus = action.payload
    },
    updateIndexStatus:(state,action)=>{
      state.indexStatus = action.payload
    },
    updateIndexDataSources:(state,action)=>{
      state.indexDataSources = action.payload
    },
    indexDataSources:(state,action)=>{
      state.processingDataSources = [...(state.processingDataSources || []), ...(action.payload || [])];
    },
    removeDataSource: (state, action) => {
      state.processingDataSources = state.processingDataSources.filter(ds => ds.id !== action.payload);
    },
    updateDataSource: (state, action) => {
      state.processingDataSources = state.processingDataSources.map(ds =>
        ds.id === action.payload.id ? { ...ds, ...action.payload } : ds
      );
    },    
  },
});

export const {
  setExtractFile,
  deleteExtractFile,
  setExtractStatus,
  setExtractPrompt,
  clearExtractReduxData,
  setNotificationStatus,
  updateIndexStatus,
  indexDataSources,
  removeDataSource,
  updateDataSource,
  updateIndexDataSources
} = socketSlice.actions;

export default socketSlice.reducer;
