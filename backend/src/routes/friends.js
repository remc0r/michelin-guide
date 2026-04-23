const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const { authenticate } = require('../middleware/auth');

// All friends routes require authentication
router.use(authenticate);

// POST /api/friends/request - Send friend request
router.post('/request', friendsController.sendFriendRequest);

// POST /api/friends/accept/:userId - Accept friend request
router.post('/accept/:userId', friendsController.acceptFriendRequest);

// DELETE /api/friends/remove/:userId - Remove friend
router.delete('/remove/:userId', friendsController.removeFriend);

// GET /api/friends - Get user's friends list
router.get('/', friendsController.getFriends);

// GET /api/friends/pending - Get pending friend requests
router.get('/pending', friendsController.getPendingRequests);

module.exports = router;