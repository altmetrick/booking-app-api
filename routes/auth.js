import express from 'express';

const router = express.Router();
import { register, login, logout, isLoggedIn } from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/is-logged-in', isLoggedIn);

export default router;
