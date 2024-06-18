const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
  getNonCreatedEvents,
} = require('../controllers/eventController');
const validateEvent = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get events not created by the user
router.get('/non-created', auth, getNonCreatedEvents);

// Create event route
router.post('/create', auth, validateEvent, createEvent);

// Route to fetch user-specific events
router.get('/user', auth, getUserEvents);

// Get all events route
router.get('/', getEvents);

// Get single event by ID route
router.get('/:id', getEvent);

// Update event route
router.put('/:id', auth, validateEvent, updateEvent);

// Delete event route
router.delete('/:id', auth, deleteEvent);

module.exports = router;
