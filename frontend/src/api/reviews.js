import { getAuthHeaders } from './auth';
import { API_BASE_URL } from './baseUrl';

function getAuthHeaderWithoutContentType() {
  const headers = getAuthHeaders();
  delete headers['Content-Type'];
  return headers;
}

/**
 * Create review (validates reservation exists and is completed)
 */
export async function createReview(reviewData) {
  const formData = new FormData();
  formData.append('reservationId', reviewData.reservationId);
  formData.append('rating', String(reviewData.rating));
  formData.append('comment', reviewData.comment || '');

  (reviewData.images || []).forEach((image) => {
    formData.append('images', image);
  });

  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: getAuthHeaderWithoutContentType(),
    body: formData,
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