// redux/store.js
// Redux store - combines all slices
// Like ngrx StoreModule.forRoot()

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventsReducer from './eventsSlice';
import todosReducer from './todosSlice';
import dateReducer from './dateSlice';

// Create store and combine all reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    todos: todosReducer,
    date: dateReducer
  }
});

export default store;
