import api from "./apiClient";

export const eventService = {
  list: (params) => api.get("/events", { params }),

  details: (id) => api.get(`/events/${id}`),

  create: (payload) => api.post("/events", payload),

  update: (id, payload) => api.put(`/events/${id}`, payload),

  remove: (id) => api.delete(`/events/${id}`),

  approve: (id) => api.patch(`/events/${id}/approve`),
};
