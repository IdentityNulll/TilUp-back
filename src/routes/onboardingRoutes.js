import { Router } from 'express';
import { getPlacementTest, completeOnboarding } from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/placement-test', protect, asyncHandler(getPlacementTest));
router.post('/complete', protect, asyncHandler(completeOnboarding));

export default router;
