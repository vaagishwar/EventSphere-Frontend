import api from "./apiClient";

export const organizerService = {
  eventAnalytics: (eventId, params) =>
    api.get(`/organizer/events/${eventId}/analytics`, { params }),
};
