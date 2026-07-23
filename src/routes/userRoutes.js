import { Router } from 'express';
import { getCurrentUser, updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/me', protect, asyncHandler(getCurrentUser));
router.patch('/me', protect, asyncHandler(updateProfile));
router.post('/me/password', protect, asyncHandler(changePassword));

export default router;
