// User Model - All database queries related to users
// Like a service that talks to database

const { pool } = require('../config/database');

// Create/Register a new user
async function createUser(email, hashedPassword, firstName, lastName) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName]
    );
    connection.release();
    return result.insertId; // Return the new user's ID
  } catch (error) {
    throw error;
  }
}

// Find user by email
async function findUserByEmail(email) {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, email, password, firstName, lastName FROM users WHERE email = ?',
      [email]
    );
    connection.release();
    return users[0] || null; // Return first user or null if not found
  } catch (error) {
    throw error;
  }
}

// Find user by ID
async function findUserById(userId) {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, firstName, lastName, createdAt FROM users WHERE id = ?',
      [userId]
    );
    return users[0] || null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
