const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { getAuthHeaders } from './auth';

/**
 * Get activity feed for friends only
 */
export async function getFeed(page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/feed?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get activity feed');
  }

  return response.json();
}

/**
 * Get user's own activities
 */
export async function getOwnActivities(page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/feed/own?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get own activities');
  }

  return response.json();
}