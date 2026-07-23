import { Router } from 'express';
import { getOnboardingTest, completeOnboarding } from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/test', protect, asyncHandler(getOnboardingTest));
router.post('/complete', protect, asyncHandler(completeOnboarding));

export default router;
