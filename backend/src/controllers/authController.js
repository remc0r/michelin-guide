const authService = require('../services/authService');

/**
 * User registration
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const result = await authService.registerUser({
      username,
      email,
      password,
      profile: {
        firstName,
        lastName
      }
    });

    return res.status(201).json({
      user: result.user,
      token: result.token
    });
  } catch (error) {
    next(error);
  }
}

/**
 * User login
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.loginUser(email, password);

    return res.json({
      user: result.user,
      token: result.token
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user info
 * GET /api/auth/me
 */
async function getCurrentUser(req, res, next) {
  try {
    const user = await authService.getUserById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * User logout (client-side token removal)
 * POST /api/auth/logout
 */
async function logout(req, res) {
  // In a JWT-only setup, logout is handled client-side by removing the token
  // This endpoint exists for future refresh token implementation
  return res.json({ message: 'Logged out successfully' });
}

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};