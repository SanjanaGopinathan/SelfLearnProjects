// Todo Service - Business logic for todos

const {
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../models/Todo');

// Validate todo data
function validateTodoData(data) {
  const { title } = data;
  
  if (!title || title.trim().length === 0) {
    throw new Error('Title is required');
  }
  
  return true;
}

// Create todo
async function createTodoService(userId, todoData) {
  try {
    validateTodoData(todoData);
    
    const {
      title,
      description,
      priority,
      dueDate
    } = todoData;
    
    const todoId = await createTodo(userId, title, description, priority, dueDate);
    
    return {
      success: true,
      message: 'Todo created successfully',
      todoId
    };
  } catch (error) {
    throw error;
  }
}

// Get all todos
async function getTodosService(userId) {
  try {
    const todos = await getTodosByUserId(userId);
    return {
      success: true,
      todos
    };
  } catch (error) {
    throw error;
  }
}

// Get single todo
async function getSingleTodoService(userId, todoId) {
  try {
    const todo = await getTodoById(todoId, userId);
    
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    return {
      success: true,
      todo
    };
  } catch (error) {
    throw error;
  }
}

// Update todo (toggle completed, update title, etc)
async function updateTodoService(userId, todoId, todoData) {
  try {
    const todo = await getTodoById(todoId, userId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    const updatedTodo = await updateTodo(todoId, userId, todoData);
    
    return {
      success: true,
      message: 'Todo updated successfully',
      todo: updatedTodo
    };
  } catch (error) {
    throw error;
  }
}

// Delete todo
async function deleteTodoService(userId, todoId) {
  try {
    const todo = await getTodoById(todoId, userId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    const deleted = await deleteTodo(todoId, userId);
    
    if (!deleted) {
      throw new Error('Failed to delete todo');
    }
    
    return {
      success: true,
      message: 'Todo deleted successfully'
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTodoService,
  getTodosService,
  getSingleTodoService,
  updateTodoService,
  deleteTodoService
};
