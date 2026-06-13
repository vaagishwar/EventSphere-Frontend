import api from "./apiClient";

export const authService = {
  register: (payload) => api.post("/auth/register", payload),

  login: (payload) => api.post("/auth/login", payload),

  sendOtp: (payload) => api.post("/auth/send-verification-otp", payload),

  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),

  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),

  resetPassword: (payload) => api.post("/auth/reset-password", payload),

  me: () => api.get("/auth/me"),
};
