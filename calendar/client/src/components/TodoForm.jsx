// components/TodoForm.jsx
// Form to create or edit a todo
// Simpler than EventForm - no time fields

import React, { useState } from 'react';
import '../styles/TodoForm.css';

function TodoForm({ todo, onSubmit, onCancel }) {
  // ===== FORM STATE =====
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState(todo?.priority || 'medium');
  const [error, setError] = useState('');

  // ===== FORM SUBMISSION =====
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Todo title is required');
      return;
    }

    // Prepare data for API
    const todoData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: todo?.completed || false
    };

    onSubmit(todoData);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h4>📝 {todo ? 'Edit' : 'Create'} Todo</h4>
      </div>

      {/* Error message */}
      {error && <div className="form-error">{error}</div>}

      {/* Title input */}
      <div className="form-group">
        <label>Todo Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Buy groceries"
          maxLength={100}
          autoFocus
        />
      </div>

      {/* Description input */}
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes or details..."
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Priority select */}
      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>

      {/* Form buttons */}
      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {todo ? '✓ Update' : '✓ Add'} Todo
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
