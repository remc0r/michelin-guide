const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { authenticate } = require('../middleware/auth');

// All reviews routes require authentication
router.use(authenticate);

// POST /api/reviews - Create review (validates reservation exists and is completed)
router.post('/', reviewsController.createReview);

// GET /api/reviews/reservation/:reservationId - Get review for specific reservation
router.get('/reservation/:reservationId', reviewsController.getReviewByReservation);

module.exports = router;