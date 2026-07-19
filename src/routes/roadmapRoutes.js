import { Router } from 'express';
import { getRoadmap } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', protect, asyncHandler(getRoadmap));

export default router;
