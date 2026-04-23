const friendsService = require('../services/friendsService');

/**
 * Send friend request
 * POST /api/friends/request
 */
async function sendFriendRequest(req, res, next) {
  try {
    const { friendUsername } = req.body;

    if (!friendUsername) {
      return res.status(400).json({ error: 'Friend username is required' });
    }

    const result = await friendsService.sendFriendRequest(req.userId, friendUsername);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Accept friend request
 * POST /api/friends/accept/:userId
 */
async function acceptFriendRequest(req, res, next) {
  try {
    const { userId } = req.params;

    const result = await friendsService.acceptFriendRequest(req.userId, userId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Remove friend
 * DELETE /api/friends/remove/:userId
 */
async function removeFriend(req, res, next) {
  try {
    const { userId } = req.params;

    await friendsService.removeFriend(req.userId, userId);

    return res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's friends list
 * GET /api/friends
 */
async function getFriends(req, res, next) {
  try {
    const friends = await friendsService.getFriends(req.userId);

    return res.json(friends);
  } catch (error) {
    next(error);
  }
}

/**
 * Get pending friend requests
 * GET /api/friends/pending
 */
async function getPendingRequests(req, res, next) {
  try {
    const requests = await friendsService.getPendingRequests(req.userId);

    return res.json(requests);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests
};