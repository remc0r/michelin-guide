const { getDb } = require('../db/mongo');

// Mock data fallback
const mockReviews = [];

/**
 * Create a new review
 */
async function createReview(reviewData) {
  try {
    const db = getDb();
    const result = await db
      .collection('reviews')
      .insertOne(reviewData);

    const createdReview = await db
      .collection('reviews')
      .findOne({ _id: result.insertedId });

    return createdReview;
  } catch (error) {
    // Fallback to mock data
    const newReview = {
      _id: `review_${Date.now()}`,
      ...reviewData
    };
    mockReviews.push(newReview);
    return newReview;
  }
}

/**
 * Get review by reservation ID
 */
async function getReviewByReservationId(reservationId) {
  try {
    const db = getDb();
    const review = await db
      .collection('reviews')
      .findOne({ reservationId });

    return review;
  } catch (error) {
    // Fallback to mock data
    return mockReviews.find(r => r.reservationId === reservationId);
  }
}

/**
 * Get reviews by user ID
 */
async function getReviewsByUserId(userId) {
  try {
    const db = getDb();
    const reviews = await db
      .collection('reviews')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return reviews;
  } catch (error) {
    // Fallback to mock data
    return mockReviews
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

module.exports = {
  createReview,
  getReviewByReservationId,
  getReviewsByUserId
};