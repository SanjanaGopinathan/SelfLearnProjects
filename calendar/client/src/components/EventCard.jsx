// components/EventCard.jsx
// Displays a single event
// Shows event time, title, description, and action buttons

import React from 'react';
import '../styles/EventCard.css';

function EventCard({ event, onEdit, onDelete }) {
  // Format time from "14:30" format to readable "2:30 PM"
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <div className="event-time">
          🕐 {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </div>
        <div className="event-actions">
          <button className="btn-edit" onClick={() => onEdit(event)} title="Edit event">
            ✏️
          </button>
          <button className="btn-delete" onClick={() => onDelete(event.id)} title="Delete event">
            🗑️
          </button>
        </div>
      </div>
      
      <h4 className="event-title">{event.title}</h4>
      
      {event.description && (
        <p className="event-description">{event.description}</p>
      )}
      
      <div className="event-footer">
        <span className="event-category">{event.category}</span>
      </div>
    </div>
  );
}

export default EventCard;
