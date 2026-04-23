const reviewsRepository = require('../repositories/reviewsRepository');
const reservationsRepository = require('../repositories/reservationsRepository');
const feedRepository = require('../repositories/feedRepository');

/**
 * Create a new review (only for completed reservations)
 */
async function createReview(reviewData) {
  const {
    userId,
    reservationId,
    rating,
    comment,
    dishRatings,
    imageUrls = []
  } = reviewData;

  // Check if reservation exists and belongs to user
  const reservation = await reservationsRepository.getReservationById(reservationId);

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to review this reservation');
  }

  // Check if reservation is completed
  if (reservation.status !== 'completed') {
    throw new Error('Can only review completed reservations');
  }

  // Check if review already exists for this reservation
  const existingReview = await reviewsRepository.getReviewByReservationId(reservationId);
  if (existingReview) {
    throw new Error('Review already exists for this reservation');
  }

  // Create review
  const review = await reviewsRepository.createReview({
    userId,
    reservationId,
    restaurantId: reservation.restaurantId,
    restaurantSlug: reservation.restaurantSlug,
    rating,
    comment,
    dishRatings,
    imageUrls,
    isPublic: false, // Reviews are always private, visible only in friends' feeds
    createdAt: new Date()
  });

  // Create activity for review
  await feedRepository.createActivity({
    userId,
    type: 'review',
    targetId: review._id,
    targetType: 'reservation',
    data: {
      restaurantSlug: reservation.restaurantSlug,
      rating,
      comment: comment ? comment.substring(0, 200) : '', // Truncate for feed display
      imageUrls
    },
    createdAt: new Date()
  });

  return review;
}

/**
 * Get review by reservation ID
 */
async function getReviewByReservationId(reservationId, userId) {
  const review = await reviewsRepository.getReviewByReservationId(reservationId);

  if (!review) {
    return null;
  }

  // Check if review belongs to user
  if (review.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this review');
  }

  return review;
}

module.exports = {
  createReview,
  getReviewByReservationId
};