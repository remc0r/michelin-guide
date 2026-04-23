import { safeFetch, getUserFriendlyErrorMessage } from '../utils/apiErrorHandler';
import { getAuthHeaders } from './auth';
import { API_BASE_URL } from './baseUrl';

/**
 * Send friend request
 */
export async function sendFriendRequest(friendUsername) {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/friends/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ friendUsername }),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * Accept friend request
 */
export async function acceptFriendRequest(userId) {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/friends/accept/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * Remove friend
 */
export async function removeFriend(userId) {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/friends/remove/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * Get user's friends list
 */
export async function getFriends() {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/friends`, {
      headers: getAuthHeaders(),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}

/**
 * Get pending friend requests
 */
export async function getPendingRequests() {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/friends/pending`, {
      headers: getAuthHeaders(),
    });

    return response.json();
  } catch (error) {
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}