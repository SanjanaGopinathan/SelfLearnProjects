// redux/dateSlice.js
// Manages the selected date state (shared across app)
// When user selects a date in Calendar, it updates Redux
// Other components subscribe to this date and fetch data

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDate: new Date().toISOString(), // Today by default (as ISO string)
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    // Action: Set a new date (expects ISO string or Date object)
    setSelectedDate: (state, action) => {
      // Convert Date object to ISO string if needed
      if (action.payload instanceof Date) {
        state.selectedDate = action.payload.toISOString();
      } else {
        state.selectedDate = action.payload;
      }
    },
  },
});

export const { setSelectedDate } = dateSlice.actions;
export default dateSlice.reducer;
