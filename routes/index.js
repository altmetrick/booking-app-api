import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', verifyJWT, userRoutes);

export default router;
