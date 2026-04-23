const friendsRepository = require('../repositories/friendsRepository');
const authRepository = require('../repositories/authRepository');

/**
 * Send friend request to another user
 */
async function sendFriendRequest(userId, friendUsername) {
  // Find the friend user
  const friendUser = await authRepository.findByUsername(friendUsername);
  if (!friendUser) {
    throw new Error('User not found');
  }

  // Check if trying to add yourself
  if (userId.toString() === friendUser._id.toString()) {
    throw new Error('Cannot add yourself as a friend');
  }

  // Check if already friends
  const existingFriendship = await friendsRepository.findFriendship(userId, friendUser._id);
  if (existingFriendship && existingFriendship.status === 'accepted') {
    throw new Error('Already friends with this user');
  }

  // Check if request already exists
  const existingRequest = await friendsRepository.findFriendship(userId, friendUser._id);
  if (existingRequest) {
    if (existingRequest.status === 'pending') {
      throw new Error('Friend request already pending');
    }
  }

  // Create friend request
  const friendship = await friendsRepository.createFriendship({
    requesterId: userId,
    receiverId: friendUser._id,
    status: 'pending',
    createdAt: new Date()
  });

  return friendship;
}

/**
 * Accept friend request
 */
async function acceptFriendRequest(userId, friendUserId) {
  const friendship = await friendsRepository.findFriendship(friendUserId, userId);

  if (!friendship) {
    throw new Error('Friend request not found');
  }

  if (friendship.status !== 'pending') {
    throw new Error('This request has already been processed');
  }

  if (friendship.receiverId.toString() !== userId.toString()) {
    throw new Error('Not authorized to accept this request');
  }

  const updatedFriendship = await friendsRepository.updateFriendshipStatus(
    friendship._id,
    'accepted'
  );

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

  // Get friend details
  const friendIds = friendships.map(f =>
    f.requesterId.toString() === userId.toString() ? f.receiverId : f.requesterId
  );

  const friends = await friendsRepository.getUsersByIds(friendIds);

  // Remove password hashes from response
  return friends.map(user => {
    const { passwordHash, ...userData } = user;
    return userData;
  });
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