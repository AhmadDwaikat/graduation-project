const express = require('express');
const multer = require('multer');

const eventController = require('../controllers/eventController');
const validateEvent = require('../middleware/validationMiddleware');
const participantController = require('../controllers/participantController'); 
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// High-rated events route
router.get('/high-rated', auth, eventController.getHighRatedEvents);

// Get events not created by the user
router.get('/non-created', auth, eventController.getNonCreatedEvents);

// Create event route
router.post('/create', auth, validateEvent, eventController.createEvent);

// Route to fetch user-specific events
router.get('/user', auth, eventController.getUserEvents);

// Get upcoming events that the user has participated in
router.get('/user/upcoming', auth, eventController.getUserUpcomingEvents);

// Get past events that the user has participated in
router.get('/user/past', auth, eventController.getUserPastEvents);

// Get all events route
router.get('/', eventController.getEvents);

// Get single event by ID route
router.get('/:id', eventController.getEvent);

// Get organizer event detail route
router.get('/organizer/:id', auth, eventController.getOrganizerEventDetail);

// Update event route
router.put('/:id', auth, validateEvent, eventController.updateEvent);

// Delete event route
router.delete('/:id', auth, eventController.deleteEvent);

// Routes for joining and leaving events
router.put('/:id/join', auth, eventController.joinEvent);
router.put('/:id/leave', auth, eventController.leaveEvent);

// Rate an event
router.post('/:id/rate', auth, eventController.rateEvent);

// Comment on an event
router.post('/:id/comment', auth, eventController.commentEvent);

// Add and delete media (images and videos)
router.post('/:id/media', auth, upload.array('media'), eventController.addMediaToEvent);

router.delete('/:id/media/:type/:file', auth, eventController.deleteMedia);


router.get('/:eventId/participants', auth, participantController.getParticipants);

router.put('/:eventId/participants/:participantId', auth, participantController.updateParticipantStatus);
router.post('/:eventId/participants/:participantId/notification', auth, participantController.sendNotification);
router.post('/:eventId/participants/:participantId/message', auth, participantController.sendMessage);

module.exports = router;
