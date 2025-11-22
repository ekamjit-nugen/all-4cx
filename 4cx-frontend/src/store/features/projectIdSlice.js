import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  orgId: null,
  userId: null,
  chatModel: "",
  projectId: null,
  orchestrateId: "",
  updateStatus: false,
  isAuthenticated: false,
  selectedProjectName: "",
  selectEditComponent: "",
  indexId: "",
  navigationPath: "",
};

const projectIdSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.orgId = action.payload.orgId;
      state.userId = action.payload.userId;
    },
    logOutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.orgId = null;
      state.userId = null;
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload.projectId;
    },
    setSelectedProjectName: (state, action) => {
      state.selectedProjectName = action.payload;
    },
    deleteSelectedProjectName: (state) => {
      state.selectedProjectName = "";
    },
    setSelectedComponentName: (state, action) => {
      state.selectEditComponent = action.payload;
    },
    setUpdateStatus: (state, action) => {
      state.updateStatus = action.payload;
    },
    setUpdateOrchestrateId: (state, action) => {
      state.orchestrateId = action.payload;
    },
    setChatModel: (state, action) => {
      state.chatModel = action.payload;
    },
    updateIndexId: (state, action) => {
      state.indexId = action.payload;
    },
    updateNavigationPath: (state, action) => {
      state.navigationPath = action.payload;
    },
  },
});

export const {
  setUser,
  logOutUser,
  setProjectId,
  updateNavigationPath,
  setSelectedComponentName,
  setUpdateStatus,
  updateIndexId,
  deleteSelectedProjectName,
  setSelectedProjectName,
  setUpdateOrchestrateId,
  setChatModel,
} = projectIdSlice.actions;

export default projectIdSlice.reducer;
