import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { notify } from "../../lib/notifications";
import { bookingService } from "../../services/booking.service";
import { getApiPayload, getRejectMessage } from "../../utils/api";

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.listMine();
      return getApiPayload(response).bookings ?? [];
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Could not load bookings"));
    }
  },
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bookingService.create(payload);
      notify.bookings.ticketBooked();
      return getApiPayload(response).booking;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Booking failed"));
    }
  },
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    items: [],
    lastCreated: null,
    status: "idle",
    actionStatus: "idle",
    error: null,
  },
  reducers: {
    clearLastCreatedBooking(state) {
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.lastCreated = action.payload;
        state.items.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearLastCreatedBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
