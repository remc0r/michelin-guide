const { getDb } = require('../db/mongo');

// Mock data fallback
const mockFriendships = [];
const mockUsers = [];

/**
 * Find friendship between two users
 */
async function findFriendship(userId1, userId2) {
  try {
    const db = getDb();
    const friendship = await db
      .collection('friendships')
      .findOne({
        $or: [
          { requesterId: userId1, receiverId: userId2 },
          { requesterId: userId2, receiverId: userId1 }
        ]
      });

    return friendship;
  } catch (error) {
    // Fallback to mock data
    return mockFriendships.find(f =>
      (f.requesterId === userId1 && f.receiverId === userId2) ||
      (f.requesterId === userId2 && f.receiverId === userId1)
    );
  }
}

/**
 * Create a new friendship
 */
async function createFriendship(friendshipData) {
  try {
    const db = getDb();
    const result = await db
      .collection('friendships')
      .insertOne(friendshipData);

    const createdFriendship = await db
      .collection('friendships')
      .findOne({ _id: result.insertedId });

    return createdFriendship;
  } catch (error) {
    // Fallback to mock data
    const newFriendship = {
      _id: `friendship_${Date.now()}`,
      ...friendshipData
    };
    mockFriendships.push(newFriendship);
    return newFriendship;
  }
}

/**
 * Update friendship status
 */
async function updateFriendshipStatus(friendshipId, status) {
  try {
    const db = getDb();
    const updatedFriendship = await db
      .collection('friendships')
      .findOneAndUpdate(
        { _id: friendshipId },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    return updatedFriendship;
  } catch (error) {
    // Fallback to mock data
    const friendship = mockFriendships.find(f => f._id === friendshipId);
    if (friendship) {
      friendship.status = status;
      friendship.updatedAt = new Date();
      return friendship;
    }
    return null;
  }
}

/**
 * Delete friendship
 */
async function deleteFriendship(friendshipId) {
  try {
    const db = getDb();
    await db
      .collection('friendships')
      .deleteOne({ _id: friendshipId });

    return { success: true };
  } catch (error) {
    // Fallback to mock data
    const index = mockFriendships.findIndex(f => f._id === friendshipId);
    if (index !== -1) {
      mockFriendships.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }
}

/**
 * Find all accepted friendships for a user
 */
async function findAcceptedFriendships(userId) {
  try {
    const db = getDb();
    const friendships = await db
      .collection('friendships')
      .find({
        $or: [
          { requesterId: userId },
          { receiverId: userId }
        ],
        status: 'accepted'
      })
      .toArray();

    return friendships;
  } catch (error) {
    // Fallback to mock data
    return mockFriendships.filter(f =>
      (f.requesterId === userId || f.receiverId === userId) &&
      f.status === 'accepted'
    );
  }
}

/**
 * Find pending friend requests for a user
 */
async function findPendingRequests(userId) {
  try {
    const db = getDb();
    const friendships = await db
      .collection('friendships')
      .find({
        receiverId: userId,
        status: 'pending'
      })
      .toArray();

    return friendships;
  } catch (error) {
    // Fallback to mock data
    return mockFriendships.filter(f =>
      f.receiverId === userId &&
      f.status === 'pending'
    );
  }
}

/**
 * Get users by IDs
 */
async function getUsersByIds(userIds) {
  try {
    const db = getDb();
    const users = await db
      .collection('users')
      .find({ _id: { $in: userIds } })
      .toArray();

    return users;
  } catch (error) {
    // Fallback to mock data
    return mockUsers.filter(u => userIds.includes(u._id));
  }
}

module.exports = {
  findFriendship,
  createFriendship,
  updateFriendshipStatus,
  deleteFriendship,
  findAcceptedFriendships,
  findPendingRequests,
  getUsersByIds
};