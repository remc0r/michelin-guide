const reviewsService = require('../services/reviewsService');

/**
 * Create review
 * POST /api/reviews
 */
async function createReview(req, res, next) {
  try {
    const { reservationId, rating, comment, dishRatings } = req.body;

    if (!reservationId || !rating) {
      return res.status(400).json({
        error: 'Reservation ID and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    const review = await reviewsService.createReview({
      userId: req.userId,
      reservationId,
      rating: parseInt(rating),
      comment: comment || '',
      dishRatings: dishRatings || []
    });

    return res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

/**
 * Get review for specific reservation
 * GET /api/reviews/reservation/:reservationId
 */
async function getReviewByReservation(req, res, next) {
  try {
    const { reservationId } = req.params;

    const review = await reviewsService.getReviewByReservationId(reservationId, req.userId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.json(review);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getReviewByReservation
};