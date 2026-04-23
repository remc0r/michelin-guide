const friendsRepository = require('../repositories/friendsRepository');
const authRepository = require('../repositories/authRepository');

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Send friend request to another user
 */
async function sendFriendRequest(userId, friendUsername) {
  if (!userId) {
    throw createHttpError('Unauthorized', 401);
  }

  // Find the friend user
  const friendUser = await authRepository.findByUsername(friendUsername);
  if (!friendUser) {
    throw createHttpError('User not found', 404);
  }

  // Check if trying to add yourself
  if (userId.toString() === friendUser._id.toString()) {
    throw createHttpError('Cannot add yourself as a friend', 400);
  }

  // Check if already friends
  const existingFriendship = await friendsRepository.findFriendship(userId, friendUser._id);
  if (existingFriendship && existingFriendship.status === 'accepted') {
    throw createHttpError('Already friends with this user', 409);
  }

  // Check if request already exists
  const existingRequest = await friendsRepository.findFriendship(userId, friendUser._id);
  if (existingRequest) {
    if (existingRequest.status === 'pending') {
      throw createHttpError('Friend request already pending', 409);
    }
  }

  // Create friend request
  const friendship = await friendsRepository.createFriendship({
    requesterId: userId.toString(),
    receiverId: friendUser._id.toString(),
    status: 'pending',
    createdAt: new Date()
  });

  return friendship;
}

/**
 * Accept friend request
 */
async function acceptFriendRequest(userId, friendUserId) {
  if (!userId) {
    throw createHttpError('Unauthorized', 401);
  }

  let friendship = null;

  // Prefer an explicit friendship identifier when provided by the client.
  if (typeof friendsRepository.findFriendshipById === 'function') {
    friendship = await friendsRepository.findFriendshipById(friendUserId);
  }

  if (!friendship) {
    friendship = await friendsRepository.findFriendship(friendUserId, userId);
  }

  if (!friendship) {
    throw createHttpError('Friend request not found', 404);
  }

  if (friendship.status !== 'pending') {
    throw createHttpError('This request has already been processed', 409);
  }

  if (!friendship.receiverId || friendship.receiverId.toString() !== userId.toString()) {
    throw createHttpError('Not authorized to accept this request', 403);
  }

  const updatedFriendship = await friendsRepository.updateFriendshipStatus(
    friendship._id,
    'accepted'
  );

  if (!updatedFriendship) {
    throw createHttpError('Failed to update friend request', 500);
  }

  return updatedFriendship;
}

/**
 * Remove friend
 */
async function removeFriend(userId, friendUserId) {
  const friendship = await friendsRepository.findFriendship(userId, friendUserId);

  if (!friendship) {
    throw new Error('Friendship not found');
  }

  if (friendship.status !== 'accepted') {
    throw new Error('Not friends with this user');
  }

  await friendsRepository.deleteFriendship(friendship._id);

  return { success: true };
}

/**
 * Get user's friends list
 */
async function getFriends(userId) {
  const friendships = await friendsRepository.findAcceptedFriendships(userId);

  if (friendships.length === 0) {
    const emptyFriends = [];
    emptyFriends.pagination = { total: 0 };
    return emptyFriends;
  }

  // Get friend details
  const friendIds = friendships.map(f =>
    f.requesterId.toString() === userId.toString() ? f.receiverId : f.requesterId
  );

  const friends = await friendsRepository.getUsersByIds(friendIds);

  // Remove password hashes from response
  const sanitizedFriends = friends.map(user => {
    const { passwordHash, ...userData } = user;
    return userData;
  });

  sanitizedFriends.pagination = { total: sanitizedFriends.length };
  return sanitizedFriends;
}

/**
 * Get pending friend requests
 */
async function getPendingRequests(userId) {
  const friendships = await friendsRepository.findPendingRequests(userId);

  // Get requester details
  const requesterIds = friendships.map(f => f.requesterId);
  const requesters = await friendsRepository.getUsersByIds(requesterIds);

  // Remove password hashes and add friendship details
  return friendships.map(friendship => {
    const requester = requesters.find(r => r._id.toString() === friendship.requesterId.toString());
    const { passwordHash, ...userData } = requester || {};
    return {
      ...userData,
      friendshipId: friendship._id
    };
  });
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests
};