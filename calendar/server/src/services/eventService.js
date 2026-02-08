// Event Service - Business logic for events
// Handles validation and data transformation

const {
  createEvent,
  getEventsByUserId,
  getEventsByDate,
  getEventsByDateRange,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../models/Event');

// Validate event data
function validateEventData(data) {
  const { title, eventDate, startTime, endTime } = data;
  
  if (!title || !eventDate || !startTime || !endTime) {
    throw new Error('Title, date, and times are required');
  }
  
  if (title.trim().length === 0) {
    throw new Error('Title cannot be empty');
  }
  
  // Check if startTime is before endTime
  if (startTime >= endTime) {
    throw new Error('Start time must be before end time');
  }
  
  return true;
}

// Create event service
async function createEventService(userId, eventData) {
  try {
    validateEventData(eventData);
    
    const {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      category,
      color
    } = eventData;
    
    const eventId = await createEvent(
      userId,
      title,
      description || '',
      eventDate,
      startTime,
      endTime,
      category || 'Personal',
      color || '#667eea'
    );
    
    return {
      success: true,
      message: 'Event created successfully',
      eventId
    };
  } catch (error) {
    throw error;
  }
}

// Get all events for user
async function getEventsService(userId) {
  try {
    const events = await getEventsByUserId(userId);
    return {
      success: true,
      events
    };
  } catch (error) {
    throw error;
  }
}

// Get events for specific date
async function getEventsByDateService(userId, eventDate) {
  try {
    const events = await getEventsByDate(userId, eventDate);
    return {
      success: true,
      events
    };
  } catch (error) {
    throw error;
  }
}

// Get events in date range (for calendar month view)
async function getEventsByRangeService(userId, startDate, endDate) {
  try {
    const events = await getEventsByDateRange(userId, startDate, endDate);
    return {
      success: true,
      events
    };
  } catch (error) {
    throw error;
  }
}

// Get single event
async function getSingleEventService(userId, eventId) {
  try {
    const event = await getEventById(eventId, userId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return {
      success: true,
      event
    };
  } catch (error) {
    throw error;
  }
}

// Update event
async function updateEventService(userId, eventId, eventData) {
  try {
    // Check if event exists
    const event = await getEventById(eventId, userId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    // Validate if dates/times are provided
    if (eventData.startTime && eventData.endTime) {
      if (eventData.startTime >= eventData.endTime) {
        throw new Error('Start time must be before end time');
      }
    }
    
    const updatedEvent = await updateEvent(eventId, userId, eventData);
    
    return {
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    };
  } catch (error) {
    throw error;
  }
}

// Delete event
async function deleteEventService(userId, eventId) {
  try {
    const event = await getEventById(eventId, userId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    const deleted = await deleteEvent(eventId, userId);
    
    if (!deleted) {
      throw new Error('Failed to delete event');
    }
    
    return {
      success: true,
      message: 'Event deleted successfully'
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createEventService,
  getEventsService,
  getEventsByDateService,
  getEventsByRangeService,
  getSingleEventService,
  updateEventService,
  deleteEventService
};
