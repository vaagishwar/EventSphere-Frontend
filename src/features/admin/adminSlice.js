import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminService } from "../../services/admin.service";
import { getRejectMessage } from "../../utils/api";

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await adminService.fetchUsers();
  } catch (error) {
    return rejectWithValue(getRejectMessage(error, "User management API is not available yet."));
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    status: "idle",
    error: "User management API is not available yet.",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload ?? [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
