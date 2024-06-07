// userRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust the path if necessary

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
