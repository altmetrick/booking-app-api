import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import placesRoutes from './places.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', verifyJWT, userRoutes);

router.use('/places', placesRoutes);

export default router;
