import { Router } from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/me', protect, asyncHandler(getCurrentUser));

export default router;
