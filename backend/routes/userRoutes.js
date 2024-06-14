const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { getUserInfo, updateUserInfo } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// User information routes
router.get('/me', auth, getUserInfo);
router.put('/me', auth, updateUserInfo);

module.exports = router;
