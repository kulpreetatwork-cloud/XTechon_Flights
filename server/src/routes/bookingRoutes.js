import express from 'express';
import {
    createBooking,
    getBookings,
    getBooking,
    downloadTicket,
    getBookingByPNR
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All booking routes are protected
router.use(protect);

router.route('/')
    .post(createBooking)
    .get(getBookings);

router.get('/pnr/:pnr', getBookingByPNR);
router.get('/:id', getBooking);
router.get('/:id/ticket', downloadTicket);

export default router;
