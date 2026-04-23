const reservationsService = require('../services/reservationsService');

/**
 * Create reservation
 * POST /api/reservations
 */
async function createReservation(req, res, next) {
  try {
    const { restaurantId, restaurantSlug, reservationDate, partySize } = req.body;

    if (!restaurantId || !restaurantSlug || !reservationDate || !partySize) {
      return res.status(400).json({
        error: 'Restaurant ID, restaurant slug, reservation date, and party size are required'
      });
    }

    const reservation = await reservationsService.createReservation({
      userId: req.userId,
      restaurantId,
      restaurantSlug,
      reservationDate: new Date(reservationDate),
      partySize: parseInt(partySize)
    });

    return res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
}

/**
 * List user's reservations
 * GET /api/reservations
 */
async function getReservations(req, res, next) {
  try {
    const { status } = req.query;

    const reservations = await reservationsService.getReservations(req.userId, { status });

    return res.json(reservations);
  } catch (error) {
    next(error);
  }
}

/**
 * Get reservation details
 * GET /api/reservations/:id
 */
async function getReservation(req, res, next) {
  try {
    const { id } = req.params;

    const reservation = await reservationsService.getReservationById(id, req.userId);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    return res.json(reservation);
  } catch (error) {
    next(error);
  }
}

/**
 * Update reservation status
 * PUT /api/reservations/:id/status
 */
async function updateReservationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const reservation = await reservationsService.updateReservationStatus(id, req.userId, status);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    return res.json(reservation);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateReservationStatus
};