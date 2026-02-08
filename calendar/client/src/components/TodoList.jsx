// components/TodoList.jsx
// Fetches and displays todos
// Fully integrated with Redux and Backend API

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTodosStart,
  fetchTodosSuccess,
  fetchTodosFail,
  deleteTodoStart,
  deleteTodoSuccess,
  deleteTodoFail
} from '../redux/todosSlice';
import { todosAPI } from '../services/api';
import TodoCard from './TodoCard';
import TodoForm from './TodoForm';
import Spinner from './Spinner';
import Toast from './Toast';
import '../styles/TodoList.css';

function TodoList() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.date.selectedDate);
  const { todos, isLoading, error } = useSelector(state => state.todos);

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // ===== FETCH TODOS WHEN DATE CHANGES =====
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        dispatch(fetchTodosStart());

        // Call backend API to get all todos
        // In a real app, you'd filter by date on backend
        const response = await todosAPI.getAllTodos();
        
        // Dispatch success action with fetched todos
        dispatch(fetchTodosSuccess(response.data.todos));
      } catch (err) {
        console.error('Error fetching todos:', err);
        const errorMsg = err.response?.data?.message || 'Failed to load todos';
        dispatch(fetchTodosFail(errorMsg));
      }
    };

    fetchTodos();
  }, [selectedDate, dispatch]);

  // ===== TOGGLE TODO COMPLETE STATUS =====
  const handleToggle = async (todoId) => {
    try {
      dispatch(fetchTodosStart());
      
      // Find the todo to toggle
      const todo = todos.find(t => t.id === todoId);
      
      // Update on backend
      await todosAPI.updateTodo(todoId, {
        ...todo,
        completed: !todo.completed
      });

      // Re-fetch todos
      const response = await todosAPI.getAllTodos();
      dispatch(fetchTodosSuccess(response.data.todos));
      
      setToastMessage(todo.completed ? 'Marked as pending' : 'Marked as completed!');
      setToastType('success');
    } catch (err) {
      console.error('Error updating todo:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update todo';
      dispatch(fetchTodosFail(errorMsg));
      setToastMessage(errorMsg);
      setToastType('error');
    }
  };

  // ===== DELETE TODO =====
  const handleDelete = async (todoId) => {
    if (!window.confirm('Delete this todo?')) return;

    try {
      dispatch(deleteTodoStart());
      
      await todosAPI.deleteTodo(todoId);
      
      // Remove from Redux state
      dispatch(deleteTodoSuccess(todoId));
      dispatch(fetchTodosSuccess(todos.filter(t => t.id !== todoId)));
      
      setToastMessage('Todo deleted successfully!');
      setToastType('success');
    } catch (err) {
      console.error('Error deleting todo:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete todo';
      dispatch(deleteTodoFail(errorMsg));
      setToastMessage(errorMsg);
      setToastType('error');
    }
  };

  // ===== FORM SUBMISSION =====
  const handleFormSubmit = async (todoData) => {
    try {
      dispatch(fetchTodosStart());
      
      if (editingTodo) {
        // Update existing todo
        await todosAPI.updateTodo(editingTodo.id, todoData);
        setToastMessage('Todo updated successfully!');
      } else {
        // Create new todo
        await todosAPI.createTodo(todoData);
        setToastMessage('Todo created successfully!');
      }

      setToastType('success');

      // Re-fetch todos after submit
      const response = await todosAPI.getAllTodos();
      dispatch(fetchTodosSuccess(response.data.todos));
      
      setShowForm(false);
      setEditingTodo(null);
    } catch (err) {
      console.error('Error saving todo:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save todo';
      dispatch(fetchTodosFail(errorMsg));
      setToastMessage(errorMsg);
      setToastType('error');
    }
  };

  // ===== FILTER TODOS =====
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  // Count stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  const dateDisplay = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="todo-list-container">
      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Header */}
      <div className="todo-list-header">
        <div>
          <h3>✅ To-Do List for {dateDisplay}</h3>
          <div className="todo-stats">
            {totalTodos > 0 && (
              <>
                <span className="stat">{completedTodos} completed</span>
                <span className="stat-separator">•</span>
                <span className="stat">{pendingTodos} pending</span>
              </>
            )}
          </div>
        </div>
        <button
          className="btn-new-todo"
          onClick={() => {
            setShowForm(!showForm);
            setEditingTodo(null);
          }}
          disabled={isLoading}
        >
          {showForm ? '✕ Cancel' : '+ New Todo'}
        </button>
      </div>

      {/* Show form if toggled */}
      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
        />
      )}

      {/* Loading state with spinner */}
      {isLoading && <Spinner />}

      {/* Filter buttons */}
      {totalTodos > 0 && (
        <div className="todo-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({totalTodos})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingTodos})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedTodos})
          </button>
        </div>
      )}

      {/* Todos list */}
      <div className="todos-list">
        {filteredTodos.length === 0 && !isLoading && !error && (
          <div className="no-todos">
            {totalTodos === 0 ? (
              <>
                <p>No todos for this date</p>
                <p className="hint">Click "+ New Todo" to create one</p>
              </>
            ) : (
              <p>No {filter} todos</p>
            )}
          </div>
        )}

        {filteredTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onEdit={(t) => {
              setEditingTodo(t);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Progress bar */}
      {totalTodos > 0 && (
        <div className="todo-progress">
          <div className="progress-label">
            Progress: {completedTodos}/{totalTodos}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
