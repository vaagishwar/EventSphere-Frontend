import api from "./apiClient";

export const bookingService = {
  create: (payload) => api.post("/bookings", payload),

  listMine: () => api.get("/bookings/my"),
};
