const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const { getDb } = require('../db/mongo');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Register a new user
 */
async function registerUser(userData) {
  const { username, email, password, profile } = userData;

  // Check if user already exists
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    throw createHttpError('User with this email already exists', 400);
  }

  const existingUsername = await authRepository.findByUsername(username);
  if (existingUsername) {
    throw createHttpError('Username already taken', 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await authRepository.createUser({
    username,
    email,
    passwordHash,
    friends: [],
    profile: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      avatar: '',
      bio: ''
    },
    createdAt: new Date()
  });

  // Generate JWT token
  const token = generateToken(user._id.toString());

  // Return user without password hash
  return {
    user: sanitizeUser(user),
    token
  };
}

/**
 * Login user
 */
async function loginUser(email, password) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw createHttpError('Invalid email or password', 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw createHttpError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user._id.toString());

  // Return user without password hash
  return {
    user: sanitizeUser(user),
    token
  };
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  try {
    const db = getDb();
    const user = await db
      .collection('users')
      .findOne(
        { _id: userId },
        { projection: { passwordHash: 0 } }
      );

    return sanitizeUser(user);
  } catch (error) {
    // Fallback to repository if MongoDB is not configured
    const user = await authRepository.getUserById(userId);
    return sanitizeUser(user);
  }
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate JWT token
 */
function generateToken(userId) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  verifyToken,
  generateToken
};