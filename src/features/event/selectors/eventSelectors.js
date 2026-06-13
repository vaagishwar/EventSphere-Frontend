export { selectEvents, selectSelectedEvent } from "../../events/eventsSlice";

export const selectApprovedEvents = (state) =>
  state.events.items.filter((event) => event.isApproved);

export const selectPendingEvents = (state) =>
  state.events.items.filter((event) => !event.isApproved);
