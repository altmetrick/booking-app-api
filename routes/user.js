import express from 'express';
import { getUserInfo, updateUserInfo } from '../controllers/user.js';

const router = express.Router();

router.get('/', getUserInfo);
router.put('/', updateUserInfo);

export default router;
