// redux/todosSlice.js
// Redux slice for todos state

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
  isLoading: false,
  error: null
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Fetch all todos
    fetchTodosStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchTodosSuccess: (state, action) => {
      state.isLoading = false;
      state.todos = action.payload;
    },

    fetchTodosFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create todo
    createTodoStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    createTodoSuccess: (state, action) => {
      state.isLoading = false;
      state.todos.push(action.payload);
    },

    createTodoFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update todo (toggle complete, change priority, etc)
    updateTodoStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    updateTodoSuccess: (state, action) => {
      state.isLoading = false;
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index >= 0) {
        state.todos[index] = action.payload;
      }
    },

    updateTodoFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete todo
    deleteTodoStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteTodoSuccess: (state, action) => {
      state.isLoading = false;
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },

    deleteTodoFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear todos (on logout)
    clearTodos: (state) => {
      state.todos = [];
    }
  }
});

export const {
  fetchTodosStart,
  fetchTodosSuccess,
  fetchTodosFail,
  createTodoStart,
  createTodoSuccess,
  createTodoFail,
  updateTodoStart,
  updateTodoSuccess,
  updateTodoFail,
  deleteTodoStart,
  deleteTodoSuccess,
  deleteTodoFail,
  clearTodos
} = todosSlice.actions;

export default todosSlice.reducer;
