import { Router } from 'express';
import { completeOnboarding } from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/complete', protect, asyncHandler(completeOnboarding));

export default router;
