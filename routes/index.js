import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';

const router = express.Router();

const verifyJWT = async (req, res, next) => {
  req.authMessage = 'user posses valid token';

  next();
};

router.use('/auth', authRoutes);
router.use('/user', verifyJWT, userRoutes);

export default router;
