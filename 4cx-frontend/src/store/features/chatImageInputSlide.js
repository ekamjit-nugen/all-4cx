import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  previewImage: "",
  base64Image: "",
  fileUrl: "",
};

const inputImageSlice = createSlice({
  name: "inputImage",
  initialState,
  reducers: {
    updateBase64Image(state, action) {
      state.base64Image = action.payload;
    },
    reset(state) {
      state.previewImage = "";
      state.base64Image = "";
      state.fileUrl = "";
    },
    setPreviewImage(state, action) {
      state.previewImage = action.payload;
    },
    setFileUrl(state, action) {
      state.fileUrl = action.payload;
    },
  },
});

export const { updateBase64Image, reset, setPreviewImage, setFileUrl } = inputImageSlice.actions;
export default inputImageSlice.reducer;
