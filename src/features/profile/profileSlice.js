import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { profileService } from "../../services/profile.service";
import { getApiPayload, getRejectMessage } from "../../utils/api";

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await profileService.update(payload);
      return getApiPayload(response).user;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Profile update failed"));
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
