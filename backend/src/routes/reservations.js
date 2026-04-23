const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');
const { authenticate } = require('../middleware/auth');

// All reservations routes require authentication
router.use(authenticate);

// POST /api/reservations - Create reservation
router.post('/', reservationsController.createReservation);

// GET /api/reservations - List user's reservations
router.get('/', reservationsController.getReservations);

// GET /api/reservations/:id - Get reservation details
router.get('/:id', reservationsController.getReservation);

// PUT /api/reservations/:id/status - Update reservation status
router.put('/:id/status', reservationsController.updateReservationStatus);

module.exports = router;