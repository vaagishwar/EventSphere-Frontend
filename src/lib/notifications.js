import { errorToast, infoToast, successToast, warningToast } from "./toast";

export const notify = {
  auth: {
    loginSuccess: () => successToast("Login Success"),
    loginFailed: () => errorToast("Login Failed"),
    registrationSuccess: () => successToast("Registration Success"),
    registrationFailed: () => errorToast("Registration Failed"),
    otpVerified: () => successToast("OTP Verified"),
    otpInvalid: () => errorToast("OTP Invalid"),
    otpExpired: () => warningToast("OTP Expired"),
    passwordResetSuccess: () => successToast("Password Reset Success"),
    sessionExpired: () => warningToast("Session Expired"),
  },
  events: {
    created: () => successToast("Event Created"),
    updated: () => successToast("Event Updated"),
    deleted: () => successToast("Event Deleted"),
    creationFailed: () => errorToast("Event Creation Failed"),
    updateFailed: () => errorToast("Event Update Failed"),
    approved: () => successToast("Event Approved"),
    rejected: () => warningToast("Event Rejected"),
  },
  bookings: {
    ticketBooked: () => successToast("Ticket Booked"),
    bookingFailed: () => errorToast("Booking Failed"),
    eventSoldOut: () => warningToast("Event Sold Out"),
    seatsUnavailable: () => warningToast("Seats Unavailable"),
  },
  payments: {
    success: () => successToast("Payment Success"),
    failed: () => errorToast("Payment Failed"),
    cancelled: () => warningToast("Payment Cancelled"),
  },
  profile: {
    updated: () => successToast("Profile Updated"),
    passwordChanged: () => successToast("Password Changed"),
  },
  users: {
    deleted: () => successToast("User Deleted"),
    updated: () => successToast("User Updated"),
    blocked: () => warningToast("User Blocked"),
    actionFailed: () => errorToast("Action Failed"),
  },
  dashboard: {
    dataRefreshSuccess: () => successToast("Data Refresh Success"),
    reportGenerationFailed: () => errorToast("Report Generation Failed"),
  },
  reports: {
    downloadSuccess: () => successToast("Report Download Success"),
    exportFailed: () => errorToast("Export Failed"),
  },
  api: {
    info: infoToast,
    warning: warningToast,
    error: errorToast,
    success: successToast,
  },
};
