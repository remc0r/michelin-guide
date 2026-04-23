const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { getAuthHeaders } from './auth';

/**
 * Create reservation
 */
export async function createReservation(reservationData) {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reservation');
  }

  return response.json();
}

/**
 * List user's reservations
 */
export async function getReservations(status = null) {
  let url = `${API_BASE_URL}/api/reservations`;

  if (status) {
    const params = new URLSearchParams({ status });
    url += `?${params}`;
  }

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get reservations');
  }

  return response.json();
}

/**
 * Get reservation details
 */
export async function getReservation(reservationId) {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get reservation');
  }

  return response.json();
}

/**
 * Update reservation status
 */
export async function updateReservationStatus(reservationId, status) {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reservation status');
  }

  return response.json();
}