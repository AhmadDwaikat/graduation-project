const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
  getNonCreatedEvents,
  joinEvent,
  leaveEvent,
  getUserUpcomingEvents,
  getUserPastEvents,
  rateEvent,
  commentEvent,
  getHighRatedEvents
} = require('../controllers/eventController');
const validateEvent = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// High-rated events route
router.get('/high-rated', auth, getHighRatedEvents);

// Get events not created by the user
router.get('/non-created', auth, getNonCreatedEvents);

// Create event route
router.post('/create', auth, validateEvent, createEvent);

// Route to fetch user-specific events
router.get('/user', auth, getUserEvents);

// Get upcoming events that the user has participated in
router.get('/user/upcoming', auth, getUserUpcomingEvents);

// Get past events that the user has participated in
router.get('/user/past', auth, getUserPastEvents);

// Get all events route
router.get('/', getEvents);

// Get single event by ID route
router.get('/:id', getEvent);

// Update event route
router.put('/:id', auth, validateEvent, updateEvent);

// Delete event route
router.delete('/:id', auth, deleteEvent);

// Routes for joining and leaving events
router.put('/:id/join', auth, joinEvent);
router.put('/:id/leave', auth, leaveEvent);

// Rate an event
router.post('/:id/rate', auth, rateEvent);

// Comment on an event
router.post('/:id/comment', auth, commentEvent);

module.exports = router;
