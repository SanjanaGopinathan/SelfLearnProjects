// This file connects Node.js to MySQL database
// Think of this as the "Service" in Angular that handles database communication

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (multiple connections ready to use)
// Similar to having multiple database workers ready to handle queries
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,        // Max 10 simultaneous connections
  queueLimit: 0               // Queue unlimited requests
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    connection.release(); // Return connection to pool
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    process.exit(1); // Exit if can't connect
  }
}

module.exports = {
  pool,
  testConnection
};
