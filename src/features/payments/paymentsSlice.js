import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { notify } from "../../lib/notifications";
import { paymentService } from "../../services/payment.service";
import { getApiPayload, getRejectMessage } from "../../utils/api";

export const createPaymentOrder = createAsyncThunk(
  "payments/createPaymentOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentService.createOrder(payload);
      return getApiPayload(response);
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Payment order failed"));
    }
  },
);

export const confirmPayment = createAsyncThunk(
  "payments/confirmPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentService.confirmSuccess(payload);
      notify.payments.success();
      return getApiPayload(response).booking;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Payment failed"));
    }
  },
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    order: null,
    confirmedBooking: null,
    status: "idle",
    error: null,
  },
  reducers: {
    paymentCancelled(state) {
      state.status = "cancelled";
      notify.payments.cancelled();
    },
    clearPayment(state) {
      state.order = null;
      state.confirmedBooking = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.status = "order-created";
        state.order = action.payload;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.status = "paid";
        state.confirmedBooking = action.payload;
      })
      .addMatcher(
        (action) =>
          [createPaymentOrder.pending.type, confirmPayment.pending.type].includes(action.type),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [createPaymentOrder.rejected.type, confirmPayment.rejected.type].includes(action.type),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        },
      );
  },
});

export const { clearPayment, paymentCancelled } = paymentsSlice.actions;
export default paymentsSlice.reducer;
