// JWT Token utilities - for creating and verifying login tokens
// This replaces session management you might use in MEAN

const jwt = require('jsonwebtoken');

// Generate login token
// This gets sent back to React frontend after successful login
function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },                    // Data to encode in token
    process.env.JWT_SECRET,               // Secret key (in .env)
    { expiresIn: process.env.JWT_EXPIRY } // Token expires after 7 days
  );
}

// Verify token from frontend request
// Frontend sends token in header, we verify it's valid
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

module.exports = {
  generateToken,
  verifyToken
};
