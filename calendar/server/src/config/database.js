// This file connects Node.js to MySQL database
// Think of this as the "Service" in Angular that handles database communication

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (multiple connections ready to use)
// Similar to having multiple database workers ready to handle queries
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
//   user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
//   password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
//   database: process.env.DB_NAME || process.env.MYSQL_DB || 'calendar_app',
//   port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,        // Max 10 simultaneous connections
//   queueLimit: 0               // Queue unlimited requests
// 
// });const pool = mysql.createPool({
//   uri: process.env.DATABASE_URL, // MySQL URL
//   waitForConnections: true,
//   connectionLimit: 10,   // 👈 10 connections in pool
//   queueLimit: 0
// });

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT),
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : undefined
});
// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    connection.release(); // Return connection to pool
  } catch (error) {
    console.error('MySQL DB Connection Error:', error.message);
    process.exit(1); // Exit if can't connect
  }
}

module.exports = {
  pool,
  testConnection
};
