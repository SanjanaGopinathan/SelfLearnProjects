// Auth Service - Handles password encryption and verification
// Like Angular AuthService

const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');
const { findUserByEmail, createUser, findUserById } = require('../models/User');

// Register new user
async function register(email, password, firstName, lastName) {
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password (bcryptjs encrypts password so plain text is never stored)
    // Salt = how many times to encrypt (10 is standard)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const userId = await createUser(email, hashedPassword, firstName, lastName);

    // Generate login token
    const token = generateToken(userId, email);

    return {
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName
      }
    };

  } catch (error) {
    throw error;
  }
}

// Login user
async function login(email, password) {
  try {
    // Find user by email
    const user = await findUserByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare plain password with hashed password
    // bcrypt.compare() returns true if passwords match
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };

  } catch (error) {
    throw error;
  }
}

// Get user profile
async function getUserProfile(userId) {
  try {
    const user = await findUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user
    };

  } catch (error) {
    throw error;
  }
}

module.exports = {
  register,
  login,
  getUserProfile
};
