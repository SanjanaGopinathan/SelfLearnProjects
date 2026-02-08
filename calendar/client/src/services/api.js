// services/api.js
// All API calls to your backend in ONE place
// Like Angular's HttpClient service

import axios from 'axios';

// Base URL for all requests
const API_BASE_URL = 'selflearnprojects-production.up.railway.app/api';

// Create axios instance (for easier configuration)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Automatically add token to every request
// This runs BEFORE every API call

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (we'll store it there after login)
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const authAPI = {
  register: (email, password, firstName, lastName) => {
    return api.post('/auth/register', {
      email,
      password,
      confirmPassword: password,
      firstName,
      lastName
    });
  },

  login: (email, password) => {
    return api.post('/auth/login', {
      email,
      password
    });
  },

  getProfile: () => {
    return api.get('/auth/profile');
  }
};

// ============================================
// EVENTS ENDPOINTS
// ============================================

export const eventsAPI = {
  // Get all events for user
  getAllEvents: () => {
    return api.get('/events');
  },

  // Get events by date
  getEventsByDate: (date) => {
    return api.get(`/events/date/${date}`);
  },

  // Get events in date range (for calendar month)
  getEventsByRange: (startDate, endDate) => {
    return api.get('/events/range', {
      params: { startDate, endDate }
    });
  },

  // Get single event
  getEvent: (id) => {
    return api.get(`/events/${id}`);
  },

  // Create event
  createEvent: (eventData) => {
    return api.post('/events', eventData);
  },

  // Update event
  updateEvent: (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
  },

  // Delete event
  deleteEvent: (id) => {
    return api.delete(`/events/${id}`);
  }
};

// ============================================
// TODOS ENDPOINTS
// ============================================

export const todosAPI = {
  // Get all todos
  getAllTodos: () => {
    return api.get('/todos');
  },

  // Get single todo
  getTodo: (id) => {
    return api.get(`/todos/${id}`);
  },

  // Create todo
  createTodo: (todoData) => {
    return api.post('/todos', todoData);
  },

  // Update todo
  updateTodo: (id, todoData) => {
    return api.put(`/todos/${id}`, todoData);
  },

  // Delete todo
  deleteTodo: (id) => {
    return api.delete(`/todos/${id}`);
  }
};

export default api;
