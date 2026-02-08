// Todo Controller - Handles HTTP requests for todos

const {
  createTodoService,
  getTodosService,
  getSingleTodoService,
  updateTodoService,
  deleteTodoService
} = require('../services/todoService');

// Create todo
// POST /api/todos
async function createTodoController(req, res, next) {
  try {
    const userId = req.user.userId;
    const todoData = req.body;
    
    const result = await createTodoService(userId, todoData);
    return res.status(201).json(result);
    
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
}

// Get all todos
// GET /api/todos
async function getTodosController(req, res, next) {
  try {
    const userId = req.user.userId;
    const result = await getTodosService(userId);
    return res.status(200).json(result);
    
  } catch (error) {
    return next(error);
  }
}

// Get single todo
// GET /api/todos/:id
async function getSingleTodoController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await getSingleTodoService(userId, id);
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

// Update todo (e.g., toggle completed, change priority)
// PUT /api/todos/:id
async function updateTodoController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await updateTodoService(userId, id, updateData);
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

// Delete todo
// DELETE /api/todos/:id
async function deleteTodoController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await deleteTodoService(userId, id);
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
  createTodoController,
  getTodosController,
  getSingleTodoController,
  updateTodoController,
  deleteTodoController
};
