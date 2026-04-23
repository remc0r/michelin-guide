const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { authenticate } = require('../middleware/auth');

// All feed routes require authentication
router.use(authenticate);

// GET /api/feed?page=&limit= - Get activity feed for friends only
router.get('/', feedController.getFeed);

// GET /api/feed/own?page=&limit= - Get user's own activities
router.get('/own', feedController.getOwnActivities);

module.exports = router;