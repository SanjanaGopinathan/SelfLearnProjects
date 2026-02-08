// Todo Routes
// Defines API endpoints for todos

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createTodoController,
  getTodosController,
  getSingleTodoController,
  updateTodoController,
  deleteTodoController
} = require('../controllers/todoController');

// All todo routes require authentication
router.use(authenticate);

// Get all todos
router.get('/', getTodosController);

// Create todo
router.post('/', createTodoController);

// Get single todo
router.get('/:id', getSingleTodoController);

// Update todo
router.put('/:id', updateTodoController);

// Delete todo
router.delete('/:id', deleteTodoController);

module.exports = router;
