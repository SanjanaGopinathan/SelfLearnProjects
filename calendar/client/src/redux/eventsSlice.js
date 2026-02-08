// redux/eventsSlice.js
// Redux slice for events state

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],           // All events
  selectedEvent: null,  // Currently selected event (for detail view)
  isLoading: false,
  error: null
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Fetch all events
    fetchEventsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchEventsSuccess: (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
    },

    fetchEventsFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create event
    createEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    createEventSuccess: (state, action) => {
      state.isLoading = false;
      // Add new event to list
      state.events.push(action.payload);
    },

    createEventFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update event
    updateEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    updateEventSuccess: (state, action) => {
      state.isLoading = false;
      // Find and replace updated event
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index >= 0) {
        state.events[index] = action.payload;
      }
    },

    updateEventFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete event
    deleteEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteEventSuccess: (state, action) => {
      state.isLoading = false;
      // Remove deleted event from list
      state.events = state.events.filter(e => e.id !== action.payload);
    },

    deleteEventFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Select event for detail view
    selectEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },

    // Clear events (on logout)
    clearEvents: (state) => {
      state.events = [];
      state.selectedEvent = null;
    }
  }
});

export const {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFail,
  createEventStart,
  createEventSuccess,
  createEventFail,
  updateEventStart,
  updateEventSuccess,
  updateEventFail,
  deleteEventStart,
  deleteEventSuccess,
  deleteEventFail,
  selectEvent,
  clearEvents
} = eventsSlice.actions;

export default eventsSlice.reducer;
