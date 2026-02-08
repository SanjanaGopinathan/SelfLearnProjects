// components/EventForm.jsx
// Form to create or edit an event
// Shows date, time, title, description, and category inputs

import React, { useState } from 'react';
import '../styles/EventForm.css';

function EventForm({ selectedDate, event, onSubmit, onCancel }) {
  // ===== FORM STATE =====
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startTime, setStartTime] = useState(event?.startTime || '10:00');
  const [endTime, setEndTime] = useState(event?.endTime || '11:00');
  const [category, setCategory] = useState(event?.category || 'meeting');
  const [error, setError] = useState('');

  // ===== FORM SUBMISSION =====
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Event title is required');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    // Prepare data for API
    const eventData = {
      title: title.trim(),
      description: description.trim(),
      startTime,
      endTime,
      category,
      // selectedDate is ISO string, extract just the date part
      eventDate: selectedDate.split('T')[0]
    };

    onSubmit(eventData);
  };

  // Format date for display
  const dateDisplay = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h4>📝 {event ? 'Edit' : 'Create'} Event</h4>
        <p className="form-date">📅 {dateDisplay}</p>
      </div>

      {/* Error message */}
      {error && <div className="form-error">{error}</div>}

      {/* Title input */}
      <div className="form-group">
        <label>Event Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Team Meeting"
          maxLength={100}
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

      {/* Time inputs */}
      <div className="form-row">
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* Category select */}
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="meeting">Meeting</option>
          <option value="birthday">Birthday</option>
          <option value="holiday">Holiday</option>
          <option value="reminder">Reminder</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Form buttons */}
      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {event ? '✓ Update' : '✓ Create'} Event
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EventForm;
