import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { organizerService } from "../../services/organizer.service";
import { getApiPayload, getRejectMessage } from "../../utils/api";

export const fetchOrganizerEventAnalytics = createAsyncThunk(
  "organizer/fetchEventAnalytics",
  async ({ eventId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await organizerService.eventAnalytics(eventId, { page, limit });
      return getApiPayload(response);
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Could not load organizer analytics"));
    }
  },
);

const organizerAnalyticsSlice = createSlice({
  name: "organizerAnalytics",
  initialState: {
    event: null,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    availableSeats: 0,
    revenue: 0,
    fillRate: 0,
    recentBookings: [],
    trend: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    status: "idle",
    error: null,
  },
  reducers: {
    clearOrganizerAnalytics(state) {
      state.event = null;
      state.recentBookings = [];
      state.trend = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizerEventAnalytics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrganizerEventAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchOrganizerEventAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearOrganizerAnalytics } = organizerAnalyticsSlice.actions;
export default organizerAnalyticsSlice.reducer;
