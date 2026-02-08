// Event Controller - Handles HTTP requests for events

const {
  createEventService,
  getEventsService,
  getEventsByDateService,
  getEventsByRangeService,
  getSingleEventService,
  updateEventService,
  deleteEventService
} = require('../services/eventService');

// Create event
// POST /api/events
async function createEventController(req, res, next) {
  try {
    const userId = req.user.userId; // From auth middleware
    const eventData = req.body;
    
    const result = await createEventService(userId, eventData);
    return res.status(201).json(result);
    
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('empty')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return next(error);
  }
}

// Get all events
// GET /api/events
async function getEventsController(req, res, next) {
  try {
    const userId = req.user.userId;
    const result = await getEventsService(userId);
    return res.status(200).json(result);
    
  } catch (error) {
    next(error);
  }
}

// Get events by date
// GET /api/events/date/:eventDate
async function getEventsByDateController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { eventDate } = req.params;
    
    if (!eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }
    
    const result = await getEventsByDateService(userId, eventDate);
    return res.status(200).json(result);
    
  } catch (error) {
    next(error);
  }
}

// Get events by date range
// GET /api/events/range?startDate=2024-01-01&endDate=2024-01-31
async function getEventsByRangeController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const result = await getEventsByRangeService(userId, startDate, endDate);
    return res.status(200).json(result);
    
  } catch (error) {
    next(error);
  }
}

// Get single event
// GET /api/events/:id
async function getSingleEventController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await getSingleEventService(userId, id);
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

// Update event
// PUT /api/events/:id
async function updateEventController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await updateEventService(userId, id, updateData);
    return res.status(200).json(result);
    
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('before')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
}

// Delete event
// DELETE /api/events/:id
async function deleteEventController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await deleteEventService(userId, id);
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
  createEventController,
  getEventsController,
  getEventsByDateController,
  getEventsByRangeController,
  getSingleEventController,
  updateEventController,
  deleteEventController
};
