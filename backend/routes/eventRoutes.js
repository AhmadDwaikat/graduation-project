const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController'); // Ensure this path is correct
const validateEvent = require('../middleware/validationMiddleware'); // Ensure this path is correct
const auth = require('../middleware/authMiddleware'); // Ensure this path is correct

console.log('Loaded eventRoutes');

const router = express.Router();

router.post('/', auth, validateEvent, createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', auth, validateEvent, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
