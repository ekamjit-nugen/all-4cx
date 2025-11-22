import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePersona: {
    archive_status: false,
    author: "",
    category: "",
    cloned: 0,
    isCloned: false,
    organization_id: "",
    project_id: "",
    prompt_id: "",
    prompt_text: "",
    prompt_title: "",
    prompt_type: "",
    runs: 0,
    updatedAt: "",
    version: 0,
    versionCount: 0,
    versions: [],
    _id: "",
  },
};

const chatPersonaSlice = createSlice({
  name: "chatPersonaSlice",
  initialState,
  reducers: {
    updateActivePersona: (state, action) => {
      state.activePersona = action.payload;
    },
    clearActivePersona: (state, action) => {
      state.activePersona = initialState.activePersona;
    },
  },
});

export const { updateActivePersona, clearActivePersona } = chatPersonaSlice.actions;

export default chatPersonaSlice.reducer;
