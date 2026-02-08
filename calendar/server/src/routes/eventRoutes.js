// Event Routes
// Defines API endpoints for events

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createEventController,
  getEventsController,
  getEventsByDateController,
  getEventsByRangeController,
  getSingleEventController,
  updateEventController,
  deleteEventController
} = require('../controllers/eventController');

// All event routes require authentication - This may change later for public events because anyone can view public events these routes will be updated accordingly
// Using authentication middleware the routes below will only be accessible to logged-in users
router.use(authenticate);

// Get all events
router.get('/', getEventsController);

// Get events by date range (query params)
router.get('/range', getEventsByRangeController);

// Get events by specific date
router.get('/date/:eventDate', getEventsByDateController);

// Create event
router.post('/', createEventController);

// Get single event by ID
router.get('/:id', getSingleEventController);

// Update event
router.put('/:id', updateEventController);

// Delete event
router.delete('/:id', deleteEventController);

module.exports = router;
