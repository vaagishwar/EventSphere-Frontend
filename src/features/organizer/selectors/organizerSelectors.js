export const selectOrganizerEvents = (state) => state.events.items;
export const selectOrganizerPendingEvents = (state) =>
  state.events.items.filter((event) => !event.isApproved);
export const selectOrganizerApprovedEvents = (state) =>
  state.events.items.filter((event) => event.isApproved);
export const selectOrganizerAnalytics = (state) => state.organizerAnalytics;
