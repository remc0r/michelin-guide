const { getDb } = require('../db/mongo');

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
      .findOne({ _id: userId });
    return user;
  } catch (error) {
    // Fallback to mock data
    return mockUsers.find(u => u._id === userId);
  }
}

module.exports = {
  findByEmail,
  findByUsername,
  createUser,
  getUserById
};