// Auth Controller - Handles HTTP requests
// Like Angular Component that handles user interactions

const { register, login, getUserProfile } = require('../services/authService');

// Register new user
// POST /api/auth/register
async function registerController(req, res, next) {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Call service to register user
    const result = await register(email, password, firstName, lastName);

    return res.status(201).json(result);

  } catch (error) {
    // If email already exists
    if (error.message.includes('already registered')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
}

// Login user
// POST /api/auth/login
async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Call service to login user
    const result = await login(email, password);

    return res.status(200).json(result);

  } catch (error) {
    // Invalid credentials
    if (error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
}

// Get current user profile
// GET /api/auth/profile
async function getProfileController(req, res, next) {
  try {
    // req.user comes from authenticate middleware
    const userId = req.user.userId;

    const result = await getUserProfile(userId);

    return res.status(200).json(result);

  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  getProfileController
};
