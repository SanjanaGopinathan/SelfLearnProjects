// components/EventList.jsx
// Fetches and displays events for selected date
// Fully integrated with Redux and Backend API

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFail,
  deleteEventStart,
  deleteEventSuccess,
  deleteEventFail
} from '../redux/eventsSlice';
import { eventsAPI } from '../services/api';
import EventCard from './EventCard';
import EventForm from './EventForm';
import Spinner from './Spinner';
import Toast from './Toast';
import '../styles/EventList.css';

function EventList() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.date.selectedDate);
  const { events, isLoading, error } = useSelector(state => state.events);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // ===== FETCH EVENTS WHEN DATE CHANGES =====
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        dispatch(fetchEventsStart());

        // selectedDate is stored as ISO string, extract just the date part
        const dateStr = selectedDate.split('T')[0];

        // Call backend API to get events for this date
        const response = await eventsAPI.getEventsByDate(dateStr);
        
        // Dispatch success action with fetched events
        dispatch(fetchEventsSuccess(response.data.events));
      } catch (err) {
        console.error('Error fetching events:', err);
        const errorMsg = err.response?.data?.message || 'Failed to load events';
        dispatch(fetchEventsFail(errorMsg));
      }
    };

    fetchEvents();
  }, [selectedDate, dispatch]);

  // ===== DELETE EVENT =====
  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;

    try {
      dispatch(deleteEventStart());
      
      await eventsAPI.deleteEvent(eventId);
      
      // Remove from Redux state
      dispatch(deleteEventSuccess(eventId));
      dispatch(fetchEventsSuccess(events.filter(e => e.id !== eventId)));
      
      setToastMessage('Event deleted successfully!');
      setToastType('success');
    } catch (err) {
      console.error('Error deleting event:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete event';
      dispatch(deleteEventFail(errorMsg));
      setToastMessage(errorMsg);
      setToastType('error');
    }
  };

  // ===== FORM SUBMISSION =====
  const handleFormSubmit = async (eventData) => {
    try {
      dispatch(fetchEventsStart());
      
      if (editingEvent) {
        // Update existing event
        await eventsAPI.updateEvent(editingEvent.id, eventData);
        setToastMessage('Event updated successfully!');
      } else {
        // Create new event
        await eventsAPI.createEvent(eventData);
        setToastMessage('Event created successfully!');
      }

      setToastType('success');

      // Re-fetch events after submit
      const dateStr = selectedDate.split('T')[0];
      const response = await eventsAPI.getEventsByDate(dateStr);
      
      dispatch(fetchEventsSuccess(response.data.events));
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error saving event:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save event';
      dispatch(fetchEventsFail(errorMsg));
      setToastMessage(errorMsg);
      setToastType('error');
    }
  };

  // Format date for display
  const dateDisplay = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="event-list-container">
      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="event-list-header">
        <div>
          <h3>📌 Events for {dateDisplay}</h3>
          {events.length > 0 && <span className="event-count">{events.length} event(s)</span>}
        </div>
        <button
          className="btn-new-event"
          onClick={() => {
            setShowForm(!showForm);
            setEditingEvent(null);
          }}
          disabled={isLoading}
        >
          {showForm ? '✕ Cancel' : '+ New Event'}
        </button>
      </div>

      {/* Show form if toggled */}
      {showForm && (
        <EventForm
          selectedDate={selectedDate}
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* Loading state with spinner */}
      {isLoading && <Spinner />}

      {/* Events list */}
      <div className="events-list">
        {events.length === 0 && !isLoading && !error && (
          <div className="no-events">
            <p>No events scheduled for this date</p>
            <p className="hint">Click "+ New Event" to create one</p>
          </div>
        )}

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={(ev) => {
              setEditingEvent(ev);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default EventList;
