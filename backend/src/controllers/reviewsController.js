const reviewsService = require('../services/reviewsService');

function parseDishRatings(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function extractImageUrls(req) {
  const uploadedImageUrls = (req.files || []).map((file) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/reviews/${file.filename}`;
  });

  const bodyImageUrls = Array.isArray(req.body.imageUrls)
    ? req.body.imageUrls
    : [];

  return [...bodyImageUrls, ...uploadedImageUrls].slice(0, 4);
}

function mapUploadError(error) {
  if (error.code === 'LIMIT_FILE_SIZE') {
    error.statusCode = 400;
    error.message = 'Each image must be smaller than 5MB';
    return;
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    error.statusCode = 400;
    error.message = 'You can upload up to 4 images';
  }
}

/**
 * Create review
 * POST /api/reviews
 */
async function createReview(req, res, next) {
  try {
    const { reservationId, rating, comment, dishRatings } = req.body;
    const parsedRating = parseInt(rating, 10);

    if (!reservationId || Number.isNaN(parsedRating)) {
      return res.status(400).json({
        error: 'Reservation ID and rating are required'
      });
    }

    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    const review = await reviewsService.createReview({
      userId: req.userId,
      reservationId,
      rating: parsedRating,
      comment: comment || '',
      dishRatings: parseDishRatings(dishRatings),
      imageUrls: extractImageUrls(req)
    });

    return res.status(201).json(review);
  } catch (error) {
    mapUploadError(error);
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