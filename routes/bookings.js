import express from 'express';

import { validateCreateBookingInput, validateRequest } from '../middleware/validation.js';

import {
  createBooking,
  getAllBookings,
  getOneBooking,
  deleteBooking,
} from '../controllers/bookings.js';

const router = express.Router();

router.get('/', getAllBookings);
router.get('/:id', getOneBooking);
router.post('/', validateCreateBookingInput, validateRequest, createBooking);
router.delete('/:id', deleteBooking);

export default router;
