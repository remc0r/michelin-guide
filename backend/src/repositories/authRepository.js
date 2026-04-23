const { getDb } = require('../db/mongo');
const { ObjectId } = require('mongodb');

function normalizeIdCandidates(value) {
  if (value === undefined || value === null) {
    return [];
  }

  const candidates = [value, String(value)];

  if (ObjectId.isValid(String(value))) {
    candidates.push(new ObjectId(String(value)));
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
const mockUsers = [];

/**
 * Find user by email
 */
async function findByEmail(email) {
  try {
    const db = getDb();
    const user = await db
      .collection('users')
      .findOne({ email: String(email) });
    return user;
  } catch (error) {
    // Fallback to mock data
    return mockUsers.find(u => u.email === email);
  }
}

/**
 * Find user by username
 */
async function findByUsername(username) {
  try {
    const db = getDb();
    const user = await db
      .collection('users')
      .findOne({ username: String(username) });
    return user;
  } catch (error) {
    // Fallback to mock data
    return mockUsers.find(u => u.username === username);
  }
}

/**
 * Create a new user
 */
async function createUser(userData) {
  try {
    const db = getDb();
    const result = await db
      .collection('users')
      .insertOne(userData);

    const createdUser = await db
      .collection('users')
      .findOne({ _id: result.insertedId });

    return createdUser;
  } catch (error) {
    // Fallback to mock data
    const newUser = {
      _id: `user_${Date.now()}`,
      ...userData
    };
    mockUsers.push(newUser);
    return newUser;
  }
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  try {
    const db = getDb();
    const user = await db
      .collection('users')
      .findOne({ _id: { $in: normalizeIdCandidates(userId) } });
    return user;
  } catch (error) {
    // Fallback to mock data
    return mockUsers.find(u => String(u._id) === String(userId));
  }
}

/**
 * Get users by IDs
 */
async function getUsersByIds(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  try {
    const db = getDb();
    const normalizedIds = userIds.flatMap((id) => normalizeIdCandidates(id));
    return db
      .collection('users')
      .find({ _id: { $in: normalizedIds } })
      .toArray();
  } catch (error) {
    const userIdSet = new Set(userIds.map((id) => String(id)));
    return mockUsers.filter((u) => userIdSet.has(String(u._id)));
  }
}

module.exports = {
  findByEmail,
  findByUsername,
  createUser,
  getUserById,
  getUsersByIds
};