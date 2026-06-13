import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { reportService } from "../../services/report.service";
import { getRejectMessage } from "../../utils/api";

export const generateReport = createAsyncThunk(
  "reports/generateReport",
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.generate();
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Report API is not available yet."));
    }
  },
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    items: [],
    status: "idle",
    error: "Report and export APIs are not available yet.",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateReport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload ?? [];
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;
