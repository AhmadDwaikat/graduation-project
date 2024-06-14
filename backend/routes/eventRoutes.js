// routes/eventRoutes.js

const express = require('express');
const {createEvent,getEvents,getEvent,updateEvent,deleteEvent,} = require('../controllers/eventController');
const validateEvent = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');
const Event = require('../models/Event');

const router = express.Router();

// CRUD event routes
router.post('/create', auth, validateEvent, createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', auth, validateEvent, updateEvent);
router.delete('/:id', auth, deleteEvent);

// Test route
router.get('/test', async (req, res) => {
  try {
    const event = await Event.create({
      title: 'Test Event',
      description: 'This is a test',
      date: new Date(),
      category: 'Test',
      creator: '60d5ec49d58f1f6b20a24dd0',
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test event', error: error.message });
  }
});

module.exports = router;
