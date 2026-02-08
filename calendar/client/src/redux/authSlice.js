// redux/authSlice.js
// Redux slice for authentication state
// Like ngrx auth reducer & effects combined

import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,           // Logged-in user info
  token: null,          // JWT token
  isLoading: false,     // Loading state (for buttons, spinners)
  error: null           // Error messages
};

// Create slice (combines reducer + actions)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action: User is logging in
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Action: Login successful
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Save token to localStorage so it persists on refresh
      localStorage.setItem('token', action.payload.token);
    },

    // Action: Login failed
    loginFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Action: User logged out
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      
      // Remove token from localStorage
      localStorage.removeItem('token');
    },

    // Action: Restore user from localStorage on app load
    restoreUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  }
});

// Export actions (use these in components)
export const { loginStart, loginSuccess, loginFail, logout, restoreUser } = authSlice.actions;

// Export reducer (needed for store)
export default authSlice.reducer;
