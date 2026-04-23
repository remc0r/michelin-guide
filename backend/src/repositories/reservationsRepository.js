const { getDb } = require('../db/mongo');

// Mock data fallback
const mockReservations = [];

/**
 * Create a new reservation
 */
async function createReservation(reservationData) {
  try {
    const db = getDb();
    const result = await db
      .collection('reservations')
      .insertOne(reservationData);

    const createdReservation = await db
      .collection('reservations')
      .findOne({ _id: result.insertedId });

    return createdReservation;
  } catch (error) {
    // Fallback to mock data
    const newReservation = {
      _id: `reservation_${Date.now()}`,
      ...reservationData
    };
    mockReservations.push(newReservation);
    return newReservation;
  }
}

/**
 * Get reservations by user ID
 */
async function getReservationsByUserId(userId, filters = {}) {
  try {
    const db = getDb();

    const query = { userId };
    if (filters.status) {
      query.status = filters.status;
    }

    const reservations = await db
      .collection('reservations')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return reservations;
  } catch (error) {
    // Fallback to mock data
    let filteredReservations = mockReservations.filter(r => r.userId === userId);

    if (filters.status) {
      filteredReservations = filteredReservations.filter(r => r.status === filters.status);
    }

    return filteredReservations.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
}

/**
 * Get reservation by ID
 */
async function getReservationById(reservationId) {
  try {
    const db = getDb();
    const reservation = await db
      .collection('reservations')
      .findOne({ _id: reservationId });

    return reservation;
  } catch (error) {
    // Fallback to mock data
    return mockReservations.find(r => r._id === reservationId);
  }
}

/**
 * Update reservation status
 */
async function updateReservationStatus(reservationId, status) {
  const updateData = {
    status,
    updatedAt: new Date()
  };

  if (status === 'completed') {
    updateData.completedAt = new Date();
  }

  try {
    const db = getDb();
    const updatedReservation = await db
      .collection('reservations')
      .findOneAndUpdate(
        { _id: reservationId },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    return updatedReservation;
  } catch (error) {
    // Fallback to mock data
    const reservation = mockReservations.find(r => r._id === reservationId);
    if (reservation) {
      Object.assign(reservation, updateData);
      return reservation;
    }
    return null;
  }
}

module.exports = {
  createReservation,
  getReservationsByUserId,
  getReservationById,
  updateReservationStatus
};