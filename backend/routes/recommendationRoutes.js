const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/recommendations', auth, recommendationController.recommendEvents);

module.exports = router;
