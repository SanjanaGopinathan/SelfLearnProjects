// Todo Model - Database queries for todos

const { pool } = require('../config/database');

// Create new todo
async function createTodo(userId, title, description, priority, dueDate) {
  try {
    console.log(`[createTodo] Starting - userId: ${userId}, title: ${title}`);
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO todos (userId, title, description, priority, dueDate) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description || '', priority || 'medium', dueDate || null]
    );
    connection.release();
    console.log(`[createTodo] Created todo with ID: ${result.insertId} for userId: ${userId}`);
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

// Get all todos for user
async function getTodosByUserId(userId) {
  try {
    console.log(`[getTodosByUserId] Starting fetch for userId: ${userId} (type: ${typeof userId})`);
    const connection = await pool.getConnection();
    console.log(`[getTodosByUserId] Connection acquired`);
    const [todos] = await connection.execute(
      'SELECT * FROM todos WHERE userId = ? ORDER BY completed ASC, dueDate ASC',
      [userId]
    );
    connection.release();
    console.log(`[getTodosByUserId] Query executed. Raw result:`, JSON.stringify(todos));
    console.log(`[getTodosByUserId] Fetched ${todos.length} todos for userId ${userId}`);
    
    // Debug: also check without userId filter
    const connCheck = await pool.getConnection();
    const [allTodos] = await connCheck.execute('SELECT * FROM todos LIMIT 5');
    connCheck.release();
    console.log(`[getTodosByUserId] Total todos in DB (first 5):`, allTodos.length);
    
    return todos;
  } catch (error) {
    console.error(`[getTodosByUserId] Error for userId ${userId}:`, error.message);
    console.error(`[getTodosByUserId] Error for userId ${userId}:`, error.message);
    throw error;
  }
}

// Get single todo
async function getTodoById(todoId, userId) {
  try {
    const connection = await pool.getConnection();
    const [todos] = await connection.execute(
      'SELECT * FROM todos WHERE id = ? AND userId = ?',
      [todoId, userId]
    );
    connection.release();
    return todos[0] || null;
  } catch (error) {
    throw error;
  }
}

// Update todo
async function updateTodo(todoId, userId, updateData) {
  try {
    const connection = await pool.getConnection();
    
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
    
    values.push(todoId, userId);
    
    await connection.execute(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );
    
    const [todos] = await connection.execute(
      'SELECT * FROM todos WHERE id = ? AND userId = ?',
      [todoId, userId]
    );
    
    connection.release();
    return todos[0] || null;
  } catch (error) {
    throw error;
  }
}

// Delete todo
async function deleteTodo(todoId, userId) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM todos WHERE id = ? AND userId = ?',
      [todoId, userId]
    );
    connection.release();
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodo,
  deleteTodo
};
