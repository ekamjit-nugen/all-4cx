// uploadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    activeUpload: null,
    progress: 0,
    isActive: false,
    isLinearprogress:false,
  },
  reducers: {
    startUpload(state, action) {
      state.activeUpload = action.payload; // Set the active upload
      state.isActive = true; // Mark upload as active
      state.progress = 0; // Reset progress
    },
    updateProgress(state, action) {
      state.progress = action.payload; // Update progress
    },
    completeUpload(state) {
      state.activeUpload = null; // Reset active upload
      state.isActive = false; // Mark upload as inactive
      state.progress = 100; // Set progress to complete
    },
    startLinearUpload(state, action) {
      state.activeUpload = action.payload; // Set the active upload
      state.isLinearprogress = true // Reset progress
    },
    completeLinearUpload(state, action) {
      state.activeUpload = action.payload; // Set the active upload
      state.isLinearprogress = false // Reset progress
    },
  },
});

export const { startUpload, updateProgress, completeUpload, startLinearUpload, completeLinearUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
