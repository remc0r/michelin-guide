const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

function toObjectIdIfPossible(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const stringValue = String(value);
  if (!ObjectId.isValid(stringValue)) {
    return null;
  }

  return new ObjectId(stringValue);
}

function normalizeIdCandidates(value) {
  if (value === undefined || value === null) {
    return [];
  }

  const candidates = [value, String(value)];
  const objectId = toObjectIdIfPossible(value);
  if (objectId) {
    candidates.push(objectId);
  }

  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = candidate instanceof ObjectId
      ? `oid:${candidate.toHexString()}`
      : `str:${String(candidate)}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

// Mock data fallback
const mockFriendships = [];
const mockUsers = [];

/**
 * Find friendship between two users
 */
async function findFriendship(userId1, userId2) {
  try {
    const db = getDb();
    const userId1Candidates = normalizeIdCandidates(userId1);
    const userId2Candidates = normalizeIdCandidates(userId2);
    const friendship = await db
      .collection('friendships')
      .findOne({
        $or: [
          {
            requesterId: { $in: userId1Candidates },
            receiverId: { $in: userId2Candidates }
          },
          {
            requesterId: { $in: userId2Candidates },
            receiverId: { $in: userId1Candidates }
          }
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
 * Find friendship by its own ID
 */
async function findFriendshipById(friendshipId) {
  try {
    const db = getDb();
    const friendshipIdCandidates = normalizeIdCandidates(friendshipId);
    return db
      .collection('friendships')
      .findOne({ _id: { $in: friendshipIdCandidates } });
  } catch (error) {
    return mockFriendships.find((friendship) => String(friendship._id) === String(friendshipId));
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
    const userIdCandidates = normalizeIdCandidates(userId);
    const friendships = await db
      .collection('friendships')
      .find({
        $or: [
          { requesterId: { $in: userIdCandidates } },
          { receiverId: { $in: userIdCandidates } }
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
    const userIdCandidates = normalizeIdCandidates(userId);
    const friendships = await db
      .collection('friendships')
      .find({
        receiverId: { $in: userIdCandidates },
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
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return [];
    }

    const normalizedIds = userIds.flatMap((id) => normalizeIdCandidates(id));

    const db = getDb();
    const users = await db
      .collection('users')
      .find({ _id: { $in: normalizedIds } })
      .toArray();

    return users;
  } catch (error) {
    // Fallback to mock data
    return mockUsers.filter(u => userIds.includes(u._id));
  }
}

module.exports = {
  findFriendship,
  findFriendshipById,
  createFriendship,
  updateFriendshipStatus,
  deleteFriendship,
  findAcceptedFriendships,
  findPendingRequests,
  getUsersByIds
};