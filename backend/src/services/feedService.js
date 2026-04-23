const feedRepository = require('../repositories/feedRepository');
const friendsRepository = require('../repositories/friendsRepository');
const authRepository = require('../repositories/authRepository');

/**
 * Get activity feed for friends only
 */
async function getFeed(userId, { page = 1, limit = 20 }) {
  // Get user's friends
  const friendships = await friendsRepository.findAcceptedFriendships(userId);

  const friendIds = friendships.map(f =>
    f.requesterId.toString() === userId.toString() ? f.receiverId : f.requesterId
  );

  // If no friends, return empty feed
  if (friendIds.length === 0) {
    return {
      activities: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }

  // Get activities from friends
  const skip = (page - 1) * limit;
  const result = await feedRepository.getActivitiesByUserIds(friendIds, {
    skip,
    limit
  });

  // Get user details for each activity
  const userIds = [...new Set(result.activities.map(a => a.userId))];
  const users = await authRepository.getUsersByIds(userIds);

  // Enrich activities with user data
  const enrichedActivities = result.activities.map(activity => {
    const user = users.find(u => u._id.toString() === activity.userId.toString());
    const { passwordHash, ...userData } = user || {};
    return {
      ...activity,
      user: userData
    };
  });

  return {
    activities: enrichedActivities,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    }
  };
}

/**
 * Get user's own activities
 */
async function getOwnActivities(userId, { page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const result = await feedRepository.getActivitiesByUserId(userId, {
    skip,
    limit
  });

  // Get user details
  const user = await authRepository.getUserById(userId);
  const { passwordHash, ...userData } = user || {};

  // Enrich activities with user data
  const enrichedActivities = result.activities.map(activity => ({
    ...activity,
    user: userData
  }));

  return {
    activities: enrichedActivities,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    }
  };
}

module.exports = {
  getFeed,
  getOwnActivities
};