const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// User information routes
router.get('/me', auth, authController.getUserInfo);
router.put('/me', auth, authController.updateUserInfo);
router.put('/change-password', auth, authController.changePassword);
module.exports = router;
