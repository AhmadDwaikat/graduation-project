const { check, validationResult } = require('express-validator');

const validateEvent = [
  check('name', 'Name is required').notEmpty(),
  check('date', 'Date is required and should be a valid date').isISO8601(),
  check('description', 'Description is required').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateEvent;
