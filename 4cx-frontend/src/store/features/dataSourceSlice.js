import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceType: "generic",
  data : {}
};

const dataSourceSlice = createSlice({
  name: "Data_Source",
  initialState,
  reducers: {
    setDataSourceData: (state, action) => {
      state.data = action.payload;
    },
    updateSourceType: (state, action) => {
      state.sourceType = action.payload;
    },
    resetDataSource: () => initialState,
  },
});

export const { setDataSourceData, resetDataSource, updateSourceType } = dataSourceSlice.actions;
export default dataSourceSlice.reducer;
