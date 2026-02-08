// components/TodoCard.jsx
// Displays a single todo item
// Shows title, description, completion status, and action buttons

import React from 'react';
import '../styles/TodoCard.css';

function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox for toggle complete */}
      <div className="todo-checkbox-wrapper">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
      </div>

      {/* Todo content */}
      <div className="todo-content">
        <h4 className="todo-title">{todo.title}</h4>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
      </div>

      {/* Priority badge */}
      {todo.priority && (
        <span className={`priority-badge priority-${todo.priority}`}>
          {todo.priority}
        </span>
      )}

      {/* Action buttons */}
      <div className="todo-actions">
        <button
          className="btn-edit-todo"
          onClick={() => onEdit(todo)}
          title="Edit todo"
        >
          ✏️
        </button>
        <button
          className="btn-delete-todo"
          onClick={() => onDelete(todo.id)}
          title="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TodoCard;
