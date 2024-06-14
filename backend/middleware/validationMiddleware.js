const { check, validationResult } = require('express-validator');

const validateEvent = [
  check('title', 'Title is required').notEmpty(),
  check('date', 'Date is required and should be a valid date').isISO8601(),
  check('time', 'Time is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('category', 'Category is required').notEmpty(),
  check('location', 'Location is required').notEmpty(),
  check('participantLimit', 'Participant limit is required and should be a number').isInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateEvent;
