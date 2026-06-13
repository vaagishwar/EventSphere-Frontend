import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import eventsReducer from "../features/events/eventsSlice";
import organizerAnalyticsReducer from "../features/organizer/organizerAnalyticsSlice";
import paymentsReducer from "../features/payments/paymentsSlice";
import profileReducer from "../features/profile/profileSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
    organizerAnalytics: organizerAnalyticsReducer,
    payments: paymentsReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
});
