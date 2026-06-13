import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { notify } from "../../lib/notifications";
import { eventService } from "../../services/event.service";
import { getApiPayload, getRejectMessage } from "../../utils/api";
import { getEventId } from "../../utils/format";

const upsertEvent = (items, event) => {
  const id = getEventId(event);
  const index = items.findIndex((item) => getEventId(item) === id);
  if (index >= 0) {
    items[index] = event;
  } else {
    items.unshift(event);
  }
};

export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await eventService.list();
    return getApiPayload(response).events ?? [];
  } catch (error) {
    return rejectWithValue(getRejectMessage(error, "Could not load events"));
  }
});

export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventService.details(eventId);
      return getApiPayload(response).event;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Could not load event"));
    }
  },
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await eventService.create(payload);
      notify.events.created();
      return getApiPayload(response).event;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Event creation failed"));
    }
  },
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      const response = await eventService.update(eventId, payload);
      notify.events.updated();
      return getApiPayload(response).event;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Event update failed"));
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await eventService.remove(eventId);
      notify.events.deleted();
      return eventId;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Event delete failed"));
    }
  },
);

export const approveEvent = createAsyncThunk(
  "events/approveEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventService.approve(eventId);
      notify.events.approved();
      return getApiPayload(response).event;
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Event approval failed"));
    }
  },
);

const initialState = {
  items: [],
  selected: null,
  status: "idle",
  detailsStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearSelectedEvent(state) {
      state.selected = null;
      state.detailsStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchEventDetails.pending, (state) => {
        state.detailsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.detailsStatus = "succeeded";
        state.selected = action.payload;
        upsertEvent(state.items, action.payload);
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertEvent(state.items, action.payload);
        state.selected = action.payload;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertEvent(state.items, action.payload);
        state.selected = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.filter((event) => getEventId(event) !== action.payload);
        if (getEventId(state.selected) === action.payload) {
          state.selected = null;
        }
      })
      .addCase(approveEvent.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertEvent(state.items, action.payload);
        state.selected = action.payload;
      })
      .addMatcher(
        (action) =>
          [
            createEvent.pending.type,
            updateEvent.pending.type,
            deleteEvent.pending.type,
            approveEvent.pending.type,
          ].includes(action.type),
        (state) => {
          state.actionStatus = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            createEvent.rejected.type,
            updateEvent.rejected.type,
            deleteEvent.rejected.type,
            approveEvent.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.actionStatus = "failed";
          state.error = action.payload;
        },
      );
  },
});

export const { clearSelectedEvent } = eventsSlice.actions;
export const selectEvents = (state) => state.events.items;
export const selectSelectedEvent = (state) => state.events.selected;
export default eventsSlice.reducer;
