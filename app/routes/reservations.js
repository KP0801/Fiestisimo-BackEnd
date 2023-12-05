const express = require('express');
const router = express.Router();
const {authToken, tokenVerifyAdmin} = require('../middlewares/authToken');
const {createReservation, cancelReservation, getAllReservationsByUser, 
    getCanceledReservationsByUser, getAllReservations, updateReservation,getFinalizedReservationsByUser} = require('../controllers/reservations'); 

// Rutas para reservaciones
router.get('/', authToken, getAllReservationsByUser)
router.post('/:productId',authToken, createReservation);
router.delete('/:reservationId', authToken, cancelReservation);
router.get('/cancel', authToken, getCanceledReservationsByUser)
router.get('/finalizada', authToken, getFinalizedReservationsByUser)
router.get('/all', tokenVerifyAdmin, getAllReservations)
router.put('/:reservationId', tokenVerifyAdmin, updateReservation)
module.exports = router;
