// Event Model - All database queries for events
// Handles CRUD operations for events

const { pool } = require('../config/database');

// Create new event
async function createEvent(userId, title, description, eventDate, startTime, endTime, category, color) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO events (userId, title, description, eventDate, startTime, endTime, category, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, eventDate, startTime, endTime, category, color]
    );
    connection.release();
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

// Get all events for a user
async function getEventsByUserId(userId) {
  try {
    const connection = await pool.getConnection();
    const [events] = await connection.execute(
      'SELECT * FROM events WHERE userId = ? ORDER BY eventDate ASC, startTime ASC',
      [userId]
    );
    connection.release();
    return events;
  } catch (error) {
    throw error;
  }
}

// Get events for a specific date
async function getEventsByDate(userId, eventDate) {
  try {
    const connection = await pool.getConnection();
    const [events] = await connection.execute(
      'SELECT * FROM events WHERE userId = ? AND eventDate = ? ORDER BY startTime ASC',
      [userId, eventDate]
    );
    connection.release();
    return events;
  } catch (error) {
    throw error;
  }
}

// Get events in date range
async function getEventsByDateRange(userId, startDate, endDate) {
  try {
    const connection = await pool.getConnection();
    const [events] = await connection.execute(
      'SELECT * FROM events WHERE userId = ? AND eventDate BETWEEN ? AND ? ORDER BY eventDate ASC, startTime ASC',
      [userId, startDate, endDate]
    );
    connection.release();
    return events;
  } catch (error) {
    throw error;
  }
}

// Get single event by ID
async function getEventById(eventId, userId) {
  try {
    const connection = await pool.getConnection();
    const [events] = await connection.execute(
      'SELECT * FROM events WHERE id = ? AND userId = ?',
      [eventId, userId]
    );
    connection.release();
    return events[0] || null;
  } catch (error) {
    throw error;
  }
}

// Update event
async function updateEvent(eventId, userId, updateData) {
  try {
    const connection = await pool.getConnection();
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    if (updates.length === 0) {
      connection.release();
      return null;
    }
    
    values.push(eventId, userId);
    
    await connection.execute(
      `UPDATE events SET ${updates.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );
    
    // Get updated event
    const [events] = await connection.execute(
      'SELECT * FROM events WHERE id = ? AND userId = ?',
      [eventId, userId]
    );
    
    connection.release();
    return events[0] || null;
  } catch (error) {
    throw error;
  }
}

// Delete event
async function deleteEvent(eventId, userId) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM events WHERE id = ? AND userId = ?',
      [eventId, userId]
    );
    connection.release();
    return result.affectedRows > 0; // Returns true if event was deleted
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createEvent,
  getEventsByUserId,
  getEventsByDate,
  getEventsByDateRange,
  getEventById,
  updateEvent,
  deleteEvent
};
