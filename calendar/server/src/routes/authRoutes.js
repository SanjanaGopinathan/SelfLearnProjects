// Auth Routes
// Defines API endpoints: /api/auth/login, /api/auth/register, etc

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  registerController,
  loginController,
  getProfileController
} = require('../controllers/authController');

// Public routes (no login needed)
router.post('/register', registerController);
router.post('/login', loginController);

// Protected routes (login required)
router.get('/profile', authenticate, getProfileController);

module.exports = router;
