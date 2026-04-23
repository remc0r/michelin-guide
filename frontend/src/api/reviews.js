import { getAuthHeaders } from './auth';
import { API_BASE_URL } from './baseUrl';

/**
 * Create review (validates reservation exists and is completed)
 */
export async function createReview(reviewData) {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create review');
  }

  return response.json();
}

/**
 * Get review for specific reservation
 */
export async function getReviewByReservation(reservationId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/reservation/${reservationId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get review');
  }

  return response.json();
}