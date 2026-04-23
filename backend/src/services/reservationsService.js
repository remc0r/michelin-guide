const reservationsRepository = require('../repositories/reservationsRepository');
const feedRepository = require('../repositories/feedRepository');

/**
 * Create a new reservation
 */
async function createReservation(reservationData) {
  const reservation = await reservationsRepository.createReservation({
    ...reservationData,
    status: 'confirmed',
    createdAt: new Date()
  });

  // Create activity for reservation
  await feedRepository.createActivity({
    userId: reservationData.userId,
    type: 'reservation',
    targetId: reservation._id,
    targetType: 'reservation',
    data: {
      restaurantSlug: reservationData.restaurantSlug,
      reservationDate: reservationData.reservationDate,
      partySize: reservationData.partySize
    },
    createdAt: new Date()
  });

  return reservation;
}

/**
 * Get user's reservations
 */
async function getReservations(userId, filters = {}) {
  const reservations = await reservationsRepository.getReservationsByUserId(userId, filters);
  return reservations;
}

/**
 * Get reservation by ID
 */
async function getReservationById(reservationId, userId) {
  const reservation = await reservationsRepository.getReservationById(reservationId);

  if (!reservation) {
    return null;
  }

  // Check if reservation belongs to user
  if (reservation.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this reservation');
  }

  return reservation;
}

/**
 * Update reservation status
 */
async function updateReservationStatus(reservationId, userId, status) {
  const reservation = await reservationsRepository.getReservationById(reservationId);

  if (!reservation) {
    return null;
  }

  // Check if reservation belongs to user
  if (reservation.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this reservation');
  }

  // Only allow completing confirmed reservations
  if (status === 'completed' && reservation.status !== 'confirmed') {
    throw new Error('Can only complete confirmed reservations');
  }

  const updatedReservation = await reservationsRepository.updateReservationStatus(
    reservationId,
    status
  );

  // If completed, create visit activity
  if (status === 'completed') {
    await feedRepository.createActivity({
      userId: reservation.userId,
      type: 'visit',
      targetId: reservation.restaurantId,
      targetType: 'restaurant',
      data: {
        restaurantSlug: reservation.restaurantSlug,
        reservationDate: reservation.reservationDate
      },
      createdAt: new Date()
    });
  }

  return updatedReservation;
}

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservationStatus
};