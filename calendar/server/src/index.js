// Main Express server file
// Similar to main.ts in Angular

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE - These run on EVERY request
// ============================================

// Parse incoming JSON requests
app.use(express.json());

// Allow React frontend to communicate with Node backend
const allowedOrigins = [
  'http://localhost:3000',           // Development
  'http://localhost:5000',           // Development
  'https://stellular-toffee-579981.netlify.app', // Production Netlify
  process.env.CORS_ORIGIN            // Any additional from env
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ============================================
// ROUTES - API endpoints
// ============================================

// Health check - test if server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running' 
  });
});

// Auth routes - /api/auth/login, /api/auth/register, etc
app.use('/api/auth', authRoutes);

// Event routes - /api/events/*
app.use('/api/events', eventRoutes);

// Todo routes - /api/todos/*
app.use('/api/todos', todoRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============================================
// START SERVER
// ============================================

async function startServer() {
  try {
    // Test database connection first
    await testConnection();

    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Calendar App Server Running      ║
║   Port: ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV}             ║
║   GraphQL: /api/...                   ║
╚════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
