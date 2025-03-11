import express from 'express';
import authMiddleware  from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserProfile);


export default router;