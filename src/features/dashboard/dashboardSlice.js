import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    status: "succeeded",
    error: null,
  },
  reducers: {},
});

export const selectDashboardMetrics = (state) => {
  const events = state.events.items;
  const bookings = state.bookings.items;
  const user = state.auth.user;

  const approvedEvents = events.filter((event) => event.isApproved).length;
  const pendingEvents = events.filter((event) => !event.isApproved).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "confirmed" || booking.paymentStatus === "paid",
  ).length;
  const revenue = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((total, booking) => total + Number(booking.amount || 0), 0);

  return {
    user,
    totalEvents: events.length,
    approvedEvents,
    pendingEvents,
    totalBookings: bookings.length,
    confirmedBookings,
    revenue,
  };
};

export default dashboardSlice.reducer;
