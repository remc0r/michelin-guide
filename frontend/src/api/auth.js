import { safeFetch, getUserFriendlyErrorMessage } from '../utils/apiErrorHandler';
import { API_BASE_URL } from './baseUrl';

/**
 * User registration
 */
export async function register(userData) {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * User login
 */
export async function login(email, password) {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(token) {
  if (!token) {
    throw new Error('Failed to get user info');
  }

  try {
    const response = await safeFetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * User logout (client-side token removal)
 */
export async function logout() {
  // In a JWT-only setup, logout is handled client-side
  return { message: 'Logged out successfully' };
}

/**
 * Helper function to get auth headers
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}