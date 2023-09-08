import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import placesRoutes from './places.js';
import bookingsRoutes from './bookings.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { validateCreateBookingInput } from '../middleware/validation.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', verifyJWT, userRoutes);

router.use('/places', placesRoutes);
router.use('/bookings', verifyJWT, bookingsRoutes);

export default router;
